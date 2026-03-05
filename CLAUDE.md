# NEXON Skills — Claude Code 가이드

> ⚠️ 이 문서는 Claude Code가 프로젝트 착수 시 자동으로 읽는 브리핑 문서입니다.
> 스펙 변경 시 반드시 이 문서도 함께 업데이트하세요.
> 📅 최초 작성일: 2026-03-05 | 🔄 최종 수정일: 2026-03-05

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | NEXON Skills (구 Agent Hub) |
| **목적** | 넥슨 임직원 대상 사내 AI 에이전트 플랫폼 |
| **URL** | https://nexon-skills.vercel.app/ |
| **대상 사용자** | 넥슨 전 임직원 (포털) / 개발자·관리자 (개발자 콘솔) |
| **런치 상태** | 정식 오픈 준비 중 (베타 완료: 2026-01-15) |

### 핵심 기능 3가지
1. **Document RAG 커넥터** — 사내 문서 기반 AI 검색
2. **3rd-party 커넥터** — 외부 서비스 연동 (MCP 기반)
3. **AI 워크플로우** — 에이전트 조합 자동화

### 시스템 구성
- **포털** — 전 임직원이 에이전트/커넥터를 탐색·사용하는 공간
- **개발자 콘솔** — 개발자·관리자가 에이전트/커넥터를 등록·관리하는 공간

---

## 2. 기술 스택

> ⚠️ TBD 항목은 확정 후 업데이트 필요

| 영역 | 스택 | 비고 |
|------|------|------|
| Framework | TBD | |
| Styling | TBD | |
| 상태관리 | TBD | |
| API 방식 | REST | |
| 인증 | TBD | 넥슨 내부 SSO 연동 예상 |
| 배포 | Vercel | |

---

## 3. 스킬(Skills) 파일 사용 규칙

> ⚠️ Claude Code는 코드를 작성하기 전에 반드시 아래 규칙에 따라 스킬 파일을 읽어야 한다.
> 스킬 파일을 읽지 않고 구현하면 스펙 불일치, 스타일 불통일, 화면 상태 누락이 발생한다.

### 3-1. 스킬 파일 위치

```
_skills/
├── INDEX.md                       ← 전체 스킬 파일 목록 및 상태 확인
│
├── foundation/                    ← 모든 작업 시 선행 필독
│   ├── design-tokens.md           ← 컬러·타이포·간격·shadow 토큰 (실제 값 포함)
│   ├── component-library.md       ← 공통 컴포넌트 목록 및 재사용 강제 규칙
│   └── conventions.md             ← 네이밍·주석·폴더·화면 상태 구현 원칙
│
├── layout/                        ← 레이아웃 골격
│   ├── GNB.md                     ← 글로벌 네비게이션 바
│   └── LNB.md                     ← 사이드바 네비게이션
│
├── screens/                       ← 화면별 구현 지시문 (핵심)
│   ├── _template.md               ← 신규 화면 작성 시 복사해서 사용
│   └── {화면명}.md                ← 화면 하나당 파일 하나
│
├── patterns/                      ← 반복 패턴 레시피 (완성도 보장)
│   ├── data-fetching.md           ← API 호출·로딩·에러·재시도 패턴
│   ├── form-validation.md         ← 폼 유효성 검사·제출·에러 표시 패턴
│   └── accessibility.md           ← WCAG 기준·키보드 내비게이션·aria 규칙
│
└── _logs/
    ├── ISSUE_LOG.md               ← ISS-XXX 이슈 추적
    └── DECISION_LOG.md            ← DEC-XXX 결정 추적
```

### 3-2. 작업 유형별 필독 파일

