package com.moveai.fieldguide_BE.domain.tacitknowledge.dto;


import java.util.Optional;

public class KnowledgeMatchResult {

    public MatchType matchType;

    public Optional<Long> knowledgeId;

    public enum MatchType {
        SAME,
        CONFLICT,
        DIFFERENT
    }
}
