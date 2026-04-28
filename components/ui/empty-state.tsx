import { type ReactNode } from "react";

interface EmptyStateProps {
  /** 빈 상태 아이콘 */
  icon: ReactNode;
  /** 제목 */
  title: string;
  /** 설명 (선택) */
  description?: string;
  /** 액션 버튼 (선택) */
  action?: ReactNode;
}

/**
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      {/* 아이콘 */}
      <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">{icon}</div>

      {/* 제목 */}
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>

      {/* 설명 */}
      {description && (
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      )}

      {/* 액션 버튼 */}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
