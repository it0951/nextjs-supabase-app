"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, CalendarDays } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mockEvents } from "@/lib/mock/data";
import { type Event } from "@/lib/mock/types";

// 동적 라우트: useParams() 사용으로 정적 프리렌더 비활성화
export const dynamic = "force-dynamic";

/**
 * 참여 신청 폼 Zod 스키마
 */
const joinFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(10, "올바른 연락처를 입력해주세요"),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

/**
 * 비회원 이벤트 초대 페이지
 * - inviteToken으로 이벤트 정보 조회
 * - react-hook-form + zod로 참여 신청 폼 구현
 */
export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const inviteToken = params.inviteToken as string;

  // inviteToken으로 이벤트 조회 (동기 계산)
  const foundEvent = mockEvents.find((e) => e.inviteToken === inviteToken);
  const isInvalidToken = !foundEvent;
  const event: Event | null = foundEvent ?? null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 폼 제출 핸들러 (mock 처리)
  const onSubmit = async (_values: JoinFormValues) => {
    setIsSubmitting(true);
    try {
      // mock: 실제 API 호출 대신 딜레이 후 성공 처리
      await new Promise<void>((resolve) => setTimeout(resolve, 600));
      toast.success("참여 신청이 완료되었습니다!");
      router.push("/join/mock-join-token");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 유효하지 않은 토큰 처리
  if (isInvalidToken) {
    return (
      <div className="min-h-screen bg-background">
        {/* 심플 헤더 */}
        <header className="flex h-14 items-center border-b px-4">
          <div className="mx-auto flex w-full max-w-[480px] items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">모이자</span>
          </div>
        </header>

        <main className="mx-auto max-w-[480px] px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="mb-2 text-base font-semibold">
                유효하지 않은 초대 링크입니다
              </h2>
              <p className="text-sm text-muted-foreground">
                초대 링크가 만료되었거나 올바르지 않습니다.
                <br />
                주최자에게 새로운 링크를 요청해주세요.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 심플 헤더 (로고만, 탭 네비 없음) */}
      <header className="flex h-14 items-center border-b px-4">
        <div className="mx-auto flex w-full max-w-[480px] items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">모이자</span>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="mx-auto max-w-[480px] space-y-4 px-4 py-8">
        {/* 이벤트 정보 카드 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 날짜 */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm">{formatDate(event.date)}</p>
            </div>

            {/* 장소 */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm">{event.location}</p>
            </div>
          </CardContent>
        </Card>

        {/* 참여 신청 폼 카드 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">참여 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* 이름 필드 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="이름을 입력해주세요"
                          className="text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 연락처 필드 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="010-0000-0000"
                          type="tel"
                          className="text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 제출 버튼 */}
                <Button
                  type="submit"
                  className="h-12 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "신청 중..." : "참여 신청하기"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
