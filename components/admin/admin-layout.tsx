import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminLayoutUser {
  /** 사용자 이름 */
  name: string;
  /** 사용자 이메일 */
  email: string;
  /** 아바타 이미지 URL (선택) */
  avatarUrl?: string;
}

interface AdminLayoutProps {
  /** 페이지 콘텐츠 */
  children: React.ReactNode;
  /** 로그인된 관리자 정보 (선택) */
  user?: AdminLayoutUser;
}

/**
 * 관리자 전용 레이아웃 래퍼 (서버 컴포넌트)
 * - 고정 헤더 + 데스크톱 사이드바 + 메인 콘텐츠 영역
 * - 모바일: 전체 너비 / 데스크톱(md 이상): 사이드바(w-56) + 콘텐츠
 * - 콘텐츠 최대 너비: 1200px (관리자 대시보드 기준)
 */
export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* 고정 상단 헤더 — 햄버거 버튼으로 모바일 사이드바 제어 */}
      <AdminHeader user={user} />

      {/* 데스크톱 고정 사이드바 — md 이상에서만 표시 */}
      <AdminSidebar />

      {/* 메인 콘텐츠 영역 */}
      {/* pt-14: 고정 헤더 높이 확보 / md:pl-56: 사이드바 너비 확보 */}
      <main className="px-4 pb-8 pt-14 md:pl-56">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
