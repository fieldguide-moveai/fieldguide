package com.moveai.fieldguide_BE.domain.validation.dto;

public class ValidationJudgeResult {

    public Verdict verdict;

    public enum Verdict {
        SUPPORT,
        CONFLICT,
        UNKNOWN
    }
//    SUPPORT
//    → supportCount++
//
//        CONFLICT
//    → conflictCount++
//
//        UNKNOWN("모르겠어요")
//    → conflictCount++
}
