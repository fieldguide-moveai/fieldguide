package com.moveai.fieldguide_BE.domain.tacitreport.dto;


import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.KnowledgeType;
import com.moveai.fieldguide_BE.domain.tacitreport.entity.CompletenessStatus;

import java.util.Optional;

public class TacitAnalysisResult {

    public KnowledgeType type;

    public String topic;

    public Optional<String> location;

    public ConditionResult conditions;

    public String content;

    public CompletenessStatus completeness;

    public static class ConditionResult {

        public Optional<String> weather;

        public Optional<String> timeOfDay;

        public Optional<String> dayType;

        public Optional<String> vehicleCondition;

        public Optional<String> season;
    }
}