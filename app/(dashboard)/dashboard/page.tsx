import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/events/event-card";
import { createClient } from "@/lib/supabase/server";

/**
 * 대시보드 메인 페이지 (Server Component)
 * - Supabase에서 로그인한 유저의 이벤트 목록을 조회
 * - 각 이벤트의 confirmed 참여자 수 집계 포함
 * - 이벤트 없을 때 EmptyState 표시
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // 현재 로그인한 유저 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/auth/login");
  }

  // 로그인한 유저의 이벤트 목록 조회 (participants 상태 포함)
  const { data: eventsWithParticipants } = await supabase
    .from("events")
    .select("*, participants(status)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const events = eventsWithParticipants ?? [];

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
          {events.map((event) => {
            // confirmed 상태인 참여자 수 계산
            const participantCount = event.participants.filter(
              (p: { status: string }) => p.status === "confirmed"
            ).length;

            return (
              <EventCard
                key={event.id}
                event={event}
                participantCount={participantCount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
