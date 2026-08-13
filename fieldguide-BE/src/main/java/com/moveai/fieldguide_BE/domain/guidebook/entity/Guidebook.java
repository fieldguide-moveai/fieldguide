package com.moveai.fieldguide_BE.domain.guidebook.entity;
import com.moveai.fieldguide_BE.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Table(name = "guidebook")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Guidebook{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    // 회원 idx - fk
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_idx", nullable = false)
    private Member member;

    // 추천 거래처 이름 1~5
    @Column(name = "recommend_supplier_name_1")
    private String recommendSupplierName1;

    @Column(name = "recommend_supplier_name_2")
    private String recommendSupplierName2;

    @Column(name = "recommend_supplier_name_3")
    private String recommendSupplierName3;

    @Column(name = "recommend_supplier_name_4")
    private String recommendSupplierName4;

    @Column(name = "recommend_supplier_name_5")
    private String recommendSupplierName5;

    // 추천 거래처 예상 대기 시간 1~5 (분 단위)
    @Column(name = "estimated_wait_time1")
    private Integer estimatedWaitTime1;

    @Column(name = "estimated_wait_time2")
    private Integer estimatedWaitTime2;

    @Column(name = "estimated_wait_time3")
    private Integer estimatedWaitTime3;

    @Column(name = "estimated_wait_time4")
    private Integer estimatedWaitTime4;

    @Column(name = "estimated_wait_time5")
    private Integer estimatedWaitTime5;

    // 추천 거래처 진입 난이도 1~5
    @Column(name = "access_difficulty1")
    private String accessDifficulty1;

    @Column(name = "access_difficulty2")
    private String accessDifficulty2;

    @Column(name = "access_difficulty3")
    private String accessDifficulty3;

    @Column(name = "access_difficulty4")
    private String accessDifficulty4;

    @Column(name = "access_difficulty5")
    private String accessDifficulty5;

    // 추천 거래처 선정 이유 1~5
    @Column(name = "recommendation_reason1", columnDefinition = "TEXT")
    private String recommendationReason1;

    @Column(name = "recommendation_reason2", columnDefinition = "TEXT")
    private String recommendationReason2;

    @Column(name = "recommendation_reason3", columnDefinition = "TEXT")
    private String recommendationReason3;

    @Column(name = "recommendation_reason4", columnDefinition = "TEXT")
    private String recommendationReason4;

    @Column(name = "recommendation_reason5", columnDefinition = "TEXT")
    private String recommendationReason5;

    // 예상 수익 상위 20% 금액
    @Column(name = "top_20_income")
    private Long top20Income;

    // 예상 수익 평균 금액
    @Column(name = "avg_income")
    private Long avgIncome;

    // 예상 수익 하위 20% 금액
    @Column(name = "bottom_20_income")
    private Long bottom20Income;

    // 오더를 가장 많이 수락하는 시간대
    @Column(name = "peak_order_time")
    private LocalDateTime peakOrderTime;

    // 평균 운행 시작 시간
    @Column(name = "avg_start_time")
    private LocalDateTime avgStartTime;

    // 평균 운행 종료 시간
    @Column(name = "avg_end_time")
    private LocalDateTime avgEndTime;

    // 하루 평균 수행 오더 수
    @Column(name = "avg_daily_orders")
    private Integer avgDailyOrders;

    // 시간대별 오더 수락 비중
    @Column(name = "hourly_accept_rate")
    private Double hourlyAcceptRate;

    // AI 인사이트
    @Column(name = "ai_insight", columnDefinition = "TEXT")
    private String aiInsight;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public Guidebook(Member member, String recommendSupplierName1, String recommendSupplierName2, String recommendSupplierName3, String recommendSupplierName4, String recommendSupplierName5,
                     Integer estimatedWaitTime1, Integer estimatedWaitTime2, Integer estimatedWaitTime3, Integer estimatedWaitTime4, Integer estimatedWaitTime5,
                     String accessDifficulty1, String accessDifficulty2, String accessDifficulty3, String accessDifficulty4, String accessDifficulty5,
                     String recommendationReason1, String recommendationReason2, String recommendationReason3, String recommendationReason4, String recommendationReason5,
                     Long top20Income, Long avgIncome, Long bottom20Income, LocalDateTime peakOrderTime, LocalDateTime avgStartTime, LocalDateTime avgEndTime,
                     Integer avgDailyOrders, Double hourlyAcceptRate, String aiInsight) {

        this.member = member;

        this.recommendSupplierName1 = recommendSupplierName1;
        this.recommendSupplierName2 = recommendSupplierName2;
        this.recommendSupplierName3 = recommendSupplierName3;
        this.recommendSupplierName4 = recommendSupplierName4;
        this.recommendSupplierName5 = recommendSupplierName5;

        this.estimatedWaitTime1 = estimatedWaitTime1;
        this.estimatedWaitTime2 = estimatedWaitTime2;
        this.estimatedWaitTime3 = estimatedWaitTime3;
        this.estimatedWaitTime4 = estimatedWaitTime4;
        this.estimatedWaitTime5 = estimatedWaitTime5;

        this.accessDifficulty1 = accessDifficulty1;
        this.accessDifficulty2 = accessDifficulty2;
        this.accessDifficulty3 = accessDifficulty3;
        this.accessDifficulty4 = accessDifficulty4;
        this.accessDifficulty5 = accessDifficulty5;

        this.recommendationReason1 = recommendationReason1;
        this.recommendationReason2 = recommendationReason2;
        this.recommendationReason3 = recommendationReason3;
        this.recommendationReason4 = recommendationReason4;
        this.recommendationReason5 = recommendationReason5;

        this.top20Income = top20Income;
        this.avgIncome = avgIncome;
        this.bottom20Income = bottom20Income;

        this.peakOrderTime = peakOrderTime;
        this.avgStartTime = avgStartTime;
        this.avgEndTime = avgEndTime;

        this.avgDailyOrders = avgDailyOrders;
        this.hourlyAcceptRate = hourlyAcceptRate;
        this.aiInsight = aiInsight;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }
}