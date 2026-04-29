"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

interface AdminHeaderUser {
  /** 사용자 이름 */
  name: string;
  /** 사용자 이메일 */
  email: string;
  /** 아바타 이미지 URL (선택) */
  avatarUrl?: string;
}

interface AdminHeaderProps {
  /** 로그인된 관리자 정보 (선택) */
  user?: AdminHeaderUser;
}

/**
 * 이름의 앞 두 글자로 이니셜 생성 (아바타 폴백용)
 */
function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

/**
 * 관리자 고정 상단 헤더 컴포넌트
 * - 좌측: 햄버거 버튼(모바일) + "관리자 패널" 로고
 * - 우측: 사용자 드롭다운 메뉴 (일반 대시보드 링크 + 로그아웃)
 * - 햄버거 클릭 시 AdminMobileNav Sheet 열기
 */
export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  /** 모바일 사이드바 Sheet 열림 상태 */
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  /**
   * 로그아웃 처리 — Supabase 세션 종료 후 로그인 페이지로 이동
   */
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          {/* 좌측: 햄버거 + 로고 */}
          <div className="flex items-center gap-2">
            {/* 햄버거 버튼 — 모바일에서만 표시 */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="사이드바 메뉴 열기"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* 관리자 패널 로고 */}
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-bold text-primary"
            >
              <Shield className="h-5 w-5" />
              <span className="text-lg">관리자 패널</span>
            </Link>
          </div>

          {/* 우측: 사용자 드롭다운 메뉴 */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full p-0"
                  aria-label="사용자 메뉴 열기"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    )}
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* 사용자 정보 */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* 일반 대시보드 링크 */}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    일반 대시보드
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* 로그아웃 */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">로그인</Link>
            </Button>
          )}
        </div>
      </header>

      {/* 모바일 슬라이드 사이드바 — 헤더에서 open 상태 관리 */}
      <AdminMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}
