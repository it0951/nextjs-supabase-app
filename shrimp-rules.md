# Development Guidelines

## Project Overview

- Next.js App Router + Supabase 풀스택 웹 애플리케이션 (모이자 Moiza MVP)
- 기술 스택: Next.js (App Router), Supabase (Auth + DB + RLS), Tailwind CSS, shadcn/ui, TypeScript (strict)
- 인증: Supabase Auth (이메일/비밀번호 즉시 가입 + Google OAuth) — 이메일 인증 없음
- `src/` 디렉토리 없음 — 모든 소스는 루트의 `app/`, `components/`, `lib/`에 위치
- 현재 상태: Phase 4 완료 (Phase 5 테스트 & 배포 대기 중)

---

## Project Architecture

### 디렉토리 구조

```
/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (ThemeProvider)
│   ├── page.tsx                      # 홈페이지 (/) — 로그인 상태에 따라 /dashboard 또는 로그인 페이지로 리다이렉트
│   ├── globals.css
│   ├── auth/                         # 공개 인증 라우트 (미들웨어 제외 대상)
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── sign-up-success/page.tsx  # /dashboard 즉시 리다이렉트 (이메일 인증 제거됨)
│   │   ├── forgot-password/page.tsx
│   │   ├── update-password/page.tsx
│   │   ├── error/page.tsx
│   │   └── callback/route.ts         # OAuth 콜백
│   ├── (dashboard)/                  # 주최자 보호 라우트 그룹
│   │   ├── layout.tsx                # Header + BottomTabBar 포함
│   │   ├── dashboard/page.tsx        # 이벤트 목록 (Supabase 연동)
│   │   └── events/
│   │       ├── new/page.tsx          # 이벤트 생성 (NewEventForm Client Component)
│   │       └── [eventId]/
│   │           ├── page.tsx          # 이벤트 관리 (Server Component, async params)
│   │           └── EventDetailClient.tsx
│   ├── (admin)/                      # 관리자 전용 라우트 그룹
│   │   ├── layout.tsx                # AdminLayout 포함
│   │   ├── admin/
│   │   │   ├── page.tsx              # /admin/dashboard redirect
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   └── settings/page.tsx
│   ├── invite/
│   │   └── [inviteToken]/page.tsx    # 비회원 초대 (공개, async Server Component)
│   └── join/
│       └── [joinToken]/page.tsx      # 참여자 뷰 (공개, async Server Component)
├── components/
│   ├── ui/                           # shadcn/ui 컴포넌트 (자동 생성만)
│   ├── layout/
│   │   ├── header.tsx                # fixed top-0 h-14
│   │   ├── bottom-tab-bar.tsx        # fixed bottom-0 h-16
│   │   └── mobile-layout.tsx         # 비로그인 공개 페이지용
│   ├── events/
│   │   ├── event-card.tsx
│   │   ├── new-event-form.tsx        # 이벤트 생성 Client Component
│   │   ├── edit-event-dialog.tsx     # 이벤트 수정
│   │   └── tabs/
│   │       ├── overview-tab.tsx
│   │       ├── announcement-tab.tsx
│   │       ├── participant-tab.tsx
│   │       ├── carpool-tab.tsx
│   │       └── expense-tab.tsx
│   ├── invite/
│   │   └── join-form.tsx             # 비회원 참여 신청 폼 Client Component
│   ├── join/                         # 참여자 뷰 탭 컴포넌트
│   ├── admin/
│   │   ├── admin-layout.tsx
│   │   ├── admin-header.tsx
│   │   ├── admin-sidebar.tsx
│   │   └── admin-mobile-nav.tsx
│   ├── login-form.tsx
│   ├── sign-up-form.tsx
│   ├── google-sign-in-button.tsx
│   └── logout-button.tsx
├── lib/
│   ├── utils.ts                      # cn() 유틸
│   ├── supabase/
│   │   ├── server.ts                 # Server Component용 클라이언트
│   │   ├── client.ts                 # Client Component용 클라이언트
│   │   └── proxy.ts                  # Middleware용 세션 갱신
│   ├── actions/                      # Server Actions ('use server')
│   │   ├── events.ts                 # createEventAction, updateEventAction, deleteEventAction
│   │   ├── announcements.ts          # createAnnouncementAction, updateAnnouncementAction, deleteAnnouncementAction
│   │   ├── participants.ts           # updateParticipantStatusAction, registerParticipantAction
│   │   ├── carpools.ts               # createCarpoolGroupAction, deleteCarpoolGroupAction, updateCarpoolAssignmentsAction
│   │   ├── expenses.ts               # createExpenseItemAction, deleteExpenseItemAction
│   │   └── expense-splits.ts         # toggleExpenseSplitPaidAction, toggleMyExpenseSplitPaidAction
│   ├── schemas/                      # Zod 스키마
│   │   ├── event.ts
│   │   ├── announcement.ts
│   │   ├── participant.ts
│   │   ├── carpool.ts
│   │   └── expense.ts
│   ├── types/
│   │   └── index.ts                  # ActionResult 등 공통 타입
│   ├── utils/
│   │   └── expense-splits.ts         # calculateEvenSplits 순수 함수
│   └── mock/                         # Phase 1 Mock 데이터 (참조용, 신규 사용 금지)
│       ├── data.ts
│       ├── types.ts
│       └── admin-data.ts
├── types/
│   └── supabase.ts                   # DB 타입 (CLI 자동 생성, 수동 수정 금지)
├── __tests__/
│   ├── schemas/                      # Vitest 스키마 단위 테스트
│   └── utils/                        # Vitest 유틸 단위 테스트
├── docs/
│   ├── PRD.md
│   ├── ROADMAP.md
│   └── guides/
├── proxy.ts                          # 루트 미들웨어 (파일명 변경 금지)
└── components.json                   # shadcn/ui 설정
```

