package com.moveai.fieldguide_BE.domain.hub.entity;

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
@Table(name = "hub")
public class Hub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(length = 30)
    private String name;

    // 위도
    @Column
    private double lat;

    // 경도
    @Column
    private double lng;

    // 물류센터 주소
    @Column(length = 255)
    private String address;

    // 물류센터 전화번호
    @Column(length = 20)
    private String tel;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public Hub(String name, double lat, double lng, String address, String tel) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.address = address;
        this.tel = tel;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }
}

