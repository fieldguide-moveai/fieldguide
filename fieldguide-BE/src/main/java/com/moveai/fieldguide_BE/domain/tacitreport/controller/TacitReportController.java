package com.moveai.fieldguide_BE.domain.tacitreport.controller;

import com.moveai.fieldguide_BE.domain.tacitreport.dto.TacitReportResponse;
import com.moveai.fieldguide_BE.domain.tacitreport.service.TacitReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacit-reports")
public class TacitReportController {

    private final TacitReportService tacitReportService;

    @PostMapping
    public TacitReportResponse create(
            @RequestParam Long hubId,
            @RequestParam Long memberId,
            @RequestPart("file") MultipartFile file
    ) throws Exception {

        return tacitReportService.create(
                hubId,
                memberId,
                file
        );
    }
}