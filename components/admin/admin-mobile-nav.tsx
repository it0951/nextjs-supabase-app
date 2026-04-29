"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/components/admin/admin-nav-items";

interface AdminMobileNavProps {
  /** Sheet 열림 상태 */
  open: boolean;
  /** Sheet 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
}

/**
 * 모바일 전용 관리자 슬라이드 사이드바
 * - Sheet 컴포넌트 기반 좌측 슬라이드 네비게이션
 * - 현재 경로와 일치하는 메뉴 하이라이트
 * - 메뉴 클릭 시 자동으로 Sheet 닫기
 */
export function AdminMobileNav({ open, onOpenChange }: AdminMobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b px-4 py-3">
          {/* 접근성을 위한 Sheet 제목 */}
          <SheetTitle className="flex items-center gap-2 text-left text-base font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            관리자 메뉴
          </SheetTitle>
        </SheetHeader>

        {/* 네비게이션 메뉴 목록 */}
        <nav className="flex flex-col gap-1 p-3">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
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
      </SheetContent>
    </Sheet>
  );
}
