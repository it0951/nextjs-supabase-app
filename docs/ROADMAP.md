# 모이자(Moiza) 개발 로드맵

소모임 이벤트 관리 웹 MVP - 주최자가 이벤트를 만들고 비회원 참여자가 초대 링크로 참여, 카풀, 정산까지 관리할 수 있는 플랫폼

## 개요

**모이자(Moiza)**는 소모임 주최자와 비회원 참여자를 위한 이벤트 관리 서비스로 다음 기능을 제공합니다:

- **이벤트 관리(주최자)**: Google OAuth 로그인 후 이벤트 생성, 공지, 참여자 관리
- **참여자 등록(비회원)**: 초대 링크로 접근하여 이름·연락처만으로 간편 참여
- **카풀 & 정산**: 주최자 수동 카풀 그룹 배정, 항목별 균등 분배 정산 및 납부 여부 관리

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   - 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

---

## 핵심 개발 전략 (Mobile-First & Structure-First & UI-First Approach)

> **개발 순서: UI/UX 먼저 → DB 스키마 확정 → 데이터 연동**
>
> UI/UX를 Mock 데이터로 먼저 빠르게 구현하여 보완할 부분을 발견한 뒤, 그 결과를 토대로 DB 스키마를 확정하고 Supabase 설정을 진행합니다. 이를 통해 스키마 재작업 비용을 최소화하고, UI 팀과 데이터 팀이 병렬로 작업할 수 있는 기반을 마련합니다.

### 📱 모바일 퍼스트 UI 전략

- **기준 해상도**: 375px (iPhone SE) 기준으로 설계
- **레이아웃**: 상단 고정 헤더(`h-14`) + 하단 고정 탭 네비(`h-16`) + 스크롤 콘텐츠(`pt-14 pb-20`)
- **컨테이너**: `max-w-[480px] mx-auto` — 큰 화면에서도 모바일 앱처럼 중앙 정렬
- **컴포넌트 우선순위**: 단일 컬럼 → 세로 스크롤 → 탭 기반 콘텐츠 전환
- **반응형 순서**: 모바일 완성 → `sm:` → `md:` → `lg:` 순으로 확장

---

## 전체 진행 현황

| Phase     | 단계명                                  | 상태    | 예상 기간 | 의존성         |
| --------- | --------------------------------------- | ------- | --------- | -------------- |
| Phase 0   | 프로젝트 기반 설정                      | ✅ 완료 | -         | -              |
| Phase 1   | 전체 UI/UX 목업 구현 (Mock 데이터)      | ✅ 완료 | 1 ~ 1.5주 | Phase 0 완료   |
| Phase 1.5 | 관리자 페이지(Admin Panel) UI 구현      | ✅ 완료 | 2 ~ 3일   | Phase 1 완료   |
| Phase 2   | DB 스키마 확정 및 Supabase 설정         | ✅ 완료 | 3 ~ 4일   | Phase 1.5 완료 |
| Phase 3   | 데이터 연동 - 주최자 기능               | ✅ 완료 | 1주       | Phase 2 완료   |
| Phase 4   | 데이터 연동 - 참여자 / 카풀 / 정산 기능 | ⏳ 대기 | 1주       | Phase 3 완료   |
| Phase 5   | 테스트 & 배포                           | ⏳ 대기 | 3 ~ 4일   | Phase 4 완료   |

> **총 예상 기간: 약 5 ~ 6주**

**상태 범례**

- ✅ 완료
- 🔄 진행중
- ⏳ 대기

---

## Phase 0: 프로젝트 기반 설정 ✅

> Next.js 16 + Supabase 프로젝트 초기 골격 구축 단계. 이미 완료되었습니다.

| Task ID  | 작업 내용                                                                            | 상태    | 관련 기능 ID |
| -------- | ------------------------------------------------------------------------------------ | ------- | ------------ |
| TASK-001 | Next.js 16 + App Router + TypeScript 프로젝트 초기 설정                              | ✅ 완료 | -            |
| TASK-002 | Supabase 클라이언트 (Server / Client / Middleware) 구성                              | ✅ 완료 | -            |
| TASK-003 | Google OAuth 소셜 로그인 구현                                                        | ✅ 완료 | F010         |
| TASK-004 | ESLint, Prettier, Husky, lint-staged 등 개발 도구 설정                               | ✅ 완료 | -            |
| TASK-005 | shadcn/ui 기본 컴포넌트 설치 (button, card, input, badge, checkbox, dropdown, label) | ✅ 완료 | -            |
| TASK-006 | Tailwind CSS 및 다크모드(next-themes) 설정                                           | ✅ 완료 | -            |
| TASK-007 | 미들웨어(proxy.ts) 기반 인증 보호 라우트 구성                                        | ✅ 완료 | F010         |
| TASK-008 | 이메일+비밀번호 즉시 가입 구현 (이메일 인증 제거, 가입 즉시 /dashboard 리다이렉트)   | ✅ 완료 | F010         |

