# Development Guidelines

## Project Overview

- Next.js App Router + Supabase 풀스택 웹 애플리케이션
- 기술 스택: Next.js (App Router), Supabase (Auth + DB), Tailwind CSS, shadcn/ui, TypeScript (strict)
- 인증: Supabase Auth (이메일/비밀번호 + Google OAuth)
- `src/` 디렉토리 없음 — 모든 소스는 루트의 `app/`, `components/`, `lib/`에 위치

---

## Project Architecture

### 디렉토리 구조

```
/
├── app/                      # Next.js App Router 페이지
│   ├── layout.tsx            # 루트 레이아웃 (ThemeProvider 포함)
│   ├── page.tsx              # 홈페이지 (/)
│   ├── globals.css           # 전역 CSS
│   ├── auth/                 # 공개 인증 라우트
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── update-password/page.tsx
│   │   ├── sign-up-success/page.tsx
│   │   ├── error/page.tsx
│   │   ├── confirm/route.ts  # 이메일 OTP 확인
│   │   └── callback/route.ts # OAuth 콜백
│   └── protected/            # 인증 필수 라우트
│       ├── layout.tsx
│       └── page.tsx
├── components/               # React 컴포넌트
│   ├── ui/                   # shadcn/ui 컴포넌트 (자동 생성만)
│   ├── login-form.tsx
│   ├── sign-up-form.tsx
│   ├── forgot-password-form.tsx
│   ├── update-password-form.tsx
│   ├── google-sign-in-button.tsx
│   ├── auth-button.tsx
│   └── logout-button.tsx
├── lib/
│   ├── utils.ts              # cn() 유틸 및 hasEnvVars
│   └── supabase/
│       ├── server.ts         # Server Component용 클라이언트
│       ├── client.ts         # Client Component용 클라이언트
│       └── proxy.ts          # Middleware용 세션 갱신
├── types/
│   └── supabase.ts           # DB 타입 (CLI 자동 생성)
├── docs/
│   └── guides/               # 개발 가이드 문서
├── proxy.ts                  # 루트 미들웨어 (파일명 변경 금지)
└── components.json           # shadcn/ui 설정
```

---

## Code Standards

### 네이밍

- 컴포넌트 함수: `PascalCase`
- 파일명: `kebab-case.tsx`
- 변수/함수: `camelCase`
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

---

## Functionality Implementation Standards

### 새 페이지 추가

- 보호 필요: `app/protected/{route}/page.tsx` 에 생성 → 자동으로 인증 보호됨
- 공개 페이지: `app/{route}/page.tsx` 에 생성 → `proxy.ts` 조건문에 경로 예외 추가 필요

### 새 컴포넌트 추가

- 재사용 컴포넌트: `components/{name}.tsx`
- shadcn/ui 컴포넌트: `npx shadcn@latest add [component-name]` 명령으로만 추가

### Supabase DB 조회

```typescript
// Server Component에서
const supabase = await createClient(); // lib/supabase/server.ts
const { data, error } = await supabase.from("table_name").select();
```

### 공개 라우트 추가 시 proxy.ts 수정

```typescript
// lib/supabase/proxy.ts의 리다이렉트 조건에 경로 추가
if (
  request.nextUrl.pathname !== "/" &&
  !user &&
  !request.nextUrl.pathname.startsWith("/login") &&
  !request.nextUrl.pathname.startsWith("/auth") &&
  !request.nextUrl.pathname.startsWith("/new-public-route") // 추가
) {
```

---

## Supabase Client Usage Standards

### 환경별 클라이언트 선택

| 환경                             | import 경로             | 함수                     |
| -------------------------------- | ----------------------- | ------------------------ |
| Server Component / Route Handler | `@/lib/supabase/server` | `await createClient()`   |
| Client Component                 | `@/lib/supabase/client` | `createClient()`         |
| Middleware (proxy.ts)            | `@/lib/supabase/proxy`  | `updateSession(request)` |

### Server Component 사용 패턴

```typescript
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient(); // 함수 내부에서 매번 생성
  const { data } = await supabase.from("table").select();
}
```

### Client Component 사용 패턴

```typescript
"use client";
import { createClient } from "@/lib/supabase/client";

export function ClientComponent() {
  const supabase = createClient();
  // ...
}
```

