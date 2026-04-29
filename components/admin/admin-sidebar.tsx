"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/components/admin/admin-nav-items";

/**
 * 데스크톱 전용 관리자 고정 사이드바
 * - md 이상 화면에서만 표시 (모바일에서는 AdminMobileNav 사용)
 * - fixed 위치로 좌측 상단 고정
 * - 현재 경로와 일치하는 메뉴 하이라이트
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-14 hidden w-56 flex-col border-r bg-background md:flex">
      {/* 사이드바 상단 레이블 */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-muted-foreground">
          관리자
        </span>
      </div>

      {/* 네비게이션 메뉴 목록 */}
      <nav className="flex flex-col gap-1 p-3">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // 기본 스타일 — 터치 타겟 최소 44px 보장
                "flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                // 비활성 상태
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                // 활성 상태 하이라이트
                isActive &&
                  "bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