---

## Phase 1: 전체 UI/UX 목업 구현 (Mock 데이터) ✅

> Supabase 연결 없이 모든 페이지의 UI를 Mock 데이터로 먼저 완성합니다.
> 페이지 구조, 인터랙션, 반응형 레이아웃을 점검하여 Phase 2의 DB 스키마 확정에 필요한 정보를 수집합니다.

### 목표

- 6개 페이지 모두 UI 완성 (Mock 데이터 기반)
- 필요한 shadcn/ui 컴포넌트 추가 설치
- 반응형 레이아웃 기본 적용
- 사용자 플로우 검증 (네비게이션, 빈 상태, 에러 상태)

### Task 목록

| Task ID  | 작업 내용                                                                                     | 상태    | 관련 기능 ID             |
| -------- | --------------------------------------------------------------------------------------------- | ------- | ------------------------ |
| TASK-010 | shadcn/ui 추가 컴포넌트 설치 (tabs, dialog, table, form, select, textarea, sonner, avatar 등) | ✅ 완료 | -                        |
| TASK-011 | 공통 레이아웃 구현 (모바일 고정 헤더 / 하단 탭 네비게이션 / 빈 상태 / 로딩 컴포넌트)          | ✅ 완료 | -                        |
| TASK-012 | TypeScript Mock 타입 및 더미 데이터 정의 (`lib/mock/*.ts`)                                    | ✅ 완료 | -                        |
| TASK-013 | 대시보드 페이지 UI 구현 (이벤트 카드 목록, 빈 상태, 새 이벤트 만들기 CTA)                     | ✅ 완료 | F011                     |
| TASK-014 | 이벤트 생성 페이지 UI 구현 (제목/날짜/장소/설명 폼, react-hook-form + zod 검증)               | ✅ 완료 | F001                     |
| TASK-015 | 이벤트 관리 페이지 UI 구현 (탭: 개요 / 공지 / 참여자 / 카풀 / 정산)                           | ✅ 완료 | F001 ~ F003, F005 ~ F007 |
| TASK-016 | 공지 작성/관리 UI (다이얼로그 작성, 목록, 수정/삭제)                                          | ✅ 완료 | F003                     |
| TASK-017 | 참여자 관리 UI (테이블, 상태 변경 드롭다운: 확정/대기/취소)                                   | ✅ 완료 | F005                     |
| TASK-018 | 카풀 그룹 배정 UI (그룹 카드, 드래그 앤 드롭 또는 배정 다이얼로그)                            | ✅ 완료 | F006                     |
| TASK-019 | 정산 UI (항목 추가, 균등 분배 미리보기, 납부 여부 체크박스)                                   | ✅ 완료 | F007                     |
| TASK-020 | 초대 링크 생성/공유 UI (복사 버튼, QR 코드 영역, 토큰 표시)                                   | ✅ 완료 | F002                     |
| TASK-021 | 이벤트 초대 페이지 UI (비회원, invite_token, 이름+연락처 등록 폼)                             | ✅ 완료 | F004, F012               |
| TASK-022 | 참여자 뷰 페이지 UI (비회원, join_token, 탭: 공지 / 카풀 / 정산 본인 정보)                    | ✅ 완료 | F003, F006, F007, F012   |
| TASK-023 | 모바일 퍼스트 기준 반응형 레이아웃 점검 (375px 기준 → sm → md 순서)                           | ✅ 완료 | -                        |
| TASK-024 | UI 검토 회의 및 Phase 2 DB 스키마 보완점 정리                                                 | ✅ 완료 | -                        |

### 구현 가이드

