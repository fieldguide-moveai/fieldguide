package com.moveai.fieldguide_BE.domain.tacitknowledge.entity;
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
@Table(name = "tacit_knowledge")
public class TacitKnowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    // 물류센터(허브) - fk
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hub_id", nullable = false)
    private Hub hub;

    // 지식 유형: 운영 / 안전
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private KnowledgeType type;

    // 관련된 주제 (ENTRY, WAITING, SLIPPERY, TIMING, WARNING, EQUIPMENT ...)
    @Column(name = "topic", nullable = false, length = 30)
    private String topic;

    // 관련 위치 (topic에 따라 필수/선택이 갈림, null 가능)
    @Column(name = "location", length = 100)
    private String location;

    // 조건 정보 (condition_json)
    @Embedded
    private ConditionInfo condition;

    // 최종적으로 보여줄 내용 정리본
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // 검증 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    private VerificationsStatus verificationStatus;

    // 이 정보가 맞다고 확인한 서로 다른 운송인 수
    @Column(name = "support_count", nullable = false)
    private Long supportCount;

    // 이 정보와 반대되거나 모른다는 응답 수
    @Column(name = "conflict_count", nullable = false)
    private Long conflictCount;

    // 검증완료(VERIFIED)로 전환된 시점
    @Column(name = "verified_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime verifiedAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime updatedAt;

    @Builder
    public TacitKnowledge(
            Hub hub,
            KnowledgeType type,
            String topic,
            String location,
            ConditionInfo condition,
            String content
    ) {
        this.hub = hub;
        this.type = type;
        this.topic = topic;
        this.location = location;
        this.condition = condition;
        this.content = content;

        this.supportCount = 1L;
        this.conflictCount = 0L;
        this.verificationStatus = VerificationsStatus.UNVERIFIED;
    }

    @PrePersist
    public void prePersist() {
        ZonedDateTime now =
                LocalDateTime.now()
                        .atZone(ZoneId.of("Asia/Seoul"));

        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt =
                LocalDateTime.now()
                        .atZone(ZoneId.of("Asia/Seoul"));
    }

    public void increaseSupport() {
        this.supportCount++;

        if (this.supportCount >= 2) {
            this.verificationStatus = VerificationsStatus.VERIFIED;

            if (this.verifiedAt == null) {
                this.verifiedAt =
                        ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
            }
        }
    }
    public void increaseConflict() {
        this.conflictCount++;

        if (this.conflictCount >= 3) {
            this.verificationStatus = VerificationsStatus.EXPIRED;
        } else {
            this.verificationStatus = VerificationsStatus.CONFLICT;
        }
    }
//    support = 1
//            → UNVERIFIED
//
//    support >= 2
//            → VERIFIED
//
//            conflict = 1~2
//            → CONFLICT
//
//    conflict >= 3
//            → EXPIRED
}