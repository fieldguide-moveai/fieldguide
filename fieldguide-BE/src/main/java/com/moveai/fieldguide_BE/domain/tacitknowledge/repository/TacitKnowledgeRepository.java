package com.moveai.fieldguide_BE.domain.tacitknowledge.repository;


import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.KnowledgeType;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.TacitKnowledge;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.VerificationsStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TacitKnowledgeRepository
        extends JpaRepository<TacitKnowledge, Long> {

    List<TacitKnowledge>
    findByHub_IdAndTypeAndTopicAndLocation(
            Long hubId,
            KnowledgeType type,
            String topic,
            String location
    );

    List<TacitKnowledge>
    findByHub_IdAndVerificationStatusOrderByCreatedAtAsc(
            Long hubId,
            VerificationsStatus status
    );
}