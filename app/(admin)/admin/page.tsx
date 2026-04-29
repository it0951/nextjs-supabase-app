import { redirect } from "next/navigation";

/**
 * /admin 경로 접근 시 /admin/dashboard로 즉시 리다이렉트
 */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
