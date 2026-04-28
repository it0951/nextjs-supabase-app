# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 16와 Supabase를 사용한 풀스택 웹 애플리케이션 스타터 킷입니다. App Router, Server Components, 그리고 Supabase Auth를 활용한 인증 시스템을 포함하고 있습니다.

## 주요 기술 스택

- **프레임워크**: Next.js (최신 버전, App Router)
- **인증/데이터베이스**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui (new-york 스타일, Radix UI 기반)
- **테마**: next-themes (다크 모드 지원)
- **아이콘**: Lucide React
- **타입스크립트**: 엄격 모드 활성화

## 개발 명령어

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 검사
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포맷팅
npm run format:check   # Prettier 검사만
npm run typecheck      # TypeScript 타입 체크
npm run check-all      # 타입 + ESLint + Prettier 통합 검사 (권장)
```

## ✅ 작업 완료 체크리스트

```bash
npm run check-all   # 타입체크 + ESLint + Prettier 통합 검사
npm run build       # 빌드 성공 확인
```

## ⚡ UI 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]    # 새 컴포넌트 추가
```

## 프로젝트 구조 및 아키텍처

### Supabase 클라이언트 패턴

이 프로젝트는 **세 가지 다른 Supabase 클라이언트**를 환경에 따라 사용합니다:

1. **Server Components**: `lib/supabase/server.ts`의 `createClient()`
   - Server Components와 Route Handlers에서 사용
   - 쿠키 기반 인증 처리
   - **중요**: Fluid compute 환경을 위해 함수 내에서 매번 새로 생성해야 함 (전역 변수 사용 금지)

2. **Client Components**: `lib/supabase/client.ts`의 `createClient()`
   - 브라우저 환경의 Client Components에서 사용
   - `createBrowserClient` 사용

3. **Middleware**: `lib/supabase/proxy.ts`의 `updateSession()`
   - 루트의 `proxy.ts`에서 호출되어 세션 쿠키를 갱신
   - 인증되지 않은 사용자를 `/auth/login`으로 리다이렉트
   - **중요**: `createServerClient`와 `supabase.auth.getClaims()` 사이에 코드를 추가하지 말 것

### 인증 흐름

- **미들웨어 보호**: 루트 `proxy.ts`가 모든 요청을 가로채서 인증 확인
- **보호된 라우트**: `/protected` 경로는 인증된 사용자만 접근 가능
- **공개 경로**: `/auth/*` (login, sign-up, forgot-password 등)는 미들웨어에서 제외
- **인증 확인 라우트**: `/auth/confirm/route.ts`에서 이메일 확인 처리

### 환경 변수

