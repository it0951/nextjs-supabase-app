import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  // 오픈 리다이렉트 방지: 슬래시로 시작하는 내부 경로만 허용
  const nextParam = searchParams.get("next");
  const hasExplicitNext =
    nextParam &&
    nextParam !== "/" &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (hasExplicitNext) {
        return NextResponse.redirect(`${origin}${nextParam}`);
      }

      // 로그인한 사용자 정보 조회
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // profiles 테이블에서 role 조회하여 리다이렉트 경로 결정
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // 관리자 → /admin/dashboard, 일반 사용자 → /dashboard
        const redirectPath =
          profile?.role === "admin" ? "/admin/dashboard" : "/dashboard";
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("oauth_failed")}`
  );
}
