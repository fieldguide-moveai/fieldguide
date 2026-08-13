package com.moveai.fieldguide_BE.domain.validation.entity;
import com.moveai.fieldguide_BE.domain.member.entity.Member;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.TacitKnowledge;
import com.moveai.fieldguide_BE.domain.tacitreport.entity.TacitReport;
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
@Table(name = "validation")
public class Validation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private TacitReport report;

    @ManyToOne
    @JoinColumn(name = "knowledge_id")
    private TacitKnowledge knowledge;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "question")
    private String question;

    @Column(name = "answer")
    private String answer;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Builder
    public Validation(
            TacitReport report,
            TacitKnowledge knowledge,
            Member member,
            String question
    ) {
        this.report = report;
        this.knowledge = knowledge;
        this.member = member;
        this.question = question;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul"));
    }

    public void answer(String answer) {
        this.answer = answer;
    }
}
