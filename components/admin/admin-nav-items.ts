import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * 관리자 사이드바 메뉴 아이템 타입
 */
export interface AdminNavItem {
  /** 이동할 경로 */
  href: string;
  /** 메뉴 라벨 */
  label: string;
  /** Lucide 아이콘 컴포넌트 */
  icon: LucideIcon;
}

/**
 * 관리자 네비게이션 메뉴 목록
 * AdminSidebar와 AdminMobileNav에서 공통으로 사용
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin/dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    label: "사용자 관리",
    icon: Users,
  },
  {
    href: "/admin/events",
    label: "이벤트 관리",
    icon: Calendar,
  },
  {
    href: "/admin/settings",
    label: "시스템 설정",
    icon: Settings,
  },
];
