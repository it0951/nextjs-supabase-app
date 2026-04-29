"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSystemConfig, MOCK_ADMIN_EMAILS } from "@/lib/mock/admin-data";

// ─────────────────────────────────────────
// Zod 유효성 스키마 정의
// ─────────────────────────────────────────
const systemConfigSchema = z.object({
  /** 서비스명: 필수 입력 */
  serviceName: z.string().min(1, "서비스명을 입력하세요"),
  /** 관리자 이메일: 올바른 이메일 형식 */
  contactEmail: z.string().email("올바른 이메일을 입력하세요"),
  /** 사용자당 최대 이벤트 수: 1~100 범위 */
  maxEventsPerUser: z.number().min(1).max(100),
});

type SystemConfigFormValues = z.infer<typeof systemConfigSchema>;

/**
 * 관리자 시스템 설정 페이지 (Client Component)
 * - react-hook-form + zod 를 활용한 폼 유효성 검사
 * - Phase 1 Mock 데이터 기반 동작 (실제 저장 없음)
 */
export default function AdminSettingsPage() {
  // mockSystemConfig 값을 폼 기본값으로 사용
  const form = useForm<SystemConfigFormValues>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      serviceName: mockSystemConfig.serviceName,
      contactEmail: mockSystemConfig.contactEmail,
      maxEventsPerUser: mockSystemConfig.maxEventsPerUser,
    },
  });

  /**
   * 저장 버튼 클릭 핸들러
   * Phase 1에서는 실제 저장 없이 toast 알림만 표시
   */
  function onSubmit(_values: SystemConfigFormValues) {
    toast.success("설정이 저장되었습니다. (Phase 1 Mock)");
  }

  return (
    <div className="space-y-6 py-6">
      {/* 페이지 제목 */}
      <h1 className="text-2xl font-bold text-foreground">시스템 설정</h1>

      {/* 서비스 기본 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>서비스 기본 정보</CardTitle>
          <CardDescription>
            서비스 전반에 적용되는 기본 설정을 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* 서비스 이름 */}
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>서비스 이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="서비스 이름을 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 관리자 이메일 */}
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>관리자 이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 사용자당 최대 이벤트 수 */}
              <FormField
                control={form.control}
                name="maxEventsPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용자당 최대 이벤트 수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        // number input은 valueAsNumber로 처리
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 저장 버튼 */}
              <div className="pt-2">
                <Button type="submit" className="w-full sm:w-auto">
                  저장
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 관리자 계정 카드 (읽기 전용) */}
      <Card>
        <CardHeader>
          <CardTitle>관리자 계정</CardTitle>
          <CardDescription>현재 관리자 이메일 목록 (읽기 전용)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MOCK_ADMIN_EMAILS.map((email) => (
              <Badge key={email} variant="secondary">
                {email}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
