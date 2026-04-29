import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  /** 사용자 역할: 'admin' | 'user' */
  role: "admin" | "user";
}

/**
 * 사용자 역할을 시각적으로 표시하는 배지 컴포넌트 (Server Component)
 * - admin: default 배지 (강조 스타일)
 * - user: secondary 배지 (보조 스타일)
 */
export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === "admin") {
    return <Badge variant="default">관리자</Badge>;
  }

  return <Badge variant="secondary">일반 사용자</Badge>;
}
