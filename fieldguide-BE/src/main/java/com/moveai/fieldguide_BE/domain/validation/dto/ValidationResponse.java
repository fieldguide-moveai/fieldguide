package com.moveai.fieldguide_BE.domain.validation.dto;


public record ValidationResponse(
        Long validationId,
        String question,
        String validationType
) {
}
