import { type ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface DashboardGroupLayoutProps {
  children: ReactNode;
}

interface DashboardUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

/**
 * 서버에서 사용자 정보를 조회하는 컴포넌트
 * Suspense 경계 내에서 쿠키 기반 인증 처리
 */
async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/auth/login");
  }

  // 사용자 표시 이름 추출 (메타데이터 → 이메일 앞부분 순으로 폴백)
  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "사용자";

  const dashboardUser: DashboardUser = {
    name: displayName,
    email: user.email ?? "",
    avatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ?? undefined,
  };

  return <DashboardLayout user={dashboardUser}>{children}</DashboardLayout>;
}

/**
 * (dashboard) 라우트 그룹 레이아웃
 * - Suspense 경계로 감싸서 쿠키 접근으로 인한 렌더링 블로킹 방지
 * - Supabase에서 현재 로그인 사용자 정보를 조회
 * - 비로그인 사용자는 /auth/login으로 리다이렉트
 */
export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return (
    <Suspense fallback={null}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}
