"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteEventDialog } from "@/components/admin/events/delete-event-dialog";

/** 관리자 이벤트 목록 아이템 타입 */
export interface AdminEventItem {
  /** 이벤트 고유 ID */
  id: string;
  /** 이벤트 제목 */
  title: string;
  /** 이벤트 날짜 (ISO 문자열) */
  date: string;
  /** 이벤트 장소 */
  location: string;
  /** 주최자 이름 */
  organizerName: string;
  /** 참여자 수 */
  participantCount: number;
}

interface AdminEventsTableProps {
  /** 관리자 이벤트 목록 */
  events: AdminEventItem[];
}

/**
 * 관리자 이벤트 목록 테이블
 * - 이벤트명 / 날짜 / 장소 / 참여자 수 / 주최자 / 액션(삭제) 컬럼
 * - 모바일 가로 스크롤 지원
 * - 삭제 버튼 클릭 시 삭제 확인 다이얼로그 표시
 */
export function AdminEventsTable({ events }: AdminEventsTableProps) {
  /** 삭제 대상 이벤트 상태 (null이면 다이얼로그 미표시) */
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  /**
   * 삭제 버튼 클릭 핸들러
   * 삭제 대상 이벤트 정보를 state에 저장하여 다이얼로그 열기
   */
  function handleDeleteClick(event: AdminEventItem) {
    setDeleteTarget({ id: event.id, title: event.title });
  }

  /**
   * 삭제 확인 핸들러 (Phase 1: Mock — 실제 삭제 없이 토스트만 표시)
   * Phase 2에서 실제 API 호출로 교체 예정
   */
  function handleDeleteConfirm() {
    // Phase 1: Mock 데이터이므로 실제 삭제 처리 없음
    // Phase 2에서 서버 액션 호출로 교체 예정
    setDeleteTarget(null);
  }

  return (
    <>
      {/* 모바일 가로 스크롤 래퍼 */}
      <div className="-mx-4 overflow-x-auto px-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px]">이벤트명</TableHead>
              <TableHead className="min-w-[120px]">날짜</TableHead>
              <TableHead className="min-w-[180px]">장소</TableHead>
              <TableHead className="min-w-[80px] text-right">
                참여자수
              </TableHead>
              <TableHead className="min-w-[100px]">주최자</TableHead>
              <TableHead className="min-w-[80px] text-center">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              /* 이벤트가 없을 때 빈 상태 표시 */
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  등록된 이벤트가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  {/* 이벤트명 */}
                  <TableCell className="font-medium">{event.title}</TableCell>

                  {/* 날짜 — ko-KR 로케일로 포맷 */}
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("ko-KR")}
                  </TableCell>

                  {/* 장소 */}
                  <TableCell className="text-sm text-muted-foreground">
                    {event.location}
                  </TableCell>

                  {/* 참여자 수 */}
                  <TableCell className="text-right text-sm">
                    {event.participantCount}명
                  </TableCell>

                  {/* 주최자 */}
                  <TableCell className="text-sm">
                    {event.organizerName}
                  </TableCell>

                  {/* 삭제 액션 버튼 */}
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteClick(event)}
                      aria-label={`${event.title} 이벤트 삭제`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <DeleteEventDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        eventTitle={deleteTarget?.title ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
