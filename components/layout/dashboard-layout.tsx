import { type ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

interface DashboardUser {
  /** 사용자 이름 */
  name: string;
  /** 사용자 이메일 */
  email: string;
  /** 아바타 이미지 URL (선택) */
  avatarUrl?: string;
}

interface DashboardLayoutProps {
  /** 페이지 콘텐츠 */
  children: ReactNode;
  /** 로그인된 사용자 정보 (선택) */
  user?: DashboardUser;
}

/**
 * 대시보드 공통 레이아웃 컴포넌트
 * - 상단 고정 헤더 (h-14)
 * - 하단 고정 탭 네비게이션 (h-16)
 * - 콘텐츠 영역: pt-14 pb-20 px-4
 * - 모바일 퍼스트: max-w-[480px] mx-auto
 */
export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* 고정 상단 헤더 */}
      <Header user={user} />

      {/* 메인 콘텐츠 영역 */}
      <main className="px-4 pb-20 pt-14">
        <div className="mx-auto max-w-[480px]">{children}</div>
      </main>

      {/* 고정 하단 탭 네비게이션 */}
      <BottomTabBar />
    </div>
  );
}
