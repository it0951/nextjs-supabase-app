import { redirect } from "next/navigation";

// 이메일 인증이 비활성화된 상태이므로 /dashboard로 즉시 리다이렉트
export default function Page() {
  redirect("/dashboard");
}
