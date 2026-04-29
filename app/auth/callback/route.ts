import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAILS = ["cheonsik.park@gsitm.com"];

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

      // 어드민 여부에 따라 리다이렉트 경로 결정
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role as string | undefined;
      const isAdmin =
        role === "admin" || ADMIN_EMAILS.includes(user?.email ?? "");
      return NextResponse.redirect(`${origin}${isAdmin ? "/admin" : "/"}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("oauth_failed")}`
  );
}