---

## Code Standards

### 네이밍

- 컴포넌트 함수: `PascalCase`
- 파일명: `kebab-case.tsx`
- 변수/함수: `camelCase`
- Server Action 함수: `동사Action` 형태 (예: `createEventAction`, `deleteAnnouncementAction`)
- 폴더명: `kebab-case` 또는 소문자

### Import 순서

```typescript
// 1. 외부 라이브러리
import { redirect } from "next/navigation";
// 2. 내부 모듈 (@/ 경로 별칭 사용)
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
// 3. 상대 경로 (같은 폴더 내에서만 허용)
```

### Export 규칙

- 페이지 컴포넌트 (`page.tsx`, `layout.tsx`): `export default`
- 모든 재사용 컴포넌트: named export (`export function ComponentName`)
- Server Actions: named export (`export async function createEventAction`)

---

## Functionality Implementation Standards

### 새 보호 페이지 추가 (주최자 전용)

- `app/(dashboard)/{route}/page.tsx` 생성 → 미들웨어가 자동으로 인증 보호

### 새 공개 페이지 추가 (비회원 접근 가능)

- `app/{route}/page.tsx` 생성
- `lib/supabase/proxy.ts`의 리다이렉트 조건에 경로 예외 추가 필수

```typescript
// lib/supabase/proxy.ts — 공개 경로 추가 예시
const isPublicRoute =
  request.nextUrl.pathname.startsWith("/auth") ||
  request.nextUrl.pathname.startsWith("/invite") ||
  request.nextUrl.pathname.startsWith("/join") ||
  request.nextUrl.pathname.startsWith("/new-public-route"); // 추가
```

### 새 관리자 페이지 추가

- `app/(admin)/admin/{route}/page.tsx` 생성
- `(admin)/layout.tsx`의 역할 검증 로직 그대로 상속

### Server Action 작성 패턴

