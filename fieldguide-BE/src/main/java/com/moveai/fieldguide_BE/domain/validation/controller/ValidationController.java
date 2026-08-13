package com.moveai.fieldguide_BE.domain.validation.controller;

import com.moveai.fieldguide_BE.domain.validation.dto.*;
import com.moveai.fieldguide_BE.domain.validation.service.ValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/validations")
public class ValidationController {

    private final ValidationService validationService;


    @GetMapping("/next")
    public Optional<ValidationResponse> getNext(
            @RequestParam Long hubId,
            @RequestParam Long memberId
    ) {

        return validationService.getNext(
                hubId,
                memberId
        );
    }


    @PostMapping("/{validationId}/answer")
    public void answer(
            @PathVariable Long validationId,
            @RequestBody ValidationAnswerRequest request
    ) throws Exception {

        validationService.answer(
                validationId,
                request.answer()
        );
    }
}