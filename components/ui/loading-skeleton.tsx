import { Skeleton } from "@/components/ui/skeleton";

/**
 * 카드 형태의 로딩 스켈레톤
 */
export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      {/* 카드 헤더 */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>

      {/* 카드 푸터 */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

interface CardSkeletonListProps {
  /** 스켈레톤 카드 개수 (기본값: 3) */
  count?: number;
}

/**
 * 카드 목록 로딩 스켈레톤
 */
export function CardSkeletonList({ count = 3 }: CardSkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * 테이블 형태의 로딩 스켈레톤
 */
export function TableSkeleton() {
  return (
    <div className="space-y-2">
      {/* 테이블 헤더 */}
      <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* 테이블 행 */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-md border px-3 py-3"
        >
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
