import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 통계 카드 컴포넌트의 Props 타입
 */
interface StatsCardProps {
  /** 카드 제목 */
  title: string;
  /** 표시할 수치 값 */
  value: number | string;
  /** 부가 설명 텍스트 (선택) */
  description?: string;
  /** 우상단에 표시할 Lucide 아이콘 컴포넌트 */
  icon: ComponentType<{ className?: string }>;
  /** 추세 정보 (선택) */
  trend?: {
    /** 추세 수치 (양수: 증가, 음수: 감소) */
    value: number;
    /** 추세 레이블 */
    label: string;
  };
}

/**
 * 관리자 대시보드용 통계 카드 — Server Component
 *
 * 아이콘(우상단) + 숫자(크게) + 제목(작게) 레이아웃
 * 최소 터치 타겟 min-h-[120px] 보장
 */
export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  // 추세가 양수이면 증가(녹색), 음수이면 감소(빨강)
  const isTrendPositive = trend && trend.value >= 0;

  return (
    <Card className="min-h-[120px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* 카드 제목 */}
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {/* 우상단 아이콘 */}
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {/* 주요 수치 — 크게 표시 */}
        <div className="text-3xl font-bold tracking-tight">{value}</div>

        {/* 부가 설명 또는 추세 정보 */}
        {trend ? (
          <p className="mt-1 text-xs text-muted-foreground">
            <span
              className={
                isTrendPositive ? "text-emerald-600" : "text-destructive"
              }
            >
              {isTrendPositive ? "+" : ""}
              {trend.value}
            </span>{" "}
            {trend.label}
          </p>
        ) : description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
