"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createEventAction } from "@/lib/actions/events";
import { createEventSchema, type CreateEventInput } from "@/lib/schemas/event";
import type { ActionResult } from "@/lib/types";

/** 초기 상태 */
const initialState: ActionResult = { success: false, error: "" };

/**
 * 이벤트 생성 폼 Client 컴포넌트
 * - useActionState로 Server Action 상태 관리
 * - react-hook-form + zodResolver로 클라이언트 사이드 유효성 검사
 * - 서버 오류는 폼 상단에 표시
 */
export function NewEventForm() {
  const [state, formAction, isPending] = useActionState(
    createEventAction,
    initialState
  );

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      max_participants: "",
      description: "",
    },
  });

  // 서버 액션 실패 시 에러 메시지를 폼 루트에 동기화
  useEffect(() => {
    if (state && !state.success && state.error) {
      form.setError("root", { message: state.error });
    }
  }, [state, form]);

  return (
    <div className="py-4">
      {/* 상단 뒤로가기 + 타이틀 */}
      <div className="mb-6 flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
        >
          <Link href="/dashboard">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">뒤로가기</span>
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">새 이벤트 만들기</h1>
      </div>

      {/* 서버 오류 메시지 */}
      {form.formState.errors.root && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {form.formState.errors.root.message}
        </div>
      )}

      {/* 이벤트 생성 폼 */}
      <Form {...form}>
        <form action={formAction} className="space-y-5">
          {/* 이벤트 제목 */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이벤트 제목 *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="예) 2025 봄 야유회"
                    className="h-11 w-full text-base"
                  />
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
                  <Input
                    {...field}
                    type="date"
                    className="h-11 w-full text-base"
                  />
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
                  <Input
                    {...field}
                    type="text"
                    placeholder="예) 경기도 가평 자라섬 캠핑장"
                    className="h-11 w-full text-base"
                  />
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
                    placeholder="예) 20"
                    className="h-11 w-full text-base"
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
                    placeholder="이벤트에 대한 간단한 설명을 입력해주세요"
                    className="w-full resize-none text-base"
                    rows={4}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 하단 버튼 영역 */}
          <div className="space-y-3 pt-2">
            <Button type="submit" className="h-12 w-full" disabled={isPending}>
              {isPending ? "생성 중..." : "이벤트 생성"}
            </Button>
            <Button asChild variant="outline" className="h-12 w-full">
              <Link href="/dashboard">취소</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
