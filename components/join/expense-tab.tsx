import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockExpenseItems, mockExpenseSplits } from "@/lib/mock/data";

interface ExpenseTabProps {
  participantId: string;
  eventId: string;
}

/**
 * 금액을 한국 원화 형식으로 포맷합니다.
 */
function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

/**
 * 정산 탭 - 읽기 전용
 * 해당 참여자의 정산 부담 요약 및 항목별 납부 현황을 표시합니다.
 */
export function ExpenseTab({ participantId, eventId }: ExpenseTabProps) {
  // 해당 이벤트의 정산 항목 조회
  const eventExpenseItems = mockExpenseItems.filter(
    (item) => item.eventId === eventId
  );

  // 해당 참여자의 정산 분배 조회 (이벤트 항목에 해당하는 것만)
  const eventItemIds = new Set(eventExpenseItems.map((item) => item.id));
  const mySplits = mockExpenseSplits.filter(
    (split) =>
      split.participantId === participantId &&
      eventItemIds.has(split.expenseItemId)
  );

  // 빈 상태 처리
  if (mySplits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Receipt className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          아직 정산 항목이 없습니다
        </p>
      </div>
    );
  }

  // 부담액 합계 계산
  const totalAmount = mySplits.reduce((sum, split) => sum + split.amount, 0);
  const paidAmount = mySplits
    .filter((split) => split.isPaid)
    .reduce((sum, split) => sum + split.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-4">
      {/* 본인 부담 요약 카드 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">내 정산 요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 총 부담액 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">총 부담액</span>
            <span className="text-sm font-semibold">
              {formatKRW(totalAmount)}
            </span>
          </div>

          <Separator />

          {/* 납부 완료 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">납부 완료</span>
            <span className="text-sm font-medium text-green-600">
              {formatKRW(paidAmount)}
            </span>
          </div>

          {/* 미납 금액 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">미납 금액</span>
            <span
              className={`text-sm font-medium ${
                unpaidAmount > 0 ? "text-yellow-600" : "text-muted-foreground"
              }`}
            >
              {formatKRW(unpaidAmount)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 항목별 정산 목록 */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">항목별 내역</p>
        {mySplits.map((split) => {
          // 해당 정산 항목 정보 조회
          const expenseItem = eventExpenseItems.find(
            (item) => item.id === split.expenseItemId
          );

          if (!expenseItem) return null;

          return (
            <Card key={split.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {expenseItem.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    분담금 {formatKRW(split.amount)}
                  </p>
                </div>
                {split.isPaid ? (
                  <Badge className="ml-3 shrink-0 bg-green-100 text-green-700 hover:bg-green-100">
                    납부 완료
                  </Badge>
                ) : (
                  <Badge className="ml-3 shrink-0 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                    미납부
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
