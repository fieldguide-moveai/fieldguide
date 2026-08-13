package com.moveai.fieldguide_BE.domain.order.entity;

import com.moveai.fieldguide_BE.domain.hub.entity.Hub;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    // 운임 금액
    @Column(nullable = false)
    private Long fare;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_hub_idx")
    private Hub pickupHub;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dropoff_hub_idx")
    private Hub dropoffHub;

    // 수락 여부
    @Column(nullable = false)
    private boolean accepted = false;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public Order(Long fare, Hub pickupHub, Hub dropoffHub) {
        this.fare = fare;
        this.pickupHub = pickupHub;
        this.dropoffHub = dropoffHub;
        this.accepted = false;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }

}
