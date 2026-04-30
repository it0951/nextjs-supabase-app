"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateEventAction } from "@/lib/actions/events";
import { updateEventSchema, type UpdateEventInput } from "@/lib/schemas/event";
import type { ActionResult } from "@/lib/types";
import type { Event } from "@/types/supabase";

interface EditEventDialogProps {
  /** 수정할 이벤트 데이터 */
  event: Event;
}

const initialState: ActionResult = { success: false, error: "" };

/**
 * 이벤트 수정 다이얼로그 컴포넌트
 * - useActionState로 Server Action 상태 관리
 * - 수정 성공 시 다이얼로그 닫기 + 토스트 알림
 */
export function EditEventDialog({ event }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const prevStateRef = useRef<ActionResult | null>(null);

  // eventId를 bind한 Server Action 사용
  const boundUpdateAction = updateEventAction.bind(null, event.id);

  const [state, formAction, isPending] = useActionState(
    boundUpdateAction,
    initialState
  );

  const form = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event.title,
      date: event.date,
      location: event.location,
      max_participants: event.max_participants?.toString() ?? "",
      description: event.description ?? "",
    },
  });

  // 수정 성공/실패 처리 (상태 변화 감지 시에만 처리)
  useEffect(() => {
    if (!state || state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state.success) {
      toast.success("이벤트가 수정되었습니다.");
      // 다음 마이크로태스크에서 실행하여 cascading render 방지
      queueMicrotask(() => setOpen(false));
    } else if (state.error) {
      form.setError("root", { message: state.error });
    }
  }, [state, form]);

  // 다이얼로그 열릴 때 폼 초기값 리셋
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({
        title: event.title,
        date: event.date,
        location: event.location,
        max_participants: event.max_participants?.toString() ?? "",
        description: event.description ?? "",
      });
      form.clearErrors();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Pencil className="mr-2 h-4 w-4" />
          이벤트 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>이벤트 수정</DialogTitle>
        </DialogHeader>

        {/* 서버 오류 메시지 */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <Form {...form}>
          <form action={formAction} className="space-y-4">
            {/* 이벤트 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이벤트 제목 *</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 날짜 */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>날짜 *</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 장소 */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>장소 *</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 최대 인원 (선택) */}
            <FormField
              control={form.control}
              name="max_participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>최대 인원 (선택)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      className="h-10 w-full"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이벤트 설명 (선택) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이벤트 설명 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full resize-none"
                      rows={3}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
