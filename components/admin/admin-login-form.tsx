"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 관리자 전용 로그인 폼 컴포넌트
 * - 로그인 성공 후 profiles 테이블에서 role 조회
 * - role === 'admin' 인 경우에만 /admin/dashboard 접근 허용
 * - 비관리자는 로그아웃 처리 후 에러 메시지 표시
 */
export function AdminLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // 1단계: 이메일/비밀번호로 로그인 시도
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // 2단계: 현재 로그인한 사용자 정보 조회
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("사용자 정보를 가져올 수 없습니다.");
      }

      // 3단계: profiles 테이블에서 role 조회
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // 프로필이 없거나 조회 실패 시 로그아웃 처리
        await supabase.auth.signOut();
        throw new Error("프로필 정보를 가져올 수 없습니다.");
      }

      // 4단계: 관리자 역할 확인
      if (profile?.role !== "admin") {
        // 비관리자는 즉시 로그아웃 처리
        await supabase.auth.signOut();
        setError("관리자 권한이 없습니다.");
        return;
      }

      // 5단계: 관리자 대시보드로 이동
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          {/* 관리자 로그인임을 명확히 표시하는 아이콘 */}
          <div className="mb-2 flex justify-center">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">관리자 로그인</CardTitle>
          <CardDescription>관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* 에러 메시지 표시 */}
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "관리자 로그인"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