```typescript
// lib/actions/events.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type ActionResult } from "@/lib/types";

export async function createEventAction(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "인증이 필요합니다" };

  // 비즈니스 로직...
  revalidatePath("/dashboard");
  return { success: true };
}
```

### async params 패턴 (Next.js 16 필수)

```typescript
// ✅ Next.js 16: params는 반드시 await
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  // ...
}

// ❌ 금지: 동기 접근
export default function Page({ params }: { params: { eventId: string } }) {
  const { eventId } = params; // 빌드 오류
}
```

### Supabase DB 조회 (Server Component)

```typescript
const supabase = await createClient(); // lib/supabase/server.ts
const { data, error } = await supabase.from("table_name").select();
```

---

## Supabase Client Usage Standards

### 환경별 클라이언트 선택

| 환경                             | import 경로             | 함수                     |
| -------------------------------- | ----------------------- | ------------------------ |
| Server Component / Route Handler | `@/lib/supabase/server` | `await createClient()`   |
| Server Action (`'use server'`)   | `@/lib/supabase/server` | `await createClient()`   |
| Client Component                 | `@/lib/supabase/client` | `createClient()`         |
| Middleware (proxy.ts)            | `@/lib/supabase/proxy`  | `updateSession(request)` |

### 절대 금지: Middleware 수정 시

- `createServerClient` 호출과 `supabase.auth.getClaims()` 호출 사이에 코드 삽입 금지
- 새 Response 객체 생성 시 반드시 쿠키 복사
- Supabase 클라이언트를 전역 변수로 선언 금지 (함수 내부에서 매번 생성)

---

## Authentication & Routing Standards

### 라우트 분류

| 분류             | 경로                   | 동작                                       |
| ---------------- | ---------------------- | ------------------------------------------ |
| 주최자 보호      | `/(dashboard)/*`       | 비인증 시 `/auth/login`으로 리다이렉트     |
| 관리자 보호      | `/(admin)/admin/*`     | 비관리자 시 `/dashboard`로 리다이렉트      |
| 공개 (비회원)    | `/invite/*`, `/join/*` | 인증 없이 접근 가능 (proxy.ts 예외 처리됨) |
| 공개 (인증 관련) | `/auth/*`              | 인증 없이 접근 가능                        |

### 관리자 판별 기준

```typescript
// lib/supabase/proxy.ts
const isAdmin =
  claims?.user_metadata?.role === "admin" ||
  MOCK_ADMIN_EMAILS.includes(claims?.email ?? "");
```

### 인증 확인 (Server Component)

```typescript
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect("/auth/login");
```

### 이메일 가입 방식

- 이메일 인증 없음 — Supabase `Confirm email` 비활성화 상태
- 가입 즉시 세션 생성 → `/dashboard` 리다이렉트
- `app/auth/confirm/` 디렉토리는 삭제됨 (재생성 금지)

---

## Database & RLS Standards

### 테이블 목록 (Phase 2에서 확정)

| 테이블명              | 주요 컬럼                                     | 특이사항                         |
| --------------------- | --------------------------------------------- | -------------------------------- |
| `profiles`            | id, role (admin/user)                         | auth.users와 1:1                 |
| `events`              | owner_id, title, date, location, invite_token | invite_token: DB 자동 생성       |
| `participants`        | event_id, name, phone, status, join_token     | join_token: DB 자동 생성, UNIQUE |
| `announcements`       | event_id, title, content                      | event 삭제 시 CASCADE            |
| `carpool_groups`      | event_id, driver_participant_id, capacity     | Mock의 seats → DB에서 capacity   |
| `carpool_assignments` | group_id, participant_id                      | UNIQUE(group_id, participant_id) |
| `expense_items`       | event_id, title, amount                       | Mock의 name → DB에서 title       |
| `expense_splits`      | item_id, participant_id, amount, is_paid      | Mock의 isPaid → DB에서 is_paid   |

