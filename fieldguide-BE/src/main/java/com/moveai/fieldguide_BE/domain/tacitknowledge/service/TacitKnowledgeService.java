package com.moveai.fieldguide_BE.domain.tacitknowledge.service;

import com.moveai.fieldguide_BE.domain.tacitknowledge.dto.KnowledgeMatchResult;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.*;
import com.moveai.fieldguide_BE.domain.tacitknowledge.repository.TacitKnowledgeRepository;
import com.moveai.fieldguide_BE.domain.tacitreport.dto.TacitAnalysisResult;
import com.moveai.fieldguide_BE.domain.tacitreport.entity.TacitReport;
import com.moveai.fieldguide_BE.domain.tacitreport.service.TacitAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TacitKnowledgeService {

    private final TacitKnowledgeRepository tacitKnowledgeRepository;
    private final TacitAiService tacitAiService;

    @Transactional
    public TacitKnowledge process(
            TacitReport report,
            TacitAnalysisResult analysis
    ) {

        String location =
                analysis.location.orElse(null);

        List<TacitKnowledge> candidates =
                tacitKnowledgeRepository
                        .findByHub_IdAndTypeAndTopicAndLocation(
                                report.getHub().getId(),
                                analysis.type,
                                analysis.topic,
                                location
                        );

        KnowledgeMatchResult match =
                tacitAiService.matchKnowledge(
                        analysis,
                        candidates
                );

        switch (match.matchType) {

            case SAME -> {

                Long knowledgeId =
                        match.knowledgeId.orElseThrow();

                TacitKnowledge knowledge =
                        tacitKnowledgeRepository
                                .findById(knowledgeId)
                                .orElseThrow();

                knowledge.increaseSupport();

                return knowledge;
            }

            case CONFLICT -> {

                Long knowledgeId =
                        match.knowledgeId.orElseThrow();

                TacitKnowledge knowledge =
                        tacitKnowledgeRepository
                                .findById(knowledgeId)
                                .orElseThrow();

                knowledge.increaseConflict();

                return knowledge;
            }

            case DIFFERENT -> {

                TacitKnowledge knowledge =
                        TacitKnowledge.builder()
                                .hub(report.getHub())
                                .type(analysis.type)
                                .topic(analysis.topic)
                                .location(location)
                                .condition(
                                        toConditionInfo(
                                                analysis.conditions
                                        )
                                )
                                .content(analysis.content)
                                .build();

                return tacitKnowledgeRepository
                        .save(knowledge);
            }

            default ->
                    throw new IllegalStateException(
                            "알 수 없는 Knowledge 매칭 결과"
                    );
        }
    }


    private ConditionInfo toConditionInfo(
            TacitAnalysisResult.ConditionResult condition
    ) {

        return new ConditionInfo(
                condition.weather.orElse(null),
                condition.timeOfDay.orElse(null),
                condition.dayType.orElse(null),
                condition.vehicleCondition.orElse(null),
                condition.season.orElse(null)
        );
    }
}
