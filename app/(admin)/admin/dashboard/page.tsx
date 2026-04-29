import { Calendar, UserCheck, Users, Users2 } from "lucide-react";
import { mockAdminUsers } from "@/lib/mock/admin-data";
import { mockEvents, mockParticipants } from "@/lib/mock/data";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { StatsGrid } from "@/components/admin/dashboard/stats-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * 관리자 대시보드 페이지 — Server Component
 *
 * Mock 데이터 기반 통계 집계 및 최근 이벤트 목록 표시
 */
export default function AdminDashboardPage() {
  // ─── 통계 집계 ───────────────────────────────────────
  const totalUsers = mockAdminUsers.length;
  const totalEvents = mockEvents.length;
  const totalParticipants = mockParticipants.length;
  const confirmedParticipants = mockParticipants.filter(
    (p) => p.status === "confirmed"
  ).length;

  // ─── 최근 이벤트 (상위 5개, 최신순) ──────────────────
  const recentEvents = [...mockEvents]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          서비스 전체 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* 통계 카드 그리드 — 4개 */}
      <StatsGrid>
        {/* 1. 총 사용자 */}
        <StatsCard
          title="총 사용자"
          value={totalUsers}
          description="전체 등록 사용자 수"
          icon={Users}
        />

        {/* 2. 총 이벤트 */}
        <StatsCard
          title="총 이벤트"
          value={totalEvents}
          description="전체 생성 이벤트 수"
          icon={Calendar}
        />

        {/* 3. 총 참여자 */}
        <StatsCard
          title="총 참여자"
          value={totalParticipants}
          description="전체 이벤트 참여 신청자"
          icon={Users2}
        />

        {/* 4. 확정 참여자 */}
        <StatsCard
          title="확정 참여자"
          value={confirmedParticipants}
          description="참여 확정 완료된 인원"
          icon={UserCheck}
        />
      </StatsGrid>

      {/* 최근 이벤트 목록 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">최근 이벤트</h2>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              이벤트 목록 (최신 5개)
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-0">
            <ul className="space-y-0">
              {recentEvents.map((event, index) => (
                <li key={event.id}>
                  {/* 첫 번째 항목 위에는 구분선 없음 */}
                  {index > 0 && <Separator className="my-3" />}

                  <div className="min-h-[44px] py-1">
                    {/* 이벤트명 */}
                    <p className="font-medium leading-snug">{event.title}</p>

                    {/* 날짜 + 장소 */}
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                      <span>
                        {new Date(event.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {event.location && <span>{event.location}</span>}
                    </div>
                  </div>
                </li>
              ))}

              {/* 이벤트가 없을 때 */}
              {recentEvents.length === 0 && (
                <li className="py-4 text-center text-sm text-muted-foreground">
                  등록된 이벤트가 없습니다.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
