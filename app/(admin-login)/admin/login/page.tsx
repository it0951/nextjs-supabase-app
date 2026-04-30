import { AdminLoginForm } from "@/components/admin/admin-login-form";

/**
 * 관리자 전용 로그인 페이지
 * - (admin-login) 라우트 그룹 사용: (admin) 레이아웃의 인증 검증과 독립 동작
 * - 비로그인 상태에서도 접근 가능 (미들웨어에서 /admin/login 허용)
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <AdminLoginForm />
      </div>
    </div>
  );
}
