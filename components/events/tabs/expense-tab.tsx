"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import {
  createExpenseItemAction,
  deleteExpenseItemAction,
} from "@/lib/actions/expenses";
import { toggleExpenseSplitPaidAction } from "@/lib/actions/expense-splits";
import type { Tables } from "@/types/supabase";

// ─────────────────────────────────────────
// DB 타입 정의
// ─────────────────────────────────────────
type ExpenseItem = Tables<"expense_items">;
type ExpenseSplit = Tables<"expense_splits">;

// ─────────────────────────────────────────
// 정산 항목 추가 폼 스키마
// ─────────────────────────────────────────
const addExpenseSchema = z.object({
  title: z.string().min(1, "항목명을 입력해주세요."),
  amount: z
    .string()
    .min(1, "금액을 입력해주세요.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1,
      "금액은 1원 이상이어야 합니다."
    )
    .refine((v) => Number.isInteger(Number(v)), "금액은 정수로 입력해주세요."),
});

type AddExpenseFormValues = z.infer<typeof addExpenseSchema>;

interface ExpenseTabProps {
  /** 이벤트 ID */
  eventId: string;
  /** 서버에서 조회한 정산 항목 목록 */
  initialExpenseItems: ExpenseItem[];
  /** 서버에서 조회한 정산 분배 목록 */
  initialExpenseSplits: ExpenseSplit[];
  /** 확정 참여자 수 */
  confirmedCount: number;
  /** 참여자 ID → 이름 매핑 (납부 목록 이름 표시용) */
  participantNameMap?: Record<string, string>;
}

/**
 * 금액 포맷 헬퍼 (쉼표 구분)
 */
function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/**
 * 정산 탭 컴포넌트 (Supabase 연동)
 * - 전체 정산 현황 요약 카드
 * - 정산 항목 카드 목록 (납부 여부 체크박스)
 * - 항목 추가 다이얼로그 (react-hook-form + zod)
 */
export function ExpenseTab({
  eventId,
  initialExpenseItems,
  initialExpenseSplits,
  confirmedCount,
  participantNameMap = {},
}: ExpenseTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 항목 추가 다이얼로그 상태
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 항목 추가 폼
  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: { title: "", amount: "" },
  });

  // 특정 정산 항목의 분배 목록 조회
  const getSplitsForItem = (itemId: string): ExpenseSplit[] => {
    return initialExpenseSplits.filter((s) => s.item_id === itemId);
  };

  // 납부 여부 토글 핸들러 (주최자용)
  const handleTogglePaid = async (split: ExpenseSplit) => {
    const result = await toggleExpenseSplitPaidAction(
      split.id,
      eventId,
      !split.is_paid
    );
    if (result.success) {
      startTransition(() => router.refresh());
    } else {
      toast.error(result.error);
    }
  };

  // 항목 삭제 핸들러
  const handleDeleteItem = async (itemId: string) => {
    const result = await deleteExpenseItemAction(itemId, eventId);
    if (result.success) {
      toast.success("정산 항목이 삭제되었습니다.");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.error);
    }
  };

  // 전체 현황 요약 계산
  const totalAmount = initialExpenseItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const paidAmount = initialExpenseSplits
    .filter((s) => s.is_paid)
    .reduce((sum, s) => sum + s.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;

  // 항목 추가 제출 핸들러
  const handleAddExpense = async (values: AddExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("amount", values.amount);

      const result = await createExpenseItemAction(
        eventId,
        { success: false, error: "" },
        formData
      );

      if (result.success) {
        toast.success("정산 항목이 추가되었습니다.");
        setIsAddDialogOpen(false);
        form.reset();
        startTransition(() => router.refresh());
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 전체 현황 요약 카드 */}
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">정산 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* 전체 총액 */}
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">전체 총액</p>
              <p className="text-sm font-bold">{formatKRW(totalAmount)}원</p>
            </div>
            {/* 납부 완료 */}
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">납부 완료</p>
              <p className="text-sm font-bold text-green-600">
                {formatKRW(paidAmount)}원
              </p>
            </div>
            {/* 미납부 */}
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">미납부</p>
              <p className="text-sm font-bold text-red-500">
                {formatKRW(unpaidAmount)}원
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탭 상단: 통계 + 항목 추가 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {initialExpenseItems.length}개 항목
        </p>
        <Button
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          disabled={isPending}
        >
          항목 추가
        </Button>
      </div>

      {/* 정산 항목 목록 */}
      {initialExpenseItems.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-full w-full" />}
          title="아직 정산 항목이 없습니다"
          description="항목 추가 버튼을 눌러 정산 항목을 등록하세요."
        />
      ) : (
        <div className="space-y-3">
          {initialExpenseItems.map((item) => {
            const splits = getSplitsForItem(item.id);
            // 1인당 균등 분담금
            const perPersonAmount =
              confirmedCount > 0 ? Math.ceil(item.amount / confirmedCount) : 0;
            // 납부/미납부 수 계산
            const paidCount = splits.filter((s) => s.is_paid).length;
            const totalSplitCount = splits.length;

            return (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-start gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatKRW(item.amount)}원
                        </p>
                        {confirmedCount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            1인 {formatKRW(perPersonAmount)}원
                          </p>
                        )}
                      </div>
                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isPending}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                  {/* 납부 현황 배지 */}
                  {totalSplitCount > 0 && (
                    <Badge variant="outline" className="w-fit text-xs">
                      납부 {paidCount}/{totalSplitCount}명
                    </Badge>
                  )}
                </CardHeader>

                {/* 참여자별 납부 여부 체크박스 */}
                {splits.length > 0 && (
                  <CardContent className="pt-0">
                    <Separator className="mb-3" />
                    <div className="space-y-2">
                      {splits.map((split) => (
                        <div
                          key={split.id}
                          className="flex min-h-[44px] items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`split-${split.id}`}
                              checked={split.is_paid}
                              onCheckedChange={() => handleTogglePaid(split)}
                            />
                            <label
                              htmlFor={`split-${split.id}`}
                              className="cursor-pointer text-sm"
                            >
                              {participantNameMap[split.participant_id] ??
                                split.participant_id}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {formatKRW(split.amount)}원
                            </span>
                            {split.is_paid ? (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-xs text-green-800 hover:bg-green-100"
                              >
                                납부
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-red-100 text-xs text-red-800 hover:bg-red-100"
                              >
                                미납
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* 항목 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>정산 항목 추가</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddExpense)}
              className="space-y-4"
            >
              {/* 항목명 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>항목명</FormLabel>
                    <FormControl>
                      <Input placeholder="예) 식사비, 입장료" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 금액 */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>총 금액 (원)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 분담 예상 안내 */}
              {confirmedCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  확정 참여자 {confirmedCount}명에게 균등 분배됩니다.
                </p>
              )}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    form.reset();
                  }}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "추가 중..." : "추가"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
