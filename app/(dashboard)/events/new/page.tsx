"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
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

/**
 * 이벤트 생성 폼 Zod 스키마
 */
const eventSchema = z.object({
  title: z.string().min(1, "이벤트 제목을 입력해주세요"),
  date: z.string().min(1, "날짜를 선택해주세요"),
  location: z.string().min(1, "장소를 입력해주세요"),
  maxParticipants: z.string().optional(),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

/**
 * 이벤트 생성 페이지 (Client Component)
 * - react-hook-form + zod 유효성 검사
 * - 모바일 퍼스트 레이아웃
 * - 제출 시 toast 알림 후 /dashboard로 이동
 */
export default function NewEventPage() {
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      maxParticipants: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  /**
   * 폼 제출 핸들러 (Mock: 실제 구현 시 Supabase 저장으로 교체)
   */
  async function onSubmit(_values: EventFormValues) {
    // 실제 구현 시 Supabase에 이벤트 저장
    // 현재는 목업으로 성공 토스트 후 대시보드로 이동
    toast.success("이벤트가 생성되었습니다!");
    router.push("/dashboard");
  }

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

      {/* 이벤트 생성 폼 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
            name="maxParticipants"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 하단 버튼 영역 */}
          <div className="space-y-3 pt-2">
            {/* 이벤트 생성 버튼 */}
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "생성 중..." : "이벤트 생성"}
            </Button>

            {/* 취소 버튼 */}
            <Button asChild variant="outline" className="h-12 w-full">
              <Link href="/dashboard">취소</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
