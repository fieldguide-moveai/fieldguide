package com.moveai.fieldguide_BE.domain.region.entity;
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
@Table(name = "region")
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private long id;

    @Column(name = "si_do")
    private String siDo;

    @Column(name = "si_gun_gu")
    private String siGunGu;

    @Column(name = "eup_myeon_dong")
    private String eupMyeonDong;

    @Column(name = "li")
    private String li;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;
}