| 작업 유형 | 반드시 읽을 파일 (순서대로) |
|----------|--------------------------|
| **모든 작업 공통** | `foundation/conventions.md` |
| **화면·컴포넌트 개발** | conventions → `foundation/design-tokens.md` → `foundation/component-library.md` → `screens/{해당화면}.md` |
| **레이아웃 작업** | conventions → design-tokens → `layout/GNB.md` 또는 `layout/LNB.md` |
| **API 연동** | conventions → `patterns/data-fetching.md` |
| **폼 개발** | conventions → `patterns/form-validation.md` |
| **접근성 검토** | `patterns/accessibility.md` |
| **이슈 처리** (`ISS-XXX`) | `_logs/ISSUE_LOG.md` |
| **결정사항 반영** (`DEC-XXX`) | `_logs/DECISION_LOG.md` |

### 3-3. 화면 개발 체크리스트

Claude Code는 화면 개발 시 아래 순서를 반드시 지킨다.

```
[ ] 1. foundation/conventions.md 읽기
[ ] 2. foundation/design-tokens.md 읽기
[ ] 3. foundation/component-library.md 읽기
        → 재사용 가능한 공통 컴포넌트 확인, 중복 생성 금지
[ ] 4. screens/{해당화면}.md 읽기
        → 레이아웃·컴포넌트·필드·화면상태·연결화면 확인
[ ] 5. 필요 시 patterns/ 파일 읽기
[ ] 6. 코드 작성
        → 화면 상태 5가지 모두 구현 (로딩/정상/Empty/에러/권한없음)
        → 공통 컴포넌트 재사용 강제
        → SKILL 주석으로 참조 명세 표기
```

---

## 4. 명세 문서 구조

> `_spec/`은 기획·디자인 원본 명세 / `_skills/screens/`는 Claude Code용 구현 지시문
> 두 폴더의 파일명은 1:1 대응: `_spec/02_에이전트/에이전트-목록.md` ↔ `_skills/screens/에이전트-목록.md`

```
_spec/
├── 00_overview/
│   ├── 프로젝트개요.md
│   ├── 기술스택.md
│   ├── 디자인시스템.md          ← 컬러·타이포·간격 토큰 기준
│   └── 해상도-반응형정책.md     ← Breakpoint 기준
│
├── 01_공통/
│   ├── 공통-GNB.md
│   ├── 공통-LNB.md
│   ├── 공통-확인팝업.md
│   ├── 공통-토스트.md
│   ├── 공통-EmptyState.md
│   ├── 공통-로딩.md
│   └── 공통-에러페이지.md
│
├── 02_에이전트/
│   ├── 에이전트-목록.md
│   ├── 에이전트-상세.md
│   ├── 에이전트-등록.md
│   └── 에이전트-수정.md
│
├── 03_커넥터/
│   ├── 커넥터-목록.md
│   ├── 커넥터-상세.md
│   └── 커넥터-등록.md
│
├── 04_워크플로우/              ← TBD
│
├── 05_설정/                   ← TBD
│   ├── 설정-계정.md
│   └── 설정-권한.md
│
└── 06_개발자콘솔/              ← TBD
```

---

## 5. 해상도 및 반응형 정책

> 상세 내용: `_spec/00_overview/해상도-반응형정책.md`

| 항목 | 기준값 |
|------|--------|
| 기획·디자인 기준 해상도 | TBD |
| 최소 보장 해상도 | TBD |
| 콘텐츠 최대 너비 | TBD |
| Tablet 지원 | TBD |
| Mobile 지원 | TBD (내부 서비스 특성상 미지원 예상) |

---

## 6. 디자인 시스템

> 원본 명세: `_spec/00_overview/디자인시스템.md`
> Claude Code용 토큰: `_skills/foundation/design-tokens.md`

| 항목 | 기준 |
|------|------|
| 컬러 토큰 | TBD |
| 타이포그래피 | TBD |
| 기본 간격 단위 | TBD |
| 아이콘 라이브러리 | TBD |
| 컴포넌트 라이브러리 | TBD |

---

## 7. 코딩 규칙

> 상세 내용: `_skills/foundation/conventions.md` — 반드시 해당 파일 원문을 읽을 것

