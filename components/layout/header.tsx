"use client";

import Link from "next/link";
import { Bell, Calendar } from "lucide-react";
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
import { useRouter } from "next/navigation";

interface HeaderUser {
  /** 사용자 이름 */
  name: string;
  /** 사용자 이메일 */
  email: string;
  /** 아바타 이미지 URL (선택) */
  avatarUrl?: string;
}

interface HeaderProps {
  /** 로그인된 사용자 정보 (선택) */
  user?: HeaderUser;
}

/**
 * 고정 상단 헤더 컴포넌트
 * - 좌측: 모이자 로고 + 앱 이름
 * - 우측: 알림 버튼 + 유저 메뉴
 */
export function Header({ user }: HeaderProps) {
  const router = useRouter();

  /**
   * 로그아웃 처리
   */
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  /**
   * 이름의 이니셜 생성 (아바타 폴백용)
   */
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full max-w-[480px] items-center justify-between px-4">
        {/* 로고 영역 */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-primary"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-lg">모이자</span>
        </Link>

        {/* 우측 액션 영역 */}
        <div className="flex items-center gap-1">
          {/* 알림 버튼 */}
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="#">
              <Bell className="h-5 w-5" />
              <span className="sr-only">알림</span>
            </Link>
          </Button>

          {/* 유저 메뉴 */}
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
      </div>
    </header>
  );
}
