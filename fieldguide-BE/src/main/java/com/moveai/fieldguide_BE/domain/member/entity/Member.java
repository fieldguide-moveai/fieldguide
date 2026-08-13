package com.moveai.fieldguide_BE.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(length = 30)
    private String name;

    @Column(name = "career_years")
    private int careerYears;

    @Column(name = "truck_ton") // 차량 톤수
    private double truckTon;

    @Column(length = 30)    // 차종
    private String vehicle;

    @Column(name = "temp_control")  // 온도 관리 시스템 유무
    private boolean tempControl;

    @Column(name = "box_type", length = 30) // 적재함 기준
    private String boxType;

    @Column(name = "has_lift") // 리프트 유무
    private boolean hasLift;

    @Column(nullable = false)
    private Long point = 0L; // 기본값 0

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public Member(String name, int careerYears, double truckTon, String vehicle, boolean tempControl,
                  String boxType, boolean hasLift) {
        this.name = name;
        this.careerYears = careerYears;
        this.truckTon = truckTon;
        this.vehicle = vehicle;
        this.tempControl = tempControl;
        this.boxType = boxType;
        this.hasLift = hasLift;
        this.point = 0L;
    }
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }
}