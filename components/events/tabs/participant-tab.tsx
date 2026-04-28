"use client";

import { useState } from "react";
import { MoreVertical, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { mockParticipants } from "@/lib/mock/data";
import { type Participant, type ParticipantStatus } from "@/lib/mock/types";

interface ParticipantTabProps {
  /** 이벤트 ID */
  eventId: string;
}

// 상태 레이블 맵핑
const STATUS_LABEL: Record<ParticipantStatus, string> = {
  confirmed: "확정",
  pending: "대기",
  cancelled: "취소",
};

// 상태별 Badge 색상 (variant 대신 className 직접 지정)
const STATUS_CLASS: Record<ParticipantStatus, string> = {
  confirmed: "bg-green-100 text-green-800 hover:bg-green-100",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

/**
 * 참여자 탭 컴포넌트
 * - 참여자 목록 테이블 표시
 * - 상태별 통계 요약
 * - 드롭다운으로 참여자 상태 변경
 */
export function ParticipantTab({ eventId }: ParticipantTabProps) {
  // mock data에서 해당 이벤트 참여자 초기값 설정
  const [participants, setParticipants] = useState<Participant[]>(
    mockParticipants.filter((p) => p.eventId === eventId)
  );

  // 상태 변경 핸들러
  const handleChangeStatus = (id: string, status: ParticipantStatus) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // 상태별 카운트 계산
  const confirmedCount = participants.filter(
    (p) => p.status === "confirmed"
  ).length;
  const pendingCount = participants.filter(
    (p) => p.status === "pending"
  ).length;
  const cancelledCount = participants.filter(
    (p) => p.status === "cancelled"
  ).length;

  return (
    <div className="space-y-4">
      {/* 통계 요약 */}
      <p className="text-sm text-muted-foreground">
        총 {participants.length}명 (확정 {confirmedCount} / 대기 {pendingCount}{" "}
        / 취소 {cancelledCount})
      </p>

      {/* 참여자 목록 */}
      {participants.length === 0 ? (
        <EmptyState
          icon={<Users className="h-full w-full" />}
          title="아직 참여자가 없습니다"
          description="초대 링크를 공유하여 참여자를 모집하세요."
        />
      ) : (
        /* 모바일 가로 스크롤 래퍼 */
        <div className="-mx-4 overflow-x-auto px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] min-w-[80px]">이름</TableHead>
                <TableHead className="min-w-[130px]">연락처</TableHead>
                <TableHead className="w-[64px] min-w-[64px]">상태</TableHead>
                <TableHead className="w-[48px] min-w-[48px] text-right">
                  관리
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  {/* 이름 */}
                  <TableCell className="font-medium">
                    {participant.name}
                  </TableCell>
                  {/* 연락처 */}
                  <TableCell className="text-sm text-muted-foreground">
                    {participant.phone}
                  </TableCell>
                  {/* 상태 배지 */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_CLASS[participant.status]}
                    >
                      {STATUS_LABEL[participant.status]}
                    </Badge>
                  </TableCell>
                  {/* 관리 드롭다운 */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`${participant.name} 상태 변경`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={participant.status === "confirmed"}
                          onClick={() =>
                            handleChangeStatus(participant.id, "confirmed")
                          }
                        >
                          확정으로 변경
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={participant.status === "pending"}
                          onClick={() =>
                            handleChangeStatus(participant.id, "pending")
                          }
                        >
                          대기로 변경
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={participant.status === "cancelled"}
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            handleChangeStatus(participant.id, "cancelled")
                          }
                        >
                          취소로 변경
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
