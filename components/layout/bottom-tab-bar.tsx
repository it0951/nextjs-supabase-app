"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Calendar, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabItem {
  /** 탭 레이블 */
  label: string;
  /** 탭 경로 */
  href: string;
  /** 탭 아이콘 */
  icon: React.ComponentType<{ className?: string }>;
  /** 활성 경로 매칭 패턴 (기본값: href와 동일) */
  matchPath?: string;
}

/** 하단 탭 목록 정의 */
const TAB_ITEMS: TabItem[] = [
  {
    label: "홈",
    href: "/",
    icon: Home,
    matchPath: "/",
  },
  {
    label: "이벤트",
    href: "/events/new",
    icon: Calendar,
    matchPath: "/events",
  },
  {
    label: "알림",
    href: "#",
    icon: Bell,
  },
  {
    label: "마이",
    href: "#",
    icon: User,
  },
];

/**
 * 고정 하단 탭 네비게이션 컴포넌트
 * - 현재 경로에 따라 활성 탭 표시
 * - 터치 타겟 최소 44px 보장
 */
export function BottomTabBar() {
  const pathname = usePathname();

  /**
   * 탭 활성 여부 판단
   */
  const isActive = (tab: TabItem): boolean => {
    if (tab.href === "#") return false;
    const matchPath = tab.matchPath ?? tab.href;
    if (matchPath === "/") return pathname === "/";
    return pathname.startsWith(matchPath);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background"
      aria-label="하단 탭 네비게이션"
    >
      <div className="mx-auto flex h-full max-w-[480px] items-center">
        {TAB_ITEMS.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              {/* 탭 아이콘 */}
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform",
                  active && "scale-110"
                )}
              />

              {/* 탭 레이블 */}
              <span
                className={cn(
                  "text-xs font-medium leading-none",
                  active && "font-semibold"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
