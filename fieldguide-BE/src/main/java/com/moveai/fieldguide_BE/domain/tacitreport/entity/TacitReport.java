package com.moveai.fieldguide_BE.domain.tacitreport.entity;
import com.moveai.fieldguide_BE.domain.hub.entity.Hub;
import com.moveai.fieldguide_BE.domain.member.entity.Member;
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
@Table(name = "tacit_report")
public class TacitReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hub_idx", nullable = false)
    private Hub hub;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_idx", nullable = false)
    private Member driver;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audio_idx", nullable = false)
    private ReportAudio audio;

    @Column(name = "script", columnDefinition = "TEXT")
    private String script;

    @Column(name = "gpt_json", columnDefinition = "TEXT")
    private String gptJson;

    @Enumerated(EnumType.STRING)
    @Column(name = "completeness_status", nullable = false)
    private  CompletenessStatus completenessStatus;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public TacitReport(Hub hub, Member driver, ReportAudio audio, String script, String gptJson, CompletenessStatus completeness
    ) {
        this.hub = hub;
        this.driver = driver;
        this.audio = audio;
        this.script = script;
        this.gptJson = gptJson;
        this.completenessStatus = completeness;
    }
    public void updateAnalysis(
            String gptJson,
            CompletenessStatus completenessStatus
    ) {
        this.gptJson = gptJson;
        this.completenessStatus = completenessStatus;
    }
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }
}