- 모든 데이터는 `lib/mock/`에 하드코딩된 더미 객체로 작성
- 폼 검증: `react-hook-form` + `zod` 적용 (실제 제출은 Mock으로 alert / sonner toast 처리)
- 페이지 라우팅 구조 예시
  - `/dashboard` - 주최자 대시보드
  - `/events/new` - 이벤트 생성
  - `/events/[eventId]` - 이벤트 관리 (탭 기반)
  - `/invite/[inviteToken]` - 비회원 초대
  - `/join/[joinToken]` - 참여자 본인 뷰
- 상태 표시: 빈 상태(empty), 로딩 상태(skeleton), 에러 상태(toast) 모두 UI에 반영

### 📱 모바일 퍼스트 구현 기준

| 항목            | 기준                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| 기본 레이아웃   | 상단 고정 헤더(`h-14`) + 하단 탭 네비(`h-16`)                          |
| 콘텐츠 영역     | `pt-14 pb-20 px-4`                                                     |
| 컨테이너        | `max-w-[480px] mx-auto`                                                |
| 공통 레이아웃   | `components/layout/header.tsx`, `components/layout/bottom-tab-bar.tsx` |
| 터치 타겟       | 모든 인터랙션 요소 최소 `h-11` (44px)                                  |
| 다이얼로그 너비 | `max-w-[92vw] sm:max-w-md`                                             |
| 테이블 오버플로 | `<div className="overflow-x-auto -mx-4 px-4">` 래퍼 적용               |

---

## Phase 1.5: 관리자 페이지(Admin Panel) UI 구현 ✅

> 서비스 운영자를 위한 관리자 전용 패널을 Mock 데이터 기반으로 구현합니다.
> 주최자 대시보드(`/dashboard`)와 완전히 분리된 별도 레이아웃과 라우트 그룹을 사용합니다.
> Phase 2 DB 연동 시 실제 Supabase 데이터로 교체합니다.

### 목표

- 관리자 전용 레이아웃 구현 (사이드바 + 모바일 Sheet 네비게이션)
- 역할 기반 접근 제어(RBAC) 미들웨어 추가
- 4개 관리자 페이지 UI 완성 (대시보드 / 사용자 / 이벤트 / 설정)
- 모바일 퍼스트 반응형 적용 (모바일: Sheet 슬라이드, 데스크톱: 고정 사이드바)

### Task 목록

| Task ID  | 작업 내용                                                                                 | 상태    | 관련 기능 ID |
| -------- | ----------------------------------------------------------------------------------------- | ------- | ------------ |
| TASK-070 | 관리자 Mock 데이터 타입 및 더미 데이터 정의 (`lib/mock/admin-data.ts`)                    | ✅ 완료 | F020, F021   |
| TASK-071 | 미들웨어 관리자 역할 검증 추가 (`lib/supabase/proxy.ts`)                                  | ✅ 완료 | F020         |
| TASK-072 | 관리자 레이아웃 컴포넌트 구현 (AdminHeader / AdminSidebar / AdminMobileNav / AdminLayout) | ✅ 완료 | -            |
| TASK-073 | 관리자 그룹 라우트 레이아웃 구현 (`app/(admin)/layout.tsx`, 인증 + 역할 검증)             | ✅ 완료 | F020         |
| TASK-074 | 관리자 대시보드 페이지 구현 (StatsCard + StatsGrid, Mock 집계 통계)                       | ✅ 완료 | F020         |
| TASK-075 | 사용자 관리 페이지 구현 (UsersTable + RoleBadge)                                          | ✅ 완료 | F021         |
| TASK-076 | 이벤트 관리 페이지 구현 (AdminEventsTable + DeleteEventDialog)                            | ✅ 완료 | F022         |
| TASK-077 | 시스템 설정 페이지 구현 (Card 레이아웃 + 폼 UI + Mock toast)                              | ✅ 완료 | F023         |
| TASK-078 | `/admin` index → `/admin/dashboard` redirect 페이지 구현                                  | ✅ 완료 | -            |
| TASK-079 | 관리자 페이지 반응형·접근성 점검 및 `npm run check-all` 통과                              | ✅ 완료 | -            |

### 구현 가이드

