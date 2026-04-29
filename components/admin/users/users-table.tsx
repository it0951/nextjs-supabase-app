"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleBadge } from "@/components/admin/users/role-badge";
import type { AdminUser } from "@/lib/mock/admin-data";

interface UsersTableProps {
  /** 표시할 관리자 사용자 목록 */
  users: AdminUser[];
}

/**
 * 관리자 사용자 목록 테이블 컴포넌트 (Client Component)
 * - 컬럼: 이름 | 이메일 | 역할 | 가입일 | 이벤트 수 | 액션
 * - 모바일 가로 스크롤 지원
 * - 역할 변경은 Phase 2에서 구현 예정
 */
export function UsersTable({ users }: UsersTableProps) {
  /**
   * 역할 변경 버튼 클릭 핸들러
   * Phase 2에서 실제 역할 변경 기능으로 교체 예정
   */
  function handleRoleChange(userId: string) {
    // 사용하지 않는 변수 경고 방지용 참조
    void userId;
    toast("Phase 2에서 구현 예정입니다.");
  }

  return (
    /* 모바일 가로 스크롤: 좌우 패딩 보정으로 전체 너비 활용 */
    <div className="-mx-4 overflow-x-auto px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>가입일</TableHead>
            <TableHead className="text-center">이벤트 수</TableHead>
            <TableHead className="text-center">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            /* 터치 타겟 최소 높이 44px 확보 */
            <TableRow key={user.id} className="h-[44px]">
              {/* 이름 */}
              <TableCell className="font-medium">{user.name}</TableCell>

              {/* 이메일 */}
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>

              {/* 역할 배지 */}
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>

              {/* 가입일: 한국어 형식으로 표시 */}
              <TableCell className="text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("ko-KR")}
              </TableCell>

              {/* 이벤트 수 */}
              <TableCell className="text-center">{user.eventCount}</TableCell>

              {/* 역할 변경 액션 버튼 */}
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRoleChange(user.id)}
                >
                  역할 변경
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
