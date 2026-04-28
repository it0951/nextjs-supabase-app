import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/events/event-card";
import { mockEvents, mockParticipants } from "@/lib/mock/data";

/**
 * 특정 이벤트의 confirmed 참여자 수를 계산하는 헬퍼 함수
 */
function getConfirmedParticipantCount(eventId: string): number {
  return mockParticipants.filter(
    (p) => p.eventId === eventId && p.status === "confirmed"
  ).length;
}

/**
 * 대시보드 메인 페이지 (Server Component)
 * - mock 데이터에서 이벤트 목록을 가져와 EventCard 리스트로 표시
 * - 이벤트 없을 때 EmptyState 표시
 */
export default async function DashboardPage() {
  // mock 데이터에서 이벤트 목록 조회 (실제 구현 시 Supabase 쿼리로 교체)
  const events = mockEvents;

  return (
    <div className="py-4">
      {/* 환영 섹션 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">안녕하세요! 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          관리 중인 이벤트{" "}
          <span className="font-semibold text-foreground">
            {events.length}개
          </span>
        </p>
      </div>

      {/* 새 이벤트 만들기 버튼 */}
      <Button asChild className="mb-6 h-12 w-full">
        <Link href="/events/new">+ 새 이벤트 만들기</Link>
      </Button>

      {/* 이벤트 목록 */}
      {events.length === 0 ? (
        /* 이벤트 없을 때 빈 상태 */
        <EmptyState
          icon={<Calendar className="h-full w-full" />}
          title="아직 이벤트가 없습니다"
          description="첫 번째 소모임 이벤트를 만들어 보세요!"
          action={
            <Button asChild>
              <Link href="/events/new">새 이벤트 만들기</Link>
            </Button>
          }
        />
      ) : (
        /* 이벤트 카드 목록 */
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              participantCount={getConfirmedParticipantCount(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
