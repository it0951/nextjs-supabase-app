"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { registerParticipantAction } from "@/lib/actions/participants";
import {
  registerParticipantSchema,
  type RegisterParticipantInput,
} from "@/lib/schemas/participant";
import type { ActionResult } from "@/lib/types";

const initialState: ActionResult<{ joinToken: string }> = {
  success: false,
  error: "",
};

interface JoinFormProps {
  /** 참여할 이벤트 ID */
  eventId: string;
}

/**
 * 참여 신청 폼 Client Component
 * - useActionState + registerParticipantAction 사용
 * - 성공 시 /join/[joinToken]으로 이동
 */
export function JoinForm({ eventId }: JoinFormProps) {
  const router = useRouter();

  // registerParticipantAction을 eventId에 바인딩한 액션
  const boundAction = registerParticipantAction.bind(null, eventId);

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );

  const form = useForm<RegisterParticipantInput>({
    resolver: zodResolver(registerParticipantSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // 서버 응답 처리
  useEffect(() => {
    if (state.success && state.data?.joinToken) {
      toast.success("참여 신청이 완료되었습니다!");
      router.push(`/join/${state.data.joinToken}`);
    } else if (!state.success && state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">참여 신청</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
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

            {/* 서버 에러 메시지 */}
            {!state.success && state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            {/* 제출 버튼 */}
            <Button type="submit" className="h-12 w-full" disabled={isPending}>
              {isPending ? "신청 중..." : "참여 신청하기"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
