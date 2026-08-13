package com.moveai.fieldguide_BE.domain.tacitknowledge.entity;

public enum VerificationsStatus {
    UNVERIFIED,  // 미검증
    VERIFIED,    // 검증완료
    CONFLICT,    // 상충
    EXPIRED      // 만료 (반복 반박으로 신뢰 상실)
}