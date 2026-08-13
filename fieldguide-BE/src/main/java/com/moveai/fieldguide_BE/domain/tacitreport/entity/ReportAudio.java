package com.moveai.fieldguide_BE.domain.tacitreport.entity;

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
@Table(name = "report_audio")
public class ReportAudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @Column(name = "audio_data", nullable = false)
    private String audioData; // 로컬 파일로 저장해서 그 경로를 알려주는식으로.

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public ReportAudio(String audioData, String fileName, String contentType) {
        this.audioData = audioData;
    }

    @Builder
    public ReportAudio(String audioData) {
        this.audioData = audioData;
    }
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }
}

