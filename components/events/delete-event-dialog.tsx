"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteEventAction } from "@/lib/actions/events";

interface DeleteEventDialogProps {
  /** 삭제할 이벤트 ID */
  eventId: string;
}

/**
 * 이벤트 삭제 확인 AlertDialog 컴포넌트
 * - 삭제 확인 후 Server Action 호출
 * - 삭제 성공 시 /dashboard로 리다이렉트
 */
export function DeleteEventDialog({ eventId }: DeleteEventDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEventAction(eventId);
      if (result && !result.success) {
        toast.error(result.error);
      }
      // 성공 시 Server Action에서 redirect('/dashboard') 처리됨
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="h-9">
          <Trash2 className="mr-2 h-4 w-4" />
          이벤트 삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>이벤트 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            이 이벤트를 삭제하시겠습니까? 모든 참여자, 공지, 카풀, 정산 데이터가
            함께 삭제되며 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