필수 환경 변수 (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=[Supabase 프로젝트 URL]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[Supabase Anon Key]
```

**참고**: 환경 변수가 설정되지 않은 경우 미들웨어는 자동으로 건너뜁니다.

### 경로 별칭 설정

`tsconfig.json`에서 `@/*`를 프로젝트 루트로 매핑:

```typescript
// 사용 예시
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
```

### shadcn/ui 컴포넌트

- **스타일**: new-york
- **위치**: `components/ui/`
- **설정**: `components.json`에서 관리
- **추가 방법**: `npx shadcn@latest add [component-name]`

## 코드 작성 가이드라인

### Supabase 클라이언트 사용 시 주의사항

1. **Server Components/Route Handlers**:

   ```typescript
   import { createClient } from "@/lib/supabase/server";

   export default async function ServerComponent() {
     // 매번 새로 생성 (전역 변수 X)
     const supabase = await createClient();
     const { data } = await supabase.from("table").select();
   }
   ```

2. **Client Components**:

   ```typescript
   "use client";
   import { createClient } from "@/lib/supabase/client";

   export default function ClientComponent() {
     const supabase = createClient();
     // ...
   }
   ```

3. **Middleware 수정 시**:
   - `createServerClient`와 `supabase.auth.getClaims()` 사이에 코드를 추가하지 말 것
   - 새로운 Response 객체를 만들 경우 반드시 쿠키를 복사할 것

### TypeScript 타입

- Supabase 데이터베이스 타입은 `types/supabase.ts`에 정의됨 (Supabase CLI로 자동 생성)
- 타입 생성: `npx supabase gen types typescript --linked > types/supabase.ts`

## Git Hooks (Husky + lint-staged)

커밋 전 자동으로 코드 품질 검사를 수행합니다:

- **pre-commit**: 스테이지된 파일에 대해 ESLint 자동 수정 + Prettier 포맷팅 실행
- **설정 파일**: `.lintstagedrc.mjs` (파일 타입별 실행 도구 정의)
- `*.{ts,tsx,js,mjs}` → `eslint --fix` → `prettier --write`
- `*.{json,css,md}` → `prettier --write`

## 코드 스타일 (Prettier)

- **설정 파일**: `.prettierrc`
- 세미콜론: 사용, 따옴표: 쌍따옴표, 들여쓰기: 2칸, 줄 길이: 80
- **prettier-plugin-tailwindcss**: Tailwind 클래스 자동 정렬 포함

## MCP 서버 설정

프로젝트는 다음 MCP 서버를 사용합니다:

- **supabase**: Supabase 데이터베이스 연동
- **playwright**: 브라우저 자동화
- **context7**: 문서 검색
- **shadcn**: shadcn/ui 컴포넌트 관리
- **shrimp-task-manager**: 작업 관리

## 추가 참고사항

- **Turbopack**: 개발 서버는 Turbopack을 사용하여 더 빠른 개발 경험 제공
- **폰트**: Geist Sans 폰트를 기본으로 사용
- **다크 모드**: next-themes를 통해 시스템 설정 기반 자동 전환 지원

💡 **상세 규칙은 위 개발 가이드 문서들을 참조하세요**

## 개발 가이드라인

상세 가이드는 `docs/guides/`에 있습니다:

- `nextjs-16.md`: Next.js 16 App Router 규칙 (async params, Server Components, Streaming)
- `forms-react-hook-form.md`: React Hook Form + Zod v4 + Server Actions 폼 패턴
- `styling-guide.md`: Tailwind + shadcn/ui 스타일링 규칙
- `component-patterns.md`: Server/Client 컴포넌트 분리, 재사용 패턴
- `project-structure.md`: 파일 구조, 네이밍 컨벤션

### 언어 규칙

- 응답 언어: **한국어**
- 코드 주석: 한국어
- 커밋 메시지: 한국어
- 변수명/함수명: 영어
- `any` 타입 사용 금지

## 📱 모바일 퍼스트 개발 원칙

이 프로젝트는 **모바일 퍼스트(Mobile First)** 기준으로 UI/UX를 설계합니다.

### 레이아웃 기준

- **기본 너비**: 375px (모바일 기준 설계, 데스크톱은 중앙 정렬로 대응)
- **컨테이너**: `max-w-[480px] mx-auto` — 모바일 앱처럼 중앙 정렬
- **상단 영역**: 고정 헤더 `fixed top-0 h-14` → 콘텐츠에 `pt-14` 필수
- **하단 영역**: 고정 탭 네비 `fixed bottom-0 h-16` → 콘텐츠에 `pb-20` 필수

### 공통 레이아웃 구조

```tsx
// 모든 (dashboard) 그룹 페이지 기본 구조
<div className="relative min-h-screen bg-background">
  <Header /> {/* fixed top-0 z-50 h-14 */}
  <main className="px-4 pb-20 pt-14">{children}</main>
  <BottomTabBar /> {/* fixed bottom-0 z-50 h-16 */}
</div>
```

### 공통 레이아웃 컴포넌트

| 컴포넌트       | 경로                                   | 역할                                  |
| -------------- | -------------------------------------- | ------------------------------------- |
| `Header`       | `components/layout/header.tsx`         | 고정 상단 헤더 (로고 + 알림 + 프로필) |
| `BottomTabBar` | `components/layout/bottom-tab-bar.tsx` | 고정 하단 탭 (홈/이벤트/알림/마이)    |
| `MobileLayout` | `components/layout/mobile-layout.tsx`  | 비로그인 공개 페이지용 래퍼           |

### 터치 UX 규칙

- **터치 타겟**: 최소 `min-h-[44px]` (버튼, 링크, 아이템 행)
- **폰트 크기**: 본문 `text-base(16px)`, 서브 `text-sm(14px)`, 캡션 `text-xs(12px)`
- **간격**: 섹션 간 `gap-4 ~ gap-6`, 카드 간 `gap-3`, 가로 패딩 `px-4`
- **버튼**: 하단 고정 액션은 `w-full h-12`, 인라인 버튼은 `h-10` 이상

### 반응형 브레이크포인트 (모바일 퍼스트)

| 브레이크포인트 | 너비    | 용도                        |
| -------------- | ------- | --------------------------- |
| (기본)         | ~479px  | 모바일 — **주 설계 기준**   |
| `sm:`          | 480px~  | 대화면 모바일 / 소형 태블릿 |
| `md:`          | 768px~  | 태블릿                      |
| `lg:`          | 1024px~ | 데스크톱 (보조)             |

> **규칙**: 모바일 레이아웃을 먼저 완성한 뒤 `sm:` 이상 클래스를 추가합니다.