- **인증 전략**: Phase 1에서는 `MOCK_ADMIN_EMAILS` 목록으로 관리자 판별, Phase 2부터 `user_metadata.role === "admin"` 사용
- **라우트 그룹**: `app/(admin)/` — 기존 `(dashboard)` 그룹과 완전 분리
- **레이아웃 컨테이너**: `max-w-[1200px]` — 관리자 페이지는 테이블/통계 등 넓은 콘텐츠 고려
- **사이드바**: 모바일에서는 shadcn/ui `Sheet`로 슬라이드, 데스크톱(`md:`)에서는 `w-56` 고정 사이드바
- **신규 shadcn/ui 컴포넌트**: `sheet`, `alert-dialog` 설치 필요

### 📱 관리자 레이아웃 구조

```tsx
// app/(admin)/ 그룹 페이지 기본 구조
<AdminLayout>
  <AdminHeader />{" "}
  {/* fixed top-0 z-50 h-14 — 모바일 햄버거 + 로고 + 유저메뉴 */}
  <AdminSidebar /> {/* fixed left-0 top-14 w-56 — md: 이상에서만 표시 */}
  <main className="px-4 pb-8 pt-14 md:pl-56">
    <div className="mx-auto max-w-[1200px]">{children}</div>
  </main>
</AdminLayout>
```

---

## Phase 2: DB 스키마 확정 및 Supabase 설정 ✅

> Phase 1에서 검증된 UI를 바탕으로 DB 스키마를 최종 확정하고 Supabase 마이그레이션을 적용합니다.

### 목표

- 7개 테이블의 컬럼 / 관계 / 제약조건 확정
- Supabase Migration CLI를 통한 스키마 적용
- RLS(Row Level Security) 정책 설정
- TypeScript 타입 자동 생성

### Task 목록

| Task ID  | 작업 내용                                                                                          | 상태    | 관련 기능 ID     |
| -------- | -------------------------------------------------------------------------------------------------- | ------- | ---------------- |
| TASK-030 | Phase 1 UI 검토 결과를 반영한 ERD 및 스키마 최종 확정 문서 작성                                    | ✅ 완료 | -                |
| TASK-031 | Supabase CLI 초기화 및 로컬/원격 프로젝트 연결                                                     | ✅ 완료 | -                |
| TASK-032 | `events` 테이블 마이그레이션 작성 (id, owner_id, title, date, location, description, invite_token) | ✅ 완료 | F001, F002       |
| TASK-033 | `participants` 테이블 마이그레이션 작성 (id, event_id, name, phone, status, join_token)            | ✅ 완료 | F004, F005, F012 |
| TASK-034 | `announcements` 테이블 마이그레이션 작성 (id, event_id, title, content, created_at)                | ✅ 완료 | F003             |
| TASK-035 | `carpool_groups` 및 `carpool_assignments` 테이블 마이그레이션 작성                                 | ✅ 완료 | F006             |
| TASK-036 | `expense_items` 및 `expense_splits` 테이블 마이그레이션 작성                                       | ✅ 완료 | F007             |
| TASK-037 | RLS 정책 설정 (주최자만 자신의 이벤트 수정, 비회원은 토큰 기반 읽기/쓰기)                          | ✅ 완료 | F010, F012       |
| TASK-038 | `npx supabase gen types typescript --linked > types/supabase.ts`로 타입 자동 생성                  | ✅ 완료 | -                |
| TASK-039 | Supabase 시드 데이터 작성 (개발/테스트용 더미 이벤트)                                              | ✅ 완료 | -                |

### 테스트 체크리스트

- [x] 마이그레이션 적용 후 모든 테이블이 정상 생성됨
- [x] RLS 정책으로 비인증 사용자는 자신과 무관한 데이터에 접근 불가
- [x] invite_token / join_token으로 비회원이 정상적으로 접근 가능
- [x] 생성된 TypeScript 타입이 코드에서 정상 import 됨

---

## Phase 3: 데이터 연동 - 주최자 기능 ✅

> Phase 1의 Mock 데이터를 실제 Supabase 쿼리로 교체합니다. 주최자가 사용하는 페이지부터 진행합니다.

### 목표

- 대시보드, 이벤트 생성/관리, 공지, 참여자 관리에 실제 Supabase 연결
- Server Components / Server Actions + useActionState 패턴 적용
- `lib/actions/` + `lib/schemas/` 파일 구조 기반으로 비즈니스 로직 분리
- Vitest 단위 테스트 작성

### Task 목록

