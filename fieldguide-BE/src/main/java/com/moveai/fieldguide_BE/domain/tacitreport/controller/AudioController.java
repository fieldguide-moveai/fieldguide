package com.moveai.fieldguide_BE.domain.tacitreport.controller;


import com.moveai.fieldguide_BE.domain.tacitreport.service.AudioTranscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/audio")
public class AudioController {

    private final AudioTranscriptionService audioTranscriptionService;

    @PostMapping("/transcribe")
    public String transcribe(@RequestPart("file") MultipartFile file) throws Exception {
        return audioTranscriptionService.transcribe(file);
    }
}
