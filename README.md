# # fieldguide

물류 운송 현장의 **암묵지(tacit knowledge)** — 신입 기사는 모르지만 베테랑은 알고 있는 진입로, 대기 방법, 위험 요소 같은 현장 정보 — 를 데이터로 축적하고, 운송인에게 실측 기반 정보를 제공하는 서비스입니다.

OMS(주문관리시스템) 데이터와 GPS 기반 자동 관찰 데이터, 그리고 운송인의 음성 제보를 결합해 “그 장소에 실제로 방문했던 기사들의 경험”을 다음 방문자에게 전달합니다.

---

## 배포 주소

| 구분 | 주소 |
| --- | --- |
| 프론트엔드 | http://211.188.59.248 |
| 백엔드 API (Swagger) | http://211.188.59.248:8080/swagger-ui/index.html |

> 현재 FE-BE 연동 작업 중입니다. 백엔드 API 명세는 Swagger 문서를 참고해주세요.
> 

---

## 기술 스택

**Frontend**
- React 19, Vite, TypeScript
- bun (패키지 매니저)
- TailwindCSS

**Backend**
- Spring Boot 4.1.0, Java 17
- Spring Data JPA, QueryDSL
- PostgreSQL 16
- springdoc-openapi (Swagger)
- OpenAI API (gpt-4o-transcribe, GPT-5.2)

**Infra**
- Naver Cloud Platform (VPC, Server)
- Docker, Docker Compose
- Nginx (프론트 정적 서빙)

---

## 아키텍처

```
[사용자] → [Nginx / React (Frontend 컨테이너)]
                    ↓ REST API
            [Spring Boot (Backend 컨테이너)]
                    ↓
            [PostgreSQL (DB 컨테이너)]
                    ↓
            [OpenAI API (STT + 암묵지 분석)]
```

세 컨테이너는 Docker Compose로 하나의 서버(Naver Cloud)에서 함께 운영됩니다.

---

## 핵심 기능

### 메인기능 0 — 허브노드 자동 구축 (데이터 인프라)

- OMS 상하차지 주소를 좌표 클러스터링해 허브노드(`HUB`) 생성
- 트러커/픽커 앱의 GPS 진입·이탈 타임스탬프로 체류시간·혼잡 패턴을 신고 없이 자동 축적
- 모든 후속 기능이 딛고 서는 기반 데이터셋. 같은 장소의 여러 데이터를 `hub_id` 하나로 묶어 시간이 지날수록 지식이 누적되는 구조

### 메인기능 1 — 오더 수락 전 정보 제공

- OMS 데이터(운임·거리) + 허브노드 실측 체류시간을 결합
- “예상 소요시간”이 추정치가 아니라 실제 방문 기사들의 평균 체류시간 기반 실측치
- 공차 이동비 + 운행 연료비 + 톨비 추정 → 예상 실수령액 계산

### 메인기능 2 — 콜 수락 시 현장 정보 제공

- 능동 제보(위험 태그, 베테랑 팁) + 자동 관찰 데이터(혼잡 시간대) 결합
- 현장 운영 암묵지 / 안전 암묵지 정보 제공

### 메인기능 3 — 운송 완료 후 음성 Near Miss 신고

- 능동 제보 데이터의 핵심 수집 통로
- 반복 방문 운송인·현장 베테랑의 누적 암묵지를 검증
- 제보 시 포인트 지급(주유소/세차 쿠폰)으로 참여 유도

### 메인기능 4 — 복화 오더 리스크 신호

- 자동배차가 복화 오더를 추천할 때, 목적지 허브노드에 위험 태그·장기 체류 이력이 있으면 오더 카드에 경고 배지 노출
- 배차 알고리즘 자체를 바꾸는 것이 아니라, 기존 추천 화면 위에 리스크 신호를 얹는 방식

### 서브기능 — 맞춤 가이드북

- 운송 경력, 선호 지역, 혼적 여부, 운행 시간대 등 선택형 설문 기반
- 결과: 적합한 거래처 TOP 5, 예상 수익 시뮬레이션(상위20%/평균/하위20%), 베테랑 기사 운행 패턴, 차량 특성 맞춤 주의사항

---

## 데이터베이스 설계

| 테이블 | 설명 |
| --- | --- |
| `member` | 회원 정보 (차량 톤수, 차종, 리프트 유무 등) |
| `region` | 지역 정보 (시/도, 시/군/구, 읍/면/동, 위경도) |
| `hub` | 물류센터/허브노드 (좌표, 주소, 전화번호) |
| `orders` | 오더 정보 (운임, 상하차지 허브, 수락 여부) |
| `transport` | 사용자가 완료한 운행 이력 |
| `estimate` | 오더 수락 후 예측한 비용/수익 데이터 |
| `onboarding` | 온보딩 설문 응답 (경력, 선호 지역, 운행 형태 등) |
| `guidebook` | 맞춤 가이드북 결과 (추천 거래처, 수익 시뮬레이션 등) |
| `tacit_report` | 음성 제보 원본 및 AI 분석 결과 |
| `tacit_knowledge` | 검증을 거쳐 구조화된 현장 지식 |
| `validation` | 제보 보완 / 지식 검증을 위한 질문-답변 |

