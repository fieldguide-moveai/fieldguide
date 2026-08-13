package com.moveai.fieldguide_BE.domain.onboarding.entity;
import com.moveai.fieldguide_BE.domain.member.entity.Member;
import com.moveai.fieldguide_BE.domain.region.entity.Region;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
@Entity
@Table(name = "onboarding")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Onboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    // 회원 idx - fk
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_idx", nullable = false)
    private Member member;

    // 운송 경력 (년)
    @Column(name = "career", nullable = false)
    private Integer career;

    // 선호 상차지 지역 - fk
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_region_id")
    private Region loadRegion;

    // 선호 하차지 지역 - fk
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unload_region_id")
    private Region unloadRegion;

    // 선호 상차지 반경 (km)
    @Column(name = "load_radius")
    private Long loadRadius;

    // 운행 형태 (독차 / 혼적)
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransportType type;

    // 선호하는 운행 시작 시간
    @Column(name = "start_time")
    private LocalDateTime startTime;

    // 선호하는 운행 종료 시간
    @Column(name = "end_time")
    private LocalDateTime  endTime;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    // 운행 형태 Enum
    public enum TransportType {
        SOLO,   // 독차
        MIXED   // 혼적
    }

    @Builder
    public Onboarding(Member member, Integer career, Region loadRegion, Region unloadRegion,
                      Long loadRadius, TransportType type, LocalDateTime startTime, LocalDateTime endTime) {
        this.member = member;
        this.career = career;
        this.loadRegion = loadRegion;
        this.unloadRegion = unloadRegion;
        this.loadRadius = loadRadius;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }


    // ===== 수정 메서드 (필요 시 사용) =====
//    public void updatePreferences(Region loadRegion, Region unloadRegion, Long loadRadius,
//                                  TransportType type, LocalTime startTime, LocalTime endTime) {
//        this.loadRegion = loadRegion;
//        this.unloadRegion = unloadRegion;
//        this.loadRadius = loadRadius;
//        this.type = type;
//        this.startTime = startTime;
//        this.endTime = endTime;
//    }
}