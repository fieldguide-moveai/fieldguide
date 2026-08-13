package com.moveai.fieldguide_BE.domain.tacitreport.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.moveai.fieldguide_BE.domain.tacitreport.repository.ReportAudioRepository;
import tools.jackson.databind.json.JsonMapper;
import com.moveai.fieldguide_BE.domain.hub.entity.Hub;
import com.moveai.fieldguide_BE.domain.hub.repository.HubRepository;
import com.moveai.fieldguide_BE.domain.member.entity.Member;
import com.moveai.fieldguide_BE.domain.member.repository.MemberRepository;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.TacitKnowledge;
import com.moveai.fieldguide_BE.domain.tacitknowledge.service.TacitKnowledgeService;
import com.moveai.fieldguide_BE.domain.tacitreport.dto.TacitAnalysisResult;
import com.moveai.fieldguide_BE.domain.tacitreport.dto.TacitReportResponse;
import com.moveai.fieldguide_BE.domain.tacitreport.entity.*;
import com.moveai.fieldguide_BE.domain.tacitreport.repository.TacitReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class TacitReportService {

    private final AudioTranscriptionService audioTranscriptionService;
    private final TacitAiService tacitAiService;

    private final TacitReportRepository tacitReportRepository;
    private final ReportAudioRepository reportAudioRepository;
    private final HubRepository hubRepository;
    private final MemberRepository memberRepository;

    private final TacitKnowledgeService tacitKnowledgeService;

    private final JsonMapper jsonMapper;


    public TacitReportResponse create(
            Long hubId,
            Long memberId,
            MultipartFile file
    ) throws Exception {

        Hub hub = hubRepository
                .findById(hubId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 Hub입니다. hubId=" + hubId
                        )
                );

        Member driver = memberRepository
                .findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 Member입니다. memberId=" + memberId
                        )
                );

        // 1. STT
        String script =
                audioTranscriptionService.transcribe(file);

        // 2. GPT 구조화
        TacitAnalysisResult analysis =
                tacitAiService.analyze(script);

        // 3. 백엔드에서도 COMPLETE 재검증
        CompletenessStatus completeness =
                determineCompleteness(analysis);

        // 4. GPT 결과 JSON 저장
        String gptJson =
                jsonMapper.writeValueAsString(analysis);

        /*
         * 여기 ReportAudio는 기존에 네가 저장하는 로직 사용.
         *
         * ReportAudio audio = ...
         */

//        ReportAudio audio = null; // 실제 저장 로직으로 교체
        ReportAudio audio = ReportAudio.builder()
                .audioData(
                        file.getOriginalFilename() != null
                                ? file.getOriginalFilename()
                                : "TEMP_AUDIO"
                )
                .build();

        reportAudioRepository.save(audio);

        TacitReport report =
                TacitReport.builder()
                        .hub(hub)
                        .driver(driver)
                        .audio(audio)
                        .script(script)
                        .gptJson(gptJson)
                        .completeness(completeness)
                        .build();

        tacitReportRepository.save(report);

        Long knowledgeId = null;

        // 5. COMPLETE일 때만 Knowledge 처리
        if (completeness
                == CompletenessStatus.COMPLETE) {

            TacitKnowledge knowledge =
                    tacitKnowledgeService.process(
                            report,
                            analysis
                    );

            knowledgeId = knowledge.getId();
        }

        return new TacitReportResponse(
                report.getId(),
                script,
                completeness,
                knowledgeId
        );
    }
    private CompletenessStatus determineCompleteness(
            TacitAnalysisResult analysis
    ) {

        boolean locationRequired =
                switch (analysis.topic) {

                    case "ENTRY",
                         "WAITING",
                         "SLIPPERY",
                         "WARNING" -> true;

                    default -> false;
                };

        if (locationRequired
                && analysis.location.isEmpty()) {

            return CompletenessStatus.INCOMPLETE;
        }

        return CompletenessStatus.COMPLETE;
    }
}