각 테이블의 상세 컬럼 정의는 백엔드 팀 노션 문서를 참고해주세요.

---

## 핵심 로직 — 현장 경험의 지식화 (Tacit Knowledge Flow)

### 설계 원칙

> **AI는 현장 경험의 의미를 해석하고, Backend는 질문 우선순위·저장·카운트·상태 전이를 통제한다.**
> 

하나의 GPT 프롬프트가 모든 걸 처리하지 않고, 목적별로 역할을 분리합니다.

### 처리 흐름 개요

```
운송인 음성
    ↓
gpt-4o-transcribe (STT)
    ↓
script (텍스트)
    ↓
GPT-5.2 암묵지 분석
    ↓
TACIT_REPORT 저장
   ↙        ↘
INCOMPLETE   COMPLETE
   ↓            ↓
REPORT      기존 Knowledge
Validation   후보 비교 (GPT)
   ↓            ↓
정보 보완    SAME / CONFLICT / DIFFERENT
   ↓            ↓
COMPLETE    Knowledge 저장·카운트 갱신
      \         /
       ↓       ↓
     TACIT_KNOWLEDGE (UNVERIFIED)
             ↓
  INCOMPLETE Report가 없을 때만
     Knowledge Validation
             ↓
   GPT-5.2 Validation Judge
             ↓
  SUPPORT / CONFLICT / UNKNOWN
             ↓
  VERIFIED / CONFLICT / EXPIRED
```

### 1. 음성 제보 접수 (TACIT_REPORT)

운송인의 음성 메모를 STT → GPT 분석을 거쳐 구조화합니다.

```json
{
  "type": "SAFETY",
  "topic": "SLIPPERY",
  "location": "후문 경사로",
  "conditions": {
    "weather": "우천",
    "timeOfDay": null,
    "dayType": null,
    "vehicleCondition": null,
    "season": null
  },
  "content": "비 오는 날 후문 경사로가 미끄럽다.",
  "completeness": "COMPLETE"
}
```

**TOPIC 분류**: `ENTRY` / `WAITING` / `LOADING` / `UNLOADING` / `HANDLING` / `FACILITY` / `SLIPPERY` / `TIMING` / `WARNING` / `EQUIPMENT` / `OTHER`

**location 필수 Topic**: `ENTRY`, `WAITING`, `SLIPPERY`, `WARNING` — 이 네 가지는 위치 정보가 없으면 무조건 `INCOMPLETE`로 저장됩니다. (예: “경사로가 미끄러워요”만 말하면 위치가 없어 INCOMPLETE)

### 2. COMPLETE 제보 처리

```
TACIT_REPORT(COMPLETE)
    → 기존 TacitKnowledge 후보와 GPT 비교
    → SAME  : 기존 Knowledge 내용은 그대로, support_count + 1
    → DIFFERENT : 신규 TACIT_KNOWLEDGE 생성 (support=1, UNVERIFIED)
    → CONFLICT : 기존 Knowledge와 상충하는 정보로 식별, 상태 정책에 따라 처리
```

support_count가 검증 기준(예: 2)에 도달하면 `UNVERIFIED → VERIFIED`로 전환됩니다.

### 3. INCOMPLETE 제보 처리

```
TACIT_REPORT(INCOMPLETE)
    → 새로운 방문자가 해당 허브 방문 시, Backend가 INCOMPLETE Report를 조회
      (본인 작성 / 이미 질문한 Report는 제외)
    → VALIDATION 생성 (target: report)
    → "이 정보가 적용되는 정확한 위치가 어디인가요?" 형태로 질문
    → 운송인 답변 + 기존 script를 결합해 GPT 재분석
    → 필수 정보가 채워지면 COMPLETE로 전환 → 2번 흐름과 동일하게 처리
```

### 4. UNVERIFIED 지식 검증

해당 허브에 검증 가능한 INCOMPLETE Report가 하나도 없을 때만 진행됩니다.

```
TACIT_KNOWLEDGE(UNVERIFIED)
    → VALIDATION 생성 (target: knowledge)
    → "이 정보가 현재도 맞나요?" 형태로 질문
    → 운송인의 자유 답변을 GPT가 3가지로 분류
```