| Task ID  | 작업 내용                                                                                                                          | 상태    | 관련 기능 ID           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------- |
| TASK-040 | 프로젝트 구조 초기화 (`lib/actions/`, `lib/schemas/`, `lib/types/`) + Vitest 환경 설정 (msw 제외, Node 환경)                       | ✅ 완료 | -                      |
| TASK-041 | 대시보드 페이지 데이터 연동 (`events` 조회, owner_id 필터링, 확정 참여자 수 집계, `EventCard` Supabase 타입 전환)                  | ✅ 완료 | F011                   |
| TASK-042 | 이벤트 생성 Server Action 구현 (`events` insert, invite_token은 DB 자동 생성, `NewEventForm` Client 컴포넌트 분리, useActionState) | ✅ 완료 | F001, F002             |
| TASK-043 | 이벤트 수정/삭제 Server Action 구현 (개요 탭 내 `EditEventDialog`, `AlertDialog` 삭제 확인, owner_id RLS 이중 검증)                | ✅ 완료 | F001                   |
| TASK-044 | 이벤트 관리 페이지 Server Component 전환 (async params, Supabase 단일 이벤트 조회, 초대 링크 서버 구성, `EventDetailClient` 분리)  | ✅ 완료 | F001, F002             |
| TASK-045 | 공지 CRUD Server Action 구현 (`lib/actions/announcements.ts`, `announcement-tab.tsx` Mock→Supabase 리팩토링)                       | ✅ 완료 | F003                   |
| TASK-046 | 참여자 관리 데이터 연동 (`lib/actions/participants.ts`, `participant-tab.tsx` Mock→Supabase 리팩토링, 낙관적 UI)                   | ✅ 완료 | F005                   |
| TASK-048 | Vitest 단위 테스트 작성 (`createEventSchema`, `announcementSchema` 검증 케이스, `__tests__/schemas/`)                              | ✅ 완료 | -                      |
| TASK-049 | Playwright MCP로 주최자 플로우 E2E 테스트 (로그인 → 이벤트 생성 → 공지 → 참여자 상태 변경 → 이벤트 삭제)                           | ✅ 완료 | F010, F001, F003, F005 |

> **TASK-047 삭제**: invite_token은 이벤트 생성 시 DB에서 자동 생성·저장되므로 별도 처리 불필요. 초대 링크 URL 구성은 TASK-044(개요 탭)에 통합.

### 테스트 체크리스트

- [x] 이메일+비밀번호로 로그인한 주최자만 자신의 이벤트 목록 조회 가능
- [x] 이벤트 생성 시 invite_token이 DB에서 자동 생성됨
- [x] 공지 추가/수정/삭제가 즉시 UI에 반영됨 (revalidatePath 동작)
- [x] 참여자 상태 변경(확정/대기/취소)이 정상 저장됨
- [x] 다른 주최자의 이벤트는 RLS로 차단됨
- [x] Playwright E2E: 주최자 전체 플로우가 에러 없이 통과

---

## Phase 4: 데이터 연동 - 참여자 / 카풀 / 정산 기능 ⏳

> 비회원 참여자 흐름과 카풀, 정산 기능에 실제 Supabase를 연결합니다.

### 목표

- 초대 페이지, 참여자 뷰, 카풀 배정, 정산에 실제 Supabase 연결
- 비회원 토큰 기반 인증 흐름 검증
- Vitest 단위 테스트 + Playwright E2E 테스트 작성

### Task 목록

| Task ID  | 작업 내용                                                                        | 상태    | 관련 기능 ID           |
| -------- | -------------------------------------------------------------------------------- | ------- | ---------------------- |
| TASK-050 | 이벤트 초대 페이지 데이터 연동 (invite_token 검증, 만료/유효성 처리)             | ⏳ 대기 | F002, F004             |
| TASK-051 | 참여자 등록 Server Action 구현 (`participants` insert, join_token 자동 생성)     | ⏳ 대기 | F004, F012             |
| TASK-052 | 참여자 뷰 페이지 데이터 연동 (join_token 검증, 본인 정보/공지/카풀/정산 조회)    | ⏳ 대기 | F003, F006, F007, F012 |
| TASK-053 | 카풀 그룹 CRUD Server Action 구현                                                | ⏳ 대기 | F006                   |
| TASK-054 | 카풀 배정 Server Action 구현 (`carpool_assignments` insert/update)               | ⏳ 대기 | F006                   |
| TASK-055 | 정산 항목 CRUD Server Action 구현 (`expense_items`, 균등 분배 로직)              | ⏳ 대기 | F007                   |
| TASK-056 | 정산 납부 여부 토글 Server Action 구현 (`expense_splits.is_paid` 업데이트)       | ⏳ 대기 | F007                   |
| TASK-057 | Vitest 단위 테스트 작성 (균등 분배 계산, 토큰 검증 로직)                         | ⏳ 대기 | -                      |
| TASK-058 | Playwright MCP로 참여자 전체 플로우 E2E 테스트 (초대 링크 → 등록 → 본인 뷰 확인) | ⏳ 대기 | F004, F012             |
| TASK-059 | Playwright MCP로 카풀/정산 플로우 E2E 테스트                                     | ⏳ 대기 | F006, F007             |

