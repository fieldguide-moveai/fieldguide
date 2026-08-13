package com.moveai.fieldguide_BE.domain.tacitreport.repository;


import com.moveai.fieldguide_BE.domain.tacitreport.entity.ReportAudio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportAudioRepository
        extends JpaRepository<ReportAudio, Long> {
}