| 판정 | 조건 | 처리 |
| --- | --- | --- |
| `SUPPORT` | 기존 정보가 맞다고 확인 | `support_count + 1` → 기준 도달 시 `VERIFIED` |
| `CONFLICT` | 기존 정보가 틀렸거나 반대 경험 | `conflict_count + 1` → `CONFLICT` |
| `UNKNOWN` | 모르겠다/기억 안 남 | `conflict_count + 1` → `CONFLICT` |

`conflict_count`가 만료 기준(예: 3회)에 도달하면 `EXPIRED`로 전환됩니다.

### 검증 우선순위 원칙

검증 우선순위는 점수 기반이 아니라 **Backend가 항상 다음 순서로 조회**합니다.

1. **1순위**: `TACIT_REPORT.completeness_status = INCOMPLETE` → 부족한 필드 보완
2. **2순위**: 1순위 대상이 없을 때만 `TACIT_KNOWLEDGE.verification_status = UNVERIFIED` → 기존 지식 검증

즉, 모든 정보를 반복 질문하지 않고 **현재 지식 생성에 가장 필요한 질문 1건만** 운송인에게 제공합니다.

---

## AI 모델 및 프롬프트 설계

목적이 다른 3종의 프롬프트를 분리해서 사용합니다.

### 사용 모델

| 단계 | 모델 | 역할 |
| --- | --- | --- |
| STT | `gpt-4o-transcribe` | 음성 파일 → 텍스트(script) 변환 |
| 암묵지 분석 | `GPT-5.2` | script → type/topic/location/conditions/content/completeness 구조화 |
| Knowledge 비교 | `GPT-5.2` | 새 정보와 기존 Knowledge 후보를 SAME/CONFLICT/DIFFERENT로 판정 |
| Validation 판단 | `GPT-5.2` | 검증 답변을 SUPPORT/CONFLICT/UNKNOWN으로 분류 |

### Prompt 1 — 암묵지 분석

사용자가 실제로 말하지 않은 정보는 추측하지 않는 것이 원칙입니다.

**입력 예시**: “비 오는 날 후문 경사로가 미끄러워요.”

**출력**:

```json
{
  "type": "SAFETY",
  "topic": "SLIPPERY",
  "location": "후문 경사로",
  "conditions": { "weather": "우천", "timeOfDay": null, "dayType": null, "vehicleCondition": null, "season": null },
  "content": "비 오는 날 후문 경사로가 미끄럽다.",
  "completeness": "COMPLETE"
}
```

location이 필수인 Topic에서 위치가 없으면 `completeness: "INCOMPLETE"`로 처리되며, 질문 생성 자체는 GPT가 아닌 **Backend가 담당**합니다.

### Prompt 2 — Knowledge Match

| 판정 | 의미 |
| --- | --- |
| `SAME` | 표현은 다르지만 실제 의미가 같고 조건도 양립 가능 |
| `CONFLICT` | 동일/유사 상황에서 동시에 참일 수 없는 반대 정보 |
| `DIFFERENT` | 같은 위치라도 현상·종류가 다른 정보 |

SAME/CONFLICT는 기존 `knowledgeId`를 반환하고, DIFFERENT는 반환하지 않습니다.

### Prompt 3 — Validation Judge

출력은 `SUPPORT` / `CONFLICT` / `UNKNOWN` 셋 중 하나로 제한됩니다.

---

## 데이터 모델 요약

### TACIT_REPORT

음성 제보와 AI 분석 결과를 보존하는 레이어. 그 자체가 서비스에 노출되는 지식은 아닙니다.
- `hub`, `driver`, `audio`, `script`, `gpt_json`, `completeness_status`(`INCOMPLETE`/`COMPLETE`)

### VALIDATION

부족한 정보 보완 또는 미검증 지식 확인을 위한 질문-답변 레이어. 필요한 시점에 대상 1건만 생성됩니다.
- REPORT Validation: `report` 연결, `knowledge` 없음
- KNOWLEDGE Validation: `knowledge` 연결, `report` 없음
- 공통: `member`, `question`, `answer`

### TACIT_KNOWLEDGE

서비스에서 재사용 가능한 구조화된 현장 지식. 내용과 검증 상태를 분리 관리합니다.
- `hub`, `type`, `topic`, `location`, `conditions`, `content`
- `verification_status`(`UNVERIFIED`/`VERIFIED`/`CONFLICT`/`EXPIRED`), `support_count`, `conflict_count`

---

## 로컬 실행 방법

### 사전 요구사항

- Docker, Docker Compose
- (백엔드 단독 실행 시) Java 17, Gradle
- (프론트 단독 실행 시) bun

### Docker Compose로 전체 실행

```bash
git clone https://github.com/fieldguide-moveai/fieldguide.git
cd fieldguide
cp .env.example .env   # 값 채우기 (DB_PASSWORD, VITE_API_BASE_URL, OPENAI_API_KEY)
docker compose up -d --build
```

- 프론트엔드: `http://localhost`
- 백엔드: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui/index.html`