### Mock → DB 필드명 매핑 (혼동 주의)

| Mock 필드       | DB 필드                    | 위치           |
| --------------- | -------------------------- | -------------- |
| `name`          | `title`                    | expense_items  |
| `isPaid`        | `is_paid`                  | expense_splits |
| `seats`         | `capacity`                 | carpool_groups |
| `memberIds[]`   | `carpool_assignments` 관계 | 정규화됨       |
| `expenseItemId` | `item_id`                  | expense_splits |

### TypeScript 타입 사용

```typescript
// ✅ DB 타입 참조
import { type Database } from "@/types/supabase";
type Event = Database["public"]["Tables"]["events"]["Row"];

// ❌ Mock 타입 import 금지 (신규 코드에서)
import { type MockEvent } from "@/lib/mock/types"; // 금지
```

### DB 타입 재생성

```bash
npx supabase gen types typescript --linked > types/supabase.ts
```

또는 MCP: `mcp__supabase__generate_typescript_types`

---

## TypeScript Standards

- `any` 타입 절대 사용 금지 — `unknown` 또는 정확한 타입 정의 사용
- `// @ts-ignore`, `// @ts-expect-error` 사용 금지
- `types/supabase.ts` 수동 편집 금지 (CLI로만 재생성)
- Server Action 반환 타입: `ActionResult` (`lib/types/index.ts` 정의)

---

## Styling Standards (Mobile-First)

### 기본 규칙

- Tailwind CSS 클래스만 사용, `style={{}}` 인라인 스타일 금지
- 조건부 클래스: `cn()` 유틸 사용 (`import { cn } from "@/lib/utils"`)
- 다크 모드: `dark:` 접두사 사용
- **반응형 순서**: 기본(모바일) → `sm:` → `md:` → `lg:` (모바일 클래스 먼저)

### 레이아웃 패턴

```typescript
// ✅ (dashboard) 그룹 — layout.tsx에서 Header/BottomTabBar 자동 제공
<main className="pt-14 pb-20 px-4">
  {children}
</main>

// ✅ 콘텐츠 컨테이너
<div className="max-w-[480px] mx-auto">

// ✅ (admin) 그룹
<main className="px-4 pb-8 pt-14 md:pl-56">
  <div className="mx-auto max-w-[1200px]">{children}</div>
</main>

// ✅ 공개 페이지 (invite, join) — MobileLayout 사용
<MobileLayout>
  {children}
</MobileLayout>
```

### 터치 UX 규칙

```typescript
// ✅ 터치 타겟 최소 44px
<button className="h-11 px-4">
<Button className="w-full h-12">  // 주요 액션

// ✅ 다이얼로그
<DialogContent className="max-w-[92vw] sm:max-w-md">

// ✅ 테이블 가로 스크롤
<div className="overflow-x-auto -mx-4 px-4">
  <Table>...</Table>
</div>

// ✅ 폼 Input (모바일 자동 확대 방지)
<Input className="text-base" />
```

---

## Key File Interaction Standards

### 동시 수정이 필요한 파일 쌍

| 작업                    | 수정할 파일                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| 새 주최자 보호 페이지   | `app/(dashboard)/{route}/page.tsx` — 별도 수정 불필요 (자동 보호)                  |
| 새 공개 페이지 추가     | `app/{route}/page.tsx` + `lib/supabase/proxy.ts` (isPublicRoute 조건 추가)         |
| 새 관리자 페이지 추가   | `app/(admin)/admin/{route}/page.tsx` — 별도 수정 불필요 (레이아웃이 역할 검증)     |
| DB 스키마 변경 (DDL)    | `mcp__supabase__apply_migration` 실행 + `types/supabase.ts` 재생성                 |
| 새 Server Action 추가   | `lib/actions/{domain}.ts` + `lib/schemas/{domain}.ts` (Zod 스키마 필수)            |
| 새 shadcn 컴포넌트 추가 | `npx shadcn@latest add {name}` → `components/ui/` 자동 생성                        |
| ROADMAP Task 완료       | `docs/ROADMAP.md` Task 행 `✅ 완료` 표시 + `mcp__shrimp-task-manager__verify_task` |

