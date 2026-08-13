package com.moveai.fieldguide_BE.domain.tacitreport.repository;

import com.moveai.fieldguide_BE.domain.tacitreport.entity.CompletenessStatus;
import com.moveai.fieldguide_BE.domain.tacitreport.entity.TacitReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TacitReportRepository
        extends JpaRepository<TacitReport, Long> {

    List<TacitReport>
    findByHub_IdAndCompletenessStatusOrderByCreatedAtAsc(
            Long hubId,
            CompletenessStatus completenessStatus
    );
}