### 절대 금지: Middleware 수정 시

- `createServerClient` 호출과 `supabase.auth.getClaims()` 호출 사이에 어떤 코드도 삽입 금지
- 새 Response 객체 생성 시 반드시 쿠키 복사 (`myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())`)

---

## Authentication & Routing Standards

### 라우트 분류

| 분류        | 경로           | 동작                                   |
| ----------- | -------------- | -------------------------------------- |
| 보호 라우트 | `/protected/*` | 비인증 시 `/auth/login`으로 리다이렉트 |
| 공개 라우트 | `/`, `/auth/*` | 인증 없이 접근 가능                    |

### 인증 확인 (Server Component)

```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect("/auth/login");
```

### 이메일 확인: `app/auth/confirm/route.ts`

- OTP 토큰 검증 후 리다이렉트 처리
- 이 파일 직접 수정 시 인증 흐름 전체에 영향

---

## TypeScript Standards

- `any` 타입 절대 사용 금지 — `unknown` 또는 정확한 타입 정의 사용
- Supabase 테이블 타입: `@/types/supabase` 의 `Database` 타입 참조
- DB 타입 재생성: `npx supabase gen types typescript --linked > types/supabase.ts`
- `// @ts-ignore`, `// @ts-expect-error` 사용 금지

```typescript
// ✅ 올바른 예
import { type Database } from "@/types/supabase";
type User = Database["public"]["Tables"]["users"]["Row"];

// ❌ 잘못된 예
const data: any = await supabase.from("users").select();
```

---

## Styling Standards (Mobile-First)

이 프로젝트는 **모바일 퍼스트** 기준으로 UI를 구현합니다.

### 기본 규칙

- Tailwind CSS 클래스만 사용, `style={{}}` 인라인 스타일 금지
- 조건부 클래스: `cn()` 유틸 사용 (`import { cn } from "@/lib/utils"`)
- 다크 모드: `dark:` 접두사 사용 (ThemeProvider가 `app/layout.tsx`에 설정됨)
- **반응형 순서**: 기본(모바일) → `sm:` → `md:` → `lg:` (모바일 클래스 먼저)
- shadcn/ui 컴포넌트 스타일 직접 수정 금지 → variant/className prop 활용

### 모바일 퍼스트 레이아웃 패턴

```typescript
// ✅ 전체 페이지 래퍼 — (dashboard) 그룹 내 모든 페이지
<div className="min-h-screen bg-background">
  {/* Header: fixed top-0 z-50 h-14 — layout에서 이미 제공 */}
  <main className="pt-14 pb-20 px-4">
    {children}
  </main>
  {/* BottomTabBar: fixed bottom-0 z-50 h-16 — layout에서 이미 제공 */}
</div>

// ✅ 콘텐츠 컨테이너 (선택적, 넓은 화면 중앙 정렬 필요 시)
<div className="max-w-[480px] mx-auto">

// ✅ 섹션 간격
<div className="space-y-4">   // 카드 목록
<div className="space-y-6">   // 섹션 간

// ✅ 카드 리스트 (1열 세로 스크롤, 모바일 기본)
<div className="space-y-3">
  <EventCard /> ...
</div>

// ❌ 잘못된 예 — 모바일에서 깨짐
<div className="grid grid-cols-3 gap-4">
```

### 터치 UX 규칙

```typescript
// ✅ 터치 타겟 최소 44px
<button className="h-11 px-4">   // 인라인 버튼
<Button className="w-full h-12"> // 주요 액션 버튼

// ✅ 다이얼로그 — 모바일 화면 넘침 방지
<DialogContent className="max-w-[92vw] sm:max-w-md">

// ✅ 테이블 — 가로 스크롤 처리
<div className="overflow-x-auto -mx-4 px-4">
  <Table>...</Table>
</div>

// ✅ 탭 — 가로 스크롤 허용
<TabsList className="w-full overflow-x-auto flex-nowrap justify-start">

// ✅ 폼 Input — 모바일 자동 확대 방지
<Input className="text-base" />   // text-base (16px) 이상

// ❌ 잘못된 예
<div style={{ display: "flex", alignItems: "center" }}>
```

### 고정 레이아웃 컴포넌트

