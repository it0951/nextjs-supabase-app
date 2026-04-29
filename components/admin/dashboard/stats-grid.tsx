import type { ReactNode } from "react";

/**
 * 통계 카드 그리드 레이아웃 — Server Component
 *
 * 반응형 그리드: 1열(모바일) → 2열(sm) → 4열(lg)
 */
interface StatsGridProps {
  /** 그리드 내에 배치할 StatsCard 목록 */
  children: ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}
