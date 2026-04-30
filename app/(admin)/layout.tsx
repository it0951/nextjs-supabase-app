import { type ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/admin-layout";

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
 * - profiles 테이블의 role 컬럼으로 관리자 여부를 DB에서 직접 검증
 * - Suspense 경계 내에서 쿠키 기반 인증 처리
 */
async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 사용자는 관리자 전용 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/admin/login");
  }

  // profiles 테이블에서 role 및 프로필 정보 조회 (DB 기반 이중 검증)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  // 비관리자 사용자는 대시보드로 리다이렉트
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // 표시 이름: profile.full_name → user_metadata.name → 이메일 앞부분 순으로 폴백
  const displayName: string =
    profile.full_name ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "관리자";

  const adminUser: AdminUser = {
    name: displayName,
    email: profile.email ?? user.email ?? "",
    avatarUrl: profile.avatar_url ?? undefined,
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
