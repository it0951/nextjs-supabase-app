"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteEventDialogProps {
  /** 다이얼로그 열림 상태 */
  open: boolean;
  /** 다이얼로그 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** 삭제 대상 이벤트 제목 */
  eventTitle: string;
  /** 삭제 확인 핸들러 */
  onConfirm: () => void;
}

/**
 * 이벤트 삭제 확인 다이얼로그
 * - AlertDialog를 사용하여 실수 삭제 방지
 * - 삭제 확인 시 토스트 알림 후 다이얼로그 닫기
 */
export function DeleteEventDialog({
  open,
  onOpenChange,
  eventTitle,
  onConfirm,
}: DeleteEventDialogProps) {
  /**
   * 삭제 확인 버튼 클릭 핸들러
   * onConfirm 콜백 호출 → 토스트 알림 → 다이얼로그 닫기
   */
  function handleConfirm() {
    onConfirm();
    toast.success("이벤트가 삭제되었습니다. (Phase 1 Mock)");
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이벤트 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-foreground">
              &ldquo;{eventTitle}&rdquo;
            </span>{" "}
            이벤트를 정말 삭제하시겠습니까?
            <br />
            삭제된 이벤트는 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* 취소 버튼 */}
          <AlertDialogCancel>취소</AlertDialogCancel>
          {/* 삭제 확인 버튼 — destructive 스타일 적용 */}
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