| 컴포넌트       | 위치 | 클래스                                                                         |
| -------------- | ---- | ------------------------------------------------------------------------------ |
| `Header`       | 상단 | `fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b` |
| `BottomTabBar` | 하단 | `fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t`               |

### 브레이크포인트

| 브레이크포인트 | 너비    | 적용 기준              |
| -------------- | ------- | ---------------------- |
| (기본)         | ~479px  | 모바일 — **필수 구현** |
| `sm:`          | 480px~  | 대화면 모바일          |
| `md:`          | 768px~  | 태블릿                 |
| `lg:`          | 1024px~ | 데스크톱 (보조)        |

---

## Key File Interaction Standards

### 동시 수정이 필요한 파일 쌍

| 작업                    | 수정할 파일                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| 새 보호 페이지 추가     | `app/protected/{route}/page.tsx` (자동 보호, 별도 수정 불필요)          |
| 새 공개 페이지 추가     | `app/{route}/page.tsx` + `lib/supabase/proxy.ts` (리다이렉트 예외 추가) |
| DB 스키마 변경          | Supabase 대시보드/마이그레이션 + `types/supabase.ts` 재생성             |
| 새 shadcn 컴포넌트 추가 | `npx shadcn@latest add` 실행 → `components/ui/` 자동 생성               |
| 환경변수 추가           | `.env.local` + `lib/utils.ts`의 `hasEnvVars` 수정 검토                  |

---

## AI Decision-making Standards

### Supabase 클라이언트 선택 기준

```
파일에 "use client" 있음?
  → YES: lib/supabase/client.ts 사용
  → NO: Server Component인가?
      → YES: lib/supabase/server.ts 사용 (함수 내 await createClient())
      → 미들웨어(proxy.ts)인가?
          → YES: lib/supabase/proxy.ts의 updateSession만 호출
```

### 컴포넌트 위치 결정 기준

```
shadcn/ui 기본 컴포넌트?
  → YES: npx shadcn@latest add 실행 → components/ui/ 자동 배치
  → NO: 여러 페이지에서 재사용?
      → YES: components/{name}.tsx
      → NO: 해당 페이지 폴더 내 배치 고려
```

### 인증 상태 확인 위치

```
Server Component → supabase.auth.getUser() 직접 호출
Client Component → @supabase/ssr의 onAuthStateChange 또는 세션 확인
미들웨어 → supabase.auth.getClaims() (proxy.ts에서 이미 처리됨)
```

---

## Prohibited Actions

- `any` 타입 사용 — 타입 안전성 보장 필수
- `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/proxy.ts` 직접 수정
- `components/ui/` 폴더에 파일 수동 생성 (반드시 `npx shadcn@latest add` 사용)
- 루트 `proxy.ts` 파일명 변경 또는 삭제
- Supabase 클라이언트를 전역 변수로 선언
- `createServerClient`와 `supabase.auth.getClaims()` 사이 코드 삽입
- 상대경로 import (`../../components/ui/button`) — `@/` 별칭 필수
- `// @ts-ignore` 또는 `// @ts-expect-error` 사용
- 인라인 `style={{}}` 속성 사용
- `types/supabase.ts` 수동 편집 (CLI로만 재생성)

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

모든 작업은 `shrimp_data/tasks.json`의 `status` 필드로 상태를 추적한다.

| 상태          | 의미    | 전환 시점                |
| ------------- | ------- | ------------------------ |
| `pending`     | 대기 중 | 초기 생성 상태           |
| `in_progress` | 진행 중 | 작업 시작 직후 즉시 전환 |
| `completed`   | 완료    | 구현 + 검증 완료 후 전환 |

### 필수 상태 업데이트 절차

**작업 시작 시:**

- `mcp__shrimp-task-manager__execute_task` 호출 → `status: in_progress`, `updatedAt` 갱신

**작업 완료 시** (`npm run check-all` 통과 후):

1. `mcp__shrimp-task-manager__verify_task` 호출 → `status: completed`, `updatedAt` 갱신
2. `docs/ROADMAP.md` 해당 Task 행 → `✅ 완료` 표시

### 금지 사항

- 검증(`npm run check-all`) 없이 `completed` 처리
- MCP 도구를 거치지 않고 `shrimp_data/tasks.json` 직접 수동 편집
- 작업 시작·완료 선언 없이 구현만 진행
