package com.moveai.fieldguide_BE.domain.tacitreport.service;

import com.openai.client.OpenAIClient;
import com.openai.models.audio.AudioModel;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import com.openai.models.audio.transcriptions.TranscriptionCreateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
public class AudioTranscriptionService {

    private final OpenAIClient openAIClient;

    public String transcribe(MultipartFile audioFile) throws IOException {

        String originalFilename = audioFile.getOriginalFilename();

        String extension = ".wav";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(
                    originalFilename.lastIndexOf(".")
            );
        }

        Path tempFile = Files.createTempFile("fieldguide-audio-", extension);

        try {
            audioFile.transferTo(tempFile);

            TranscriptionCreateParams params =
                    TranscriptionCreateParams.builder()
                            .file(tempFile)
                            .model(AudioModel.GPT_TRANSCRIBE)
                            .language("ko")
                            .build();

            TranscriptionCreateResponse response =
                    openAIClient.audio()
                            .transcriptions()
                            .create(params);

            return response.asTranscription().text();

        } finally {
            Files.deleteIfExists(tempFile);
        }
    }
}