### 테스트 체크리스트

- [ ] 잘못된/만료된 invite_token으로 접근 시 적절한 에러 페이지 노출
- [ ] 참여자 등록 시 join_token이 고유하게 생성됨
- [ ] join_token이 없으면 참여자 뷰 페이지 접근 불가 (RLS 동작)
- [ ] 카풀 그룹 배정/해제가 즉시 양쪽 화면(주최자/참여자)에 반영됨
- [ ] 정산 항목 추가 시 모든 확정 참여자에게 균등 분배되어 자동 split 생성
- [ ] 납부 여부 토글이 주최자/참여자 모두에게 정상 반영됨
- [ ] Playwright E2E: 비회원 전체 플로우 + 카풀/정산 플로우 통과

---

## Phase 5: 테스트 & 배포 ⏳

> 전체 사용자 플로우를 종합 테스트하고 Vercel에 배포합니다.

### 목표

- 전체 시나리오 E2E 테스트 통과
- Vercel 배포 및 환경 변수 설정
- 프로덕션 환경 검증 및 모니터링

### Task 목록

| Task ID  | 작업 내용                                                                 | 상태    | 관련 기능 ID |
| -------- | ------------------------------------------------------------------------- | ------- | ------------ |
| TASK-060 | Playwright E2E 통합 시나리오 작성 (주최자 + 비회원 참여자 전체 흐름)      | ⏳ 대기 | 전체         |
| TASK-061 | 접근성(a11y) 및 성능(Lighthouse) 점검                                     | ⏳ 대기 | -            |
| TASK-062 | 에러 핸들링 점검 (404, 500, 토큰 오류, 네트워크 오류 등)                  | ⏳ 대기 | -            |
| TASK-063 | Vercel 프로젝트 연결 및 환경 변수 설정 (NEXT_PUBLIC_SUPABASE_URL, KEY 등) | ⏳ 대기 | -            |
| TASK-064 | Supabase Google OAuth Redirect URL을 프로덕션 도메인으로 등록             | ⏳ 대기 | F010         |
| TASK-065 | 프로덕션 배포 및 스모크 테스트                                            | ⏳ 대기 | -            |
| TASK-066 | Vercel Analytics / Supabase 로그 모니터링 설정                            | ⏳ 대기 | -            |
| TASK-067 | README, 사용자 가이드, 운영 매뉴얼 등 최종 문서화                         | ⏳ 대기 | -            |

### 테스트 체크리스트

- [ ] 주최자 가입 → 이벤트 생성 → 초대 링크 공유 → 참여자 등록 → 카풀 배정 → 정산 → 완료 시나리오 정상 동작
- [ ] 모바일/태블릿/데스크톱 반응형 정상 동작
- [ ] Lighthouse 성능 / 접근성 점수 90점 이상
- [ ] 프로덕션 환경에서 Google OAuth 정상 로그인
- [ ] 프로덕션 환경에서 invite_token / join_token 정상 동작

---

## 기능 ID 참조 테이블

