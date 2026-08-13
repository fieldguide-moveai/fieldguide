package com.moveai.fieldguide_BE.domain.tacitreport.service;

import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.ConditionInfo;
import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.StructuredChatCompletionCreateParams;
import com.moveai.fieldguide_BE.domain.tacitknowledge.dto.KnowledgeMatchResult;
import com.moveai.fieldguide_BE.domain.tacitknowledge.entity.TacitKnowledge;
import com.moveai.fieldguide_BE.domain.tacitreport.dto.TacitAnalysisResult;
import com.moveai.fieldguide_BE.domain.validation.dto.ValidationJudgeResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TacitAiService {

    private final OpenAIClient openAIClient;

    private static final String ANALYSIS_PROMPT = """
            당신은 물류센터 운송 현장의 음성 메모를
            구조화된 암묵지 정보로 변환하는 분석기입니다.

            사용자가 실제로 말하지 않은 내용은 절대 추측하거나 생성하지 마세요.

            ====================
            [TYPE]
            ====================

            OPERATION:
            진입, 대기, 상하차, 하역, 시설, 장비,
            운영 시간 등 현장 운영 정보

            SAFETY:
            미끄럼, 충돌 위험, 사각지대,
            구조적 위험 등 안전 관련 정보


            ====================
            [TOPIC]
            ====================

            반드시 아래 값 중 하나만 선택하세요.

            ENTRY
            - 차량 진입 방법 및 진입로

            WAITING
            - 차량 대기 위치 및 대기 방법

            LOADING
            - 상차 관련

            UNLOADING
            - 하차 관련

            HANDLING
            - 하역 작업 관련

            FACILITY
            - 화장실, 주차장 등의 시설

            SLIPPERY
            - 노면, 경사로 등의 미끄럼

            TIMING
            - 접수시간, 운영시간, 시간대

            WARNING
            - 충돌위험, 사각지대 등 구조적 위험

            EQUIPMENT
            - 필요한 장비 및 도구

            OTHER
            - 위 항목으로 분류할 수 없는 현장 정보


            ====================
            [LOCATION 필수 규칙]
            ====================

            다음 Topic은 location이 반드시 필요합니다.

            ENTRY
            WAITING
            SLIPPERY
            WARNING

            해당 Topic에서 사용자가 정확한 위치를
            언급하지 않았다면:

            location = null
            completeness = INCOMPLETE

            로 판단하세요.

            그 외 Topic은 location이 없어도 COMPLETE가 가능합니다.


            ====================
            [CONDITIONS]
            ====================

            사용자가 직접 언급한 경우에만 입력하세요.

            weather:
            우천 / 맑음 / 적설 / null

            timeOfDay:
            오전 / 오후 / 야간 / null

            dayType:
            평일 / 주말 / null

            vehicleCondition:
            차량 톤수 또는 차량 조건.
            언급되지 않았다면 null.

            season:
            동절기 / 하절기 / null

            절대로 조건을 추측하지 마세요.


            ====================
            [CONTENT]
            ====================

            사용자가 말한 현장 정보를
            의미가 바뀌지 않도록 한 문장으로 정리하세요.

            예방 행동이나 추가 지시사항을
            임의로 생성하지 마세요.


            ====================
            [COMPLETENESS]
            ====================

            필수 정보가 모두 존재하면 COMPLETE.

            필수 정보가 빠져 있다면 INCOMPLETE.
            """;


    public TacitAnalysisResult analyze(String script) {

        StructuredChatCompletionCreateParams<TacitAnalysisResult> params =
                ChatCompletionCreateParams.builder()
                        .addSystemMessage(ANALYSIS_PROMPT)
                        .addUserMessage(
                                "다음 운송인 음성 메모를 분석하세요.\n\n"
                                        + script
                        )
                        .model(ChatModel.GPT_5_2)
                        .responseFormat(TacitAnalysisResult.class)
                        .build();

        return openAIClient
                .chat()
                .completions()
                .create(params)
                .choices()
                .stream()
                .flatMap(choice ->
                        choice.message().content().stream())
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "GPT 암묵지 분석 결과가 없습니다."
                        ));
    }
    public KnowledgeMatchResult matchKnowledge(
            TacitAnalysisResult incoming,
            List<TacitKnowledge> candidates
    ) {

        if (candidates.isEmpty()) {

            KnowledgeMatchResult result =
                    new KnowledgeMatchResult();

            result.matchType =
                    KnowledgeMatchResult.MatchType.DIFFERENT;

            result.knowledgeId =
                    java.util.Optional.empty();

            return result;
        }

        StringBuilder candidateText =
                new StringBuilder();

        for (TacitKnowledge knowledge : candidates) {

            candidateText.append("""
                    
                    [Knowledge]
                    id: %d
                    condition: %s
                    content: %s
                    
                    """.formatted(
                    knowledge.getId(),
                    knowledge.getCondition(),
                    knowledge.getContent()
            ));
        }

        String prompt = """
                새로운 현장 정보와 기존 TacitKnowledge 후보를 비교하세요.

                다음 세 가지 중 하나로 판단하세요.

                SAME:
                표현만 다를 뿐 실제 의미가 같은 정보.
                조건도 서로 양립 가능해야 합니다.

                예:
                "비 오는 날 후문 경사로가 미끄럽다."
                "우천 시 후문 경사로가 미끄럽다."


                CONFLICT:
                동일하거나 매우 비슷한 상황에 대해
                서로 동시에 참일 수 없는 반대 내용.

                예:
                "11톤 차량은 후문으로 진입 가능하다."
                "11톤 차량은 후문으로 진입할 수 없다."


                DIFFERENT:
                위치가 같아도 다른 현상이나
                다른 종류의 현장 정보라면 별도 Knowledge입니다.

                SAME 또는 CONFLICT이면
                knowledgeId에 해당 Knowledge의 id를 반환하세요.

                DIFFERENT이면 knowledgeId는 비워두세요.
                """;

        String userMessage = """
                [새로운 정보]

                type: %s
                topic: %s
                location: %s
                conditions: %s
                content: %s


                [기존 후보]

                %s
                """.formatted(
                incoming.type,
                incoming.topic,
                incoming.location.orElse(null),
                incoming.conditions,
                incoming.content,
                candidateText
        );

        StructuredChatCompletionCreateParams<KnowledgeMatchResult> params =
                ChatCompletionCreateParams.builder()
                        .addSystemMessage(prompt)
                        .addUserMessage(userMessage)
                        .model(ChatModel.GPT_5_2)
                        .responseFormat(
                                KnowledgeMatchResult.class
                        )
                        .build();

        return openAIClient
                .chat()
                .completions()
                .create(params)
                .choices()
                .stream()
                .flatMap(choice ->
                        choice.message().content().stream())
                .findFirst()
                .orElseThrow();
    }
    public ValidationJudgeResult judgeValidation(
            TacitKnowledge knowledge,
            String answer
    ) {

        String systemPrompt = """
                기존 TacitKnowledge에 대한
                운송인의 검증 답변을 분류하세요.

                SUPPORT:
                기존 정보가 맞다고 확인하거나
                같은 방향의 경험을 이야기함.

                CONFLICT:
                기존 정보가 틀렸다고 말하거나
                반대되는 경험을 이야기함.

                UNKNOWN:
                모르겠다, 경험이 없다,
                기억나지 않는다고 답함.

                반드시 SUPPORT, CONFLICT, UNKNOWN 중
                하나만 선택하세요.
                """;

        String userMessage = """
                기존 정보:
                %s

                운송인 답변:
                %s
                """.formatted(
                knowledge.getContent(),
                answer
        );

        StructuredChatCompletionCreateParams<ValidationJudgeResult> params =
                ChatCompletionCreateParams.builder()
                        .addSystemMessage(systemPrompt)
                        .addUserMessage(userMessage)
                        .model(ChatModel.GPT_5_2)
                        .responseFormat(
                                ValidationJudgeResult.class
                        )
                        .build();

        return openAIClient
                .chat()
                .completions()
                .create(params)
                .choices()
                .stream()
                .flatMap(choice ->
                        choice.message().content().stream())
                .findFirst()
                .orElseThrow();
    }
    private ConditionInfo toConditionInfo(
            TacitAnalysisResult.ConditionResult condition
    ) {

        return new ConditionInfo(
                condition.weather.orElse(null),
                condition.timeOfDay.orElse(null),
                condition.dayType.orElse(null),
                condition.vehicleCondition.orElse(null),
                condition.season.orElse(null)
        );
    }
}