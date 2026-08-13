package com.moveai.fieldguide_BE.domain.estimate.entity;

import com.moveai.fieldguide_BE.domain.member.entity.Member;
import com.moveai.fieldguide_BE.domain.order.entity.Order;
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
@Table(name = "estimate")
public class Estimate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    // 사용자 idx - fk
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_idx", nullable = false)
    private Member member;

    // 오더 idx - fk
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_idx", nullable = false, unique = true)
    private Order order;

    // 운송인 현재 위치 위도
    @Column(name = "driver_lat", nullable = false)
    private double driverLat;

    // 운송인 현재 위치 경도
    @Column(name = "driver_lng", nullable = false)
    private double driverLng;

    // 공차 이동 연료비
    @Column(name = "empty_fuel_cost", nullable = false)
    private Long emptyFuelCost;

    // 실제 운행 연료비
    @Column(name = "trip_fuel_cost", nullable = false)
    private Long tripFuelCost;

    // 톨비 추정 금액
    @Column(name = "toll_cost", nullable = false)
    private Long tollCost;

    // 예상 실수령액
    @Column(name = "net_earn", nullable = false)
    private Long netEarn;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public Estimate(Member member, Order order, double driverLat, double driverLng, Long emptyFuelCost,
                    Long tripFuelCost, Long tollCost, Long netEarn) {
        this.member = member;
        this.order = order;
        this.driverLat = driverLat;
        this.driverLng = driverLng;
        this.emptyFuelCost = emptyFuelCost;
        this.tripFuelCost = tripFuelCost;
        this.tollCost = tollCost;
        this.netEarn = netEarn;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }

}
