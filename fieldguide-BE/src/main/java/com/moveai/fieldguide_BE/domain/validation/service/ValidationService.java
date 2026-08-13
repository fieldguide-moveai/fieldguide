package com.moveai.fieldguide_BE.domain.validation.service;

import tools.jackson.databind.json.JsonMapper;
import com.moveai.fieldguide_BE.domain.member.entity.Member;
import com.moveai.fieldguide_BE.domain.member.repository.MemberRepository;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.*;
import com.moveai.fieldguide_BE.domain.tacitknowledge.repository.TacitKnowledgeRepository;
import com.moveai.fieldguide_BE.domain.tacitknowledge.service.TacitKnowledgeService;
import com.moveai.fieldguide_BE.domain.tacitreport.dto.TacitAnalysisResult;
import com.moveai.fieldguide_BE.domain.tacitreport.entity.*;
import com.moveai.fieldguide_BE.domain.tacitreport.repository.TacitReportRepository;
import com.moveai.fieldguide_BE.domain.tacitreport.service.TacitAiService;
import com.moveai.fieldguide_BE.domain.validation.dto.*;
import com.moveai.fieldguide_BE.domain.validation.entity.Validation;
import com.moveai.fieldguide_BE.domain.validation.repository.ValidationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ValidationService {

    private final ValidationRepository validationRepository;
    private final TacitReportRepository tacitReportRepository;
    private final TacitKnowledgeRepository tacitKnowledgeRepository;
    private final MemberRepository memberRepository;

    private final TacitAiService tacitAiService;
    private final TacitKnowledgeService tacitKnowledgeService;

    private final JsonMapper jsonMapper;
    @Transactional
    public Optional<ValidationResponse> getNext(
            Long hubId,
            Long memberId
    ) {

        Member member =
                memberRepository.findById(memberId)
                        .orElseThrow();


        // ===============================
        // 1순위 INCOMPLETE
        // ===============================

        List<TacitReport> incompleteReports =
                tacitReportRepository
                        .findByHub_IdAndCompletenessStatusOrderByCreatedAtAsc(
                                hubId,
                                CompletenessStatus.INCOMPLETE
                        );

        for (TacitReport report : incompleteReports) {

            // 본인이 작성한 Report는 제외
            if (report.getDriver().getId()
                    .equals(memberId)) {
                continue;
            }

            // 이미 이 운송인에게 물어봤으면 제외
            if (validationRepository
                    .existsByReport_IdAndMember_Id(
                            report.getId(),
                            memberId
                    )) {
                continue;
            }

            TacitAnalysisResult analysis =
                    readAnalysis(report);

            String question =
                    createIncompleteQuestion(
                            analysis
                    );

            Validation validation =
                    Validation.builder()
                            .report(report)
                            .knowledge(null)
                            .member(member)
                            .question(question)
                            .build();

            validationRepository.save(validation);

            return Optional.of(
                    new ValidationResponse(
                            validation.getId(),
                            question,
                            "REPORT"
                    )
            );
        }
        // ===============================
        // 2순위 UNVERIFIED
        // ===============================

        List<TacitKnowledge> knowledges =
                tacitKnowledgeRepository
                        .findByHub_IdAndVerificationStatusOrderByCreatedAtAsc(
                                hubId,
                                VerificationsStatus.UNVERIFIED
                        );

        for (TacitKnowledge knowledge : knowledges) {

            if (validationRepository
                    .existsByKnowledge_IdAndMember_Id(
                            knowledge.getId(),
                            memberId
                    )) {
                continue;
            }

            String question =
                    """
                            다음 현장 정보가 현재도 맞나요?

                            "%s"
                            """.formatted(
                            knowledge.getContent()
                    );

            Validation validation =
                    Validation.builder()
                            .report(null)
                            .knowledge(knowledge)
                            .member(member)
                            .question(question)
                            .build();

            validationRepository.save(validation);

            return Optional.of(
                    new ValidationResponse(
                            validation.getId(),
                            question,
                            "KNOWLEDGE"
                    )
            );
        }

        return Optional.empty();
    }

    private String createIncompleteQuestion(
            TacitAnalysisResult result
    ) {

        return switch (result.topic) {

            case "ENTRY",
                 "WAITING",
                 "SLIPPERY",
                 "WARNING" -> """
                    "%s"라는 현장 정보가 있습니다.
                    이 정보가 적용되는 정확한 위치가 어디인가요?
                    """.formatted(result.content);

            default -> "이 현장 정보에 대해 추가로 알고 있는 내용이 있나요?";
        };
    }

    private TacitAnalysisResult readAnalysis(
            TacitReport report
    ) {

        try {

            return jsonMapper.readValue(
                    report.getGptJson(),
                    TacitAnalysisResult.class
            );

        } catch (Exception e) {

            throw new IllegalStateException(
                    "TacitReport GPT JSON 파싱 실패",
                    e
            );
        }
    }

    @Transactional
    public void answer(
            Long validationId,
            String answer
    ) throws Exception {

        Validation validation =
                validationRepository
                        .findById(validationId)
                        .orElseThrow();

        validation.answer(answer);


        if (validation.getReport() != null) {

            processIncompleteReport(
                    validation,
                    answer
            );

            return;
        }


        if (validation.getKnowledge() != null) {

            processKnowledgeValidation(
                    validation,
                    answer
            );
        }
    }

    private void processIncompleteReport(
            Validation validation,
            String answer
    ) throws Exception {

        TacitReport report =
                validation.getReport();

        String combined = """
                기존 운송인 보고:
                %s

                추가 검증 답변:
                %s

                추가 검증 답변은
                기존 보고의 부족한 정보를 보완하기 위한 것입니다.

                기존 보고의 의미를 변경하지 말고,
                추가 답변에서 확인된 정보만 보완하세요.
                """.formatted(
                report.getScript(),
                answer
        );

        TacitAnalysisResult completed =
                tacitAiService.analyze(combined);

        CompletenessStatus completeness =
                determineCompleteness(completed);

        String json =
                jsonMapper.writeValueAsString(
                        completed
                );

        report.updateAnalysis(
                json,
                completeness
        );


        // 아직도 정보 부족
        if (completeness
                == CompletenessStatus.INCOMPLETE) {

            return;
        }


        // COMPLETE 됨
        tacitKnowledgeService.process(
                report,
                completed
        );
    }

    private void processKnowledgeValidation(
            Validation validation,
            String answer
    ) {

        TacitKnowledge knowledge =
                validation.getKnowledge();

        ValidationJudgeResult result =
                tacitAiService.judgeValidation(
                        knowledge,
                        answer
                );


        switch (result.verdict) {

            case SUPPORT -> knowledge.increaseSupport();


            case CONFLICT,
                 UNKNOWN -> knowledge.increaseConflict();
        }
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