| 기능 ID | 기능명                        | 설명                                                | 사용자 |
| ------- | ----------------------------- | --------------------------------------------------- | ------ |
| F001    | 이벤트 생성/수정              | 제목, 날짜, 장소, 설명 등 기본 정보 관리            | 주최자 |
| F002    | 초대 링크 생성/공유           | 이벤트별 invite_token 기반 공유 가능한 URL 생성     | 주최자 |
| F003    | 공지 작성/관리                | 이벤트 공지사항 작성/수정/삭제                      | 주최자 |
| F004    | 참여자 등록 (비회원)          | 초대 링크 접근 후 이름 + 연락처 입력으로 간편 등록  | 비회원 |
| F005    | 참여 상태 관리                | 참여자 상태(확정/대기/취소) 변경                    | 주최자 |
| F006    | 카풀 그룹 배정                | 주최자가 수동으로 그룹 생성 및 참여자 배정          | 주최자 |
| F007    | 항목별 정산                   | 항목 등록, 균등 분배, 납부 여부 관리                | 주최자 |
| F010 ✅ | 주최자 인증                   | Google OAuth 또는 이메일+비밀번호 직접 가입/로그인  | 주최자 |
| F011    | 이벤트 목록 관리 (대시보드)   | 주최자가 자신의 이벤트 목록 조회/관리               | 주최자 |
| F012    | 참여자 본인 확인 (join_token) | 참여자가 자신의 정보/공지/카풀/정산을 토큰으로 조회 | 비회원 |
| F020    | 관리자 대시보드               | 전체 통계(사용자수, 이벤트수, 참여자수) 조회        | 관리자 |
| F021    | 사용자 관리                   | 가입한 주최자 목록 조회 및 역할(admin/user) 관리    | 관리자 |
| F022    | 전체 이벤트 관리              | 모든 주최자의 이벤트 목록 조회 및 삭제              | 관리자 |
| F023    | 시스템 설정                   | 서비스 기본 설정(서비스명, 연락처 등) 관리          | 관리자 |

---

## DB 테이블 목록

| 테이블명              | 설명                                | 주요 컬럼                                                      |
| --------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `events`              | 이벤트 기본 정보                    | id, owner_id, title, date, location, description, invite_token |
| `participants`        | 비회원 참여자 정보                  | id, event_id, name, phone, status, join_token                  |
| `announcements`       | 이벤트 공지사항                     | id, event_id, title, content, created_at                       |
| `carpool_groups`      | 카풀 그룹                           | id, event_id, name, driver_participant_id, capacity            |
| `carpool_assignments` | 카풀 그룹 - 참여자 배정             | id, group_id, participant_id                                   |
| `expense_items`       | 정산 항목                           | id, event_id, title, amount, paid_by_participant_id            |
| `expense_splits`      | 정산 항목별 참여자 분배 / 납부 여부 | id, item_id, participant_id, amount, is_paid                   |

---

## 페이지 목록

| 페이지명          | 경로                    | 사용자 | 관련 기능 ID             |
| ----------------- | ----------------------- | ------ | ------------------------ |
| 로그인            | `/auth/login` ✅        | 주최자 | F010                     |
| 회원가입          | `/auth/sign-up` ✅      | 주최자 | F010                     |
| 대시보드          | `/dashboard`            | 주최자 | F011                     |
| 이벤트 생성       | `/events/new`           | 주최자 | F001                     |
| 이벤트 관리       | `/events/[eventId]`     | 주최자 | F001 ~ F003, F005 ~ F007 |
| 이벤트 초대       | `/invite/[inviteToken]` | 비회원 | F004, F012               |
| 참여자 뷰         | `/join/[joinToken]`     | 비회원 | F003, F006, F007, F012   |
| 관리자 대시보드   | `/admin/dashboard`      | 관리자 | F020                     |
| 사용자 관리       | `/admin/users`          | 관리자 | F021                     |
| 이벤트 관리(전체) | `/admin/events`         | 관리자 | F022                     |
| 시스템 설정       | `/admin/settings`       | 관리자 | F023                     |

---

## 의존성 및 진행 규칙

- **Phase 1 → Phase 2**: Phase 1 UI 완성 및 검토 회의(TASK-024) 후 Phase 2 진입. UI에서 도출된 필드를 DB 스키마에 반영
- **Phase 2 → Phase 3**: Supabase 마이그레이션 적용 및 타입 자동 생성 후 Phase 3 진입
- **Phase 3 → Phase 4**: 주최자 플로우의 Playwright E2E(TASK-049) 통과 후 Phase 4 진입
- **Phase 4 → Phase 5**: 모든 단위 테스트 + E2E 테스트 통과 후 Phase 5 진입
- 각 Phase 진행 중 발견된 이슈는 즉시 ROADMAP에 신규 Task로 추가
