"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
  mockExpenseItems,
  mockExpenseSplits,
  mockParticipants,
} from "@/lib/mock/data";
import { type ExpenseItem, type ExpenseSplit } from "@/lib/mock/types";

// ─────────────────────────────────────────
// 정산 항목 추가 폼 스키마 (zod v4)
// ─────────────────────────────────────────
// 폼 값은 string으로 받아서 제출 시 수동 변환
const addExpenseSchema = z.object({
  name: z.string().min(1, "항목명을 입력해주세요."),
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
}

/**
 * 금액 포맷 헬퍼 (쉼표 구분)
 */
function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/**
 * 정산 탭 컴포넌트
 * - 전체 정산 현황 요약 카드
 * - 정산 항목 카드 목록 (납부 여부 체크박스)
 * - 항목 추가 다이얼로그 (react-hook-form + zod)
 */
export function ExpenseTab({ eventId }: ExpenseTabProps) {
  // 해당 이벤트의 확정된 참여자 목록
  const confirmedParticipants = mockParticipants.filter(
    (p) => p.eventId === eventId && p.status === "confirmed"
  );
  const confirmedCount = confirmedParticipants.length;

  // 정산 항목 로컬 상태
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>(
    mockExpenseItems.filter((item) => item.eventId === eventId)
  );

  // 정산 분배(납부 여부) 로컬 상태
  const [expenseSplits, setExpenseSplits] = useState<ExpenseSplit[]>(
    mockExpenseSplits.filter((split) =>
      mockExpenseItems
        .filter((item) => item.eventId === eventId)
        .map((item) => item.id)
        .includes(split.expenseItemId)
    )
  );

  // 항목 추가 다이얼로그 상태
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 항목 추가 폼
  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: { name: "", amount: "" },
  });

  // 특정 정산 항목의 분배 목록 조회
  const getSplitsForItem = (itemId: string): ExpenseSplit[] => {
    return expenseSplits.filter((s) => s.expenseItemId === itemId);
  };

  // 참여자 이름 조회 헬퍼
  const getParticipantName = (participantId: string): string => {
    return (
      confirmedParticipants.find((p) => p.id === participantId)?.name ??
      "알 수 없음"
    );
  };

  // 납부 여부 토글 핸들러
  const handleTogglePaid = (splitId: string, checked: boolean) => {
    setExpenseSplits((prev) =>
      prev.map((s) => (s.id === splitId ? { ...s, isPaid: checked } : s))
    );
  };

  // 전체 현황 요약 계산
  const totalAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = expenseSplits
    .filter((s) => s.isPaid)
    .reduce((sum, s) => sum + s.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;

  // 항목 추가 제출 핸들러
  const handleAddExpense = (values: AddExpenseFormValues) => {
    // amount는 string으로 받으므로 숫자로 변환
    const amountNumber = Number(values.amount);
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      eventId,
      name: values.name,
      amount: amountNumber,
    };
    setExpenseItems((prev) => [...prev, newItem]);

    // 확정 참여자들에 대한 ExpenseSplit 자동 생성
    if (confirmedCount > 0) {
      const splitAmount = Math.ceil(amountNumber / confirmedCount);
      const newSplits: ExpenseSplit[] = confirmedParticipants.map((p) => ({
        id: crypto.randomUUID(),
        expenseItemId: newItem.id,
        participantId: p.id,
        amount: splitAmount,
        isPaid: false,
      }));
      setExpenseSplits((prev) => [...prev, ...newSplits]);
    }

    toast.success("정산 항목이 추가되었습니다.");
    setIsAddDialogOpen(false);
    form.reset();
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
          총 {expenseItems.length}개 항목
        </p>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          항목 추가
        </Button>
      </div>

      {/* 정산 항목 목록 */}
      {expenseItems.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-full w-full" />}
          title="아직 정산 항목이 없습니다"
          description="항목 추가 버튼을 눌러 정산 항목을 등록하세요."
        />
      ) : (
        <div className="space-y-3">
          {expenseItems.map((item) => {
            const splits = getSplitsForItem(item.id);
            // 1인당 균등 분담금
            const perPersonAmount =
              confirmedCount > 0 ? Math.ceil(item.amount / confirmedCount) : 0;
            // 납부/미납부 수 계산
            const paidCount = splits.filter((s) => s.isPaid).length;
            const totalSplitCount = splits.length;

            return (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">
                      {item.name}
                    </CardTitle>
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
                              checked={split.isPaid}
                              onCheckedChange={(checked) =>
                                handleTogglePaid(split.id, checked === true)
                              }
                            />
                            <label
                              htmlFor={`split-${split.id}`}
                              className="cursor-pointer text-sm"
                            >
                              {getParticipantName(split.participantId)}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {formatKRW(split.amount)}원
                            </span>
                            {split.isPaid ? (
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
                name="name"
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
                <Button type="submit">추가</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
