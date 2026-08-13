package com.moveai.fieldguide_BE.domain.tacitknowledge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "condition_info")
public class ConditionInfo {

    @Column(name = "weather", length = 20)
    private String weather;            // 우천 / 맑음 / 적설 / null

    @Column(name = "time_of_day", length = 20)
    private String timeOfDay;          // 오전 / 오후 / 야간 / null

    @Column(name = "day_type", length = 20)
    private String dayType;            // 평일 / 주말 / null

    @Column(name = "vehicle_condition", length = 50)
    private String vehicleCondition;   // 있을 때만 (예: "11톤 이상")

    @Column(name = "season", length = 20)
    private String season;             // 동절기 / 하절기 / null
}