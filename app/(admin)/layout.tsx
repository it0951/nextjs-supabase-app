import { type ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/admin-layout";
import { isMockAdmin } from "@/lib/mock/admin-data";

interface AdminGroupLayoutProps {
  children: ReactNode;
}

interface AdminUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

/**
 * 서버에서 사용자 정보 조회 및 관리자 역할 검증 컴포넌트
 * Suspense 경계 내에서 쿠키 기반 인증 처리
 */
async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/auth/login");
  }

  // 관리자 역할 이중 검증 (미들웨어 + 레이아웃)
  const role = user.user_metadata?.role as string | undefined;
  const isAdmin = role === "admin" || isMockAdmin(user.email);
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // 사용자 표시 이름 추출 (메타데이터 → 이메일 앞부분 순으로 폴백)
  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "관리자";

  const adminUser: AdminUser = {
    name: displayName,
    email: user.email ?? "",
    avatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ?? undefined,
  };

  return <AdminLayout user={adminUser}>{children}</AdminLayout>;
}

/**
 * (admin) 라우트 그룹 레이아웃
 * - Suspense 경계로 감싸서 쿠키 접근으로 인한 렌더링 블로킹 방지
 * - 비로그인 사용자 → /auth/login 리다이렉트
 * - 비관리자 사용자 → /dashboard 리다이렉트
 */
export default function AdminGroupLayout({ children }: AdminGroupLayoutProps) {
  return (
    <Suspense fallback={null}>
      <AuthenticatedAdminLayout>{children}</AuthenticatedAdminLayout>
    </Suspense>
  );
}