### 핵심 원칙 (요약)
- 모든 컴포넌트는 `_skills/screens/` 명세 기준으로 작성
- 공통 컴포넌트는 `_skills/foundation/component-library.md` 확인 후 재사용, **중복 생성 금지**
- 화면 상태 5가지(로딩/정상/Empty/에러/권한없음)를 **항상 모두** 구현

### 주석 규칙
```
// SKILL: _skills/screens/에이전트-목록.md § 4 — 테이블 컬럼 참조
// TODO: [미확정] 정렬 기준 확정 후 수정 → _skills/_logs/ISSUE_LOG.md ISS-003
// DEC: DEC-002에 따라 Tablet 미지원으로 처리
// ISSUE: ISS-001 처리 완료
```

### 파일 네이밍
```
컴포넌트: PascalCase          예) AgentCard.tsx
훅:       camelCase + use     예) useAgentList.ts
유틸:     camelCase           예) formatDate.ts
상수:     UPPER_SNAKE_CASE    예) MAX_AGENT_COUNT
```

---

## 8. 작업 요청 방식

### 화면 개발
```
_skills/screens/에이전트-목록.md 명세로 목록 페이지 만들어줘.
```

### 이슈 수정
```
ISS-003 처리해줘.
→ Claude가 _skills/_logs/ISSUE_LOG.md에서 ISS-003 내용을 찾아 처리
```

### 공통 컴포넌트
```
_skills/foundation/component-library.md 기준으로 확인팝업 컴포넌트 만들어줘.
```

### 스펙 기반 수정
```
DEC-001 결정사항 반영해서 에이전트-목록 페이지 정렬 로직 수정해줘.
```

---

## 9. 이슈 및 결정 관리

### 이슈 로그: `_skills/_logs/ISSUE_LOG.md`

| ID | 화면 | 내용 | 유형 | 상태 |
|----|------|------|------|------|
| ISS-001 | - | - | - | - |

**유형 분류**
- `UI` — 시각적 수정 (간격, 색상, 폰트 등)
- `버그` — 동작 오류
- `스펙오류` — 명세와 다르게 구현된 것
- `미구현` — 명세에 있으나 개발 안 된 것
- `신규요청` — 명세에 없던 새 요청

**상태 표시**
- 🔴 긴급 / 🟡 진행 중 / 🟢 검토 필요 / ✅ 완료

### 결정 로그: `_skills/_logs/DECISION_LOG.md`

| ID | 날짜 | 결정 내용 | 배경 | 결정자 |
|----|------|----------|------|--------|
| DEC-001 | - | - | - | - |

---

## 10. 미확정 사항 (전체)

> 개발 착수 전 반드시 결정이 필요한 항목들

| # | 영역 | 내용 | 결정 필요 시점 |
|---|------|------|--------------|
| 1 | 기술스택 | 프론트엔드 프레임워크 확정 | 개발 착수 전 |
| 2 | 기술스택 | 스타일링 방식 확정 | 개발 착수 전 |
| 3 | 해상도 | 기준 해상도 및 Breakpoint 확정 | 개발 착수 전 |
| 4 | 디자인 | 컴포넌트 라이브러리 확정 | 개발 착수 전 |
| 5 | 인증 | SSO 연동 방식 확정 | 개발 착수 전 |
| 6 | 04_워크플로우 | 화면 명세 작성 필요 | 해당 기능 개발 전 |
| 7 | 06_개발자콘솔 | 포털과 분리 여부 확정 | 개발 착수 전 |

---

## 11. 변경 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-05 | 최초 작성 (초안) | |
| 2026-03-05 | §3 스킬 파일 사용 규칙 신규 추가 (위치·필독표·체크리스트) / §4 _spec↔_skills 대응 관계 명시 / §6 design-tokens 파일 연동 / §7 주석 태그 SKILL: 추가 / _logs 경로 _skills/_logs 로 통일 | |