---

## AI Decision-making Standards

### Supabase 클라이언트 선택 기준

```
파일에 "use client" 있음?
  → YES: lib/supabase/client.ts 사용
  → NO: "use server" 선언 또는 Server Component인가?
      → YES: lib/supabase/server.ts 사용 (함수 내 await createClient())
      → 미들웨어(proxy.ts)인가?
          → YES: lib/supabase/proxy.ts의 updateSession만 호출
```

### 새 기능 구현 위치 결정

```
비즈니스 로직 (DB CRUD)?
  → lib/actions/{domain}.ts (Server Action)
  → lib/schemas/{domain}.ts (Zod 검증)

UI만 필요?
  → 주최자 전용: app/(dashboard)/ 하위 또는 components/events/
  → 비회원 전용: app/invite/ 또는 app/join/ 하위, components/invite/ 또는 components/join/
  → 관리자 전용: app/(admin)/admin/ 하위, components/admin/
  → 공통: components/layout/ 또는 components/ui/

순수 함수 (계산 로직)?
  → lib/utils/{name}.ts
```

### Mock 데이터 사용 기준

```
Phase 5 이후 신규 코드에서 lib/mock/ import?
  → 금지. 반드시 Supabase 타입과 실제 쿼리 사용
  → lib/mock/은 참조 목적으로만 유지, 신규 import 추가 금지
```

---

## Prohibited Actions

- `any` 타입 사용
- `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/proxy.ts` 직접 수정
- `components/ui/` 폴더에 파일 수동 생성 (반드시 `npx shadcn@latest add` 사용)
- 루트 `proxy.ts` 파일명 변경 또는 삭제
- Supabase 클라이언트를 전역 변수로 선언
- `createServerClient`와 `supabase.auth.getClaims()` 사이 코드 삽입
- 상대경로 import (`../../components/ui/button`) — `@/` 별칭 필수
- `// @ts-ignore` 또는 `// @ts-expect-error` 사용
- 인라인 `style={{}}` 속성 사용
- `types/supabase.ts` 수동 편집 (CLI로만 재생성)
- `app/auth/confirm/` 디렉토리 재생성 (삭제된 파일, 이메일 인증 제거됨)
- 신규 코드에서 `lib/mock/` 타입 또는 데이터 import
- Mock 타입(`MockEvent` 등)을 Server Component/Action에서 사용
- `execute_sql`로 DDL 실행 (반드시 `apply_migration` 사용)

---

## Quality Check

작업 완료 후 반드시 실행:

```bash
npm run check-all   # 타입체크 + ESLint + Prettier 통합 검사
npm run build       # 빌드 성공 확인
```

---

## Task Status Management Rules

### 작업 수명주기

| 상태          | 전환 시점                |
| ------------- | ------------------------ |
| `pending`     | 초기 생성 상태           |
| `in_progress` | 작업 시작 직후 즉시 전환 |
| `completed`   | 구현 + 검증 완료 후 전환 |

### 필수 상태 업데이트 절차

**작업 시작 시:**

- `mcp__shrimp-task-manager__execute_task` 호출 → `status: in_progress`

**작업 완료 시** (`npm run check-all` 통과 후):

1. `mcp__shrimp-task-manager__verify_task` 호출 → `status: completed`
2. `docs/ROADMAP.md` 해당 Task 행 → `✅ 완료` 표시

### 금지 사항

- 검증(`npm run check-all`) 없이 `completed` 처리
- MCP 도구를 거치지 않고 `shrimp_data/tasks.json` 직접 수동 편집
- 작업 시작·완료 선언 없이 구현만 진행
