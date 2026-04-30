import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/events/event-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * 루트 홈 페이지 (Server Component)
 * - 로그인한 유저의 이벤트 목록을 Supabase에서 조회
 * - 인증 미처리 시 /auth/login으로 리다이렉트
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const displayName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "사용자";

  const dashboardUser = {
    name: displayName,
    email: user.email ?? "",
    avatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ?? undefined,
  };

  // Supabase에서 로그인 유저의 이벤트 목록 조회 (participants 상태 포함)
  const { data: eventsWithParticipants } = await supabase
    .from("events")
    .select("*, participants(status)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const events = eventsWithParticipants ?? [];

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="py-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">안녕하세요! 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            관리 중인 이벤트{" "}
            <span className="font-semibold text-foreground">
              {events.length}개
            </span>
          </p>
        </div>

        <Button asChild className="mb-6 h-12 w-full">
          <Link href="/events/new">+ 새 이벤트 만들기</Link>
        </Button>

        {events.length === 0 ? (
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
    </DashboardLayout>
  );
}
