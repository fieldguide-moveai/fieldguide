package com.moveai.fieldguide_BE.domain.tacitreport.dto;


import com.moveai.fieldguide_BE.domain.tacitreport.entity.CompletenessStatus;

public record TacitReportResponse(
        Long reportId,
        String script,
        CompletenessStatus completeness,
        Long knowledgeId
) {
}
