package com.moveai.fieldguide_BE.domain.validation.repository;


import com.moveai.fieldguide_BE.domain.validation.entity.Validation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ValidationRepository
        extends JpaRepository<Validation, Long> {

    boolean existsByReport_IdAndMember_Id(
            Long reportId,
            Long memberId
    );

    boolean existsByKnowledge_IdAndMember_Id(
            Long knowledgeId,
            Long memberId
    );
}
