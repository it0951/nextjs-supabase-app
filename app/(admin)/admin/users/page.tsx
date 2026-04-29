import { mockAdminUsers } from "@/lib/mock/admin-data";
import { UsersTable } from "@/components/admin/users/users-table";

/**
 * 관리자 사용자 관리 페이지 (Server Component)
 * URL: /admin/users
 * - 전체 사용자 목록을 테이블로 표시
 * - 역할 변경 기능은 Phase 2에서 구현 예정
 */
export default function AdminUsersPage() {
  return (
    <div className="py-6">
      {/* 페이지 헤더: 제목 + 총 사용자 수 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총{" "}
            <span className="font-semibold text-foreground">
              {mockAdminUsers.length}
            </span>
            명의 사용자가 등록되어 있습니다.
          </p>
        </div>
      </div>

      {/* 사용자 목록 테이블 */}
      <div className="rounded-lg border bg-card">
        <UsersTable users={mockAdminUsers} />
      </div>
    </div>
  );
}
