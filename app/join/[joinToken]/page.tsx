import { Calendar, MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementTab } from "@/components/join/announcement-tab";
import { CarpoolTab } from "@/components/join/carpool-tab";
import { ExpenseTab } from "@/components/join/expense-tab";
import type { Database } from "@/types/supabase";

type ParticipantStatus = Database["public"]["Enums"]["participant_status"];

/**
 * 참여 상태에 따른 Badge 색상 반환
 */
function getStatusBadge(status: ParticipantStatus) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          참석 확정
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          대기 중
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          참석 취소
        </Badge>
      );
  }
}

/**
 * 비회원 참여자 뷰 페이지 (async Server Component)
 * - join_token으로 참여자 조회
 * - 이벤트/공지/카풀/정산 데이터를 서버에서 패칭하여 탭 컴포넌트에 props 전달
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ joinToken: string }>;
}) {
  // Next.js 16 async params 패턴
  const { joinToken } = await params;

  const supabase = await createClient();

  // join_token으로 참여자 조회 (maybeSingle: 없으면 null 반환)
  const { data: participant } = await supabase
    .from("participants")
    .select("*")
    .eq("join_token", joinToken)
    .maybeSingle();

  // 참여자 없으면 에러 UI 반환
  if (!participant) {
    return (
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-full max-w-[480px] items-center gap-2 px-4">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">모이자</span>
          </div>
        </header>

        <main className="mx-auto max-w-[480px] px-4 pb-8 pt-14">
          <Card className="mt-4">
            <CardContent className="py-8 text-center">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="mb-2 text-base font-semibold">
                참여 정보를 찾을 수 없습니다
              </h2>
              <p className="text-sm text-muted-foreground">
                링크가 만료되었거나 올바르지 않습니다.
                <br />
                주최자에게 문의해주세요.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const eventId = participant.event_id;

  // 이벤트 조회 (maybeSingle: 없으면 null 반환)
  const { data: event } = await supabase
    .from("events")
    .select("id, title, date, location")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-full max-w-[480px] items-center gap-2 px-4">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">모이자</span>
          </div>
        </header>

        <main className="mx-auto max-w-[480px] px-4 pb-8 pt-14">
          <Card className="mt-4">
            <CardContent className="py-8 text-center">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="mb-2 text-base font-semibold">
                이벤트 정보를 찾을 수 없습니다
              </h2>
              <p className="text-sm text-muted-foreground">
                주최자에게 문의해주세요.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // 공지사항 조회 (최신순)
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  // 카풀 그룹 + 배정 조회
  const { data: carpoolGroups } = await supabase
    .from("carpool_groups")
    .select("*, carpool_assignments(*)")
    .eq("event_id", eventId);

  // 이벤트 내 모든 참여자 조회 (카풀 이름 표시용)
  const { data: allParticipants } = await supabase
    .from("participants")
    .select("id, name")
    .eq("event_id", eventId);

  // 참여자 이름 매핑 생성
  const participantNameMap: Record<string, string> = {};
  (allParticipants ?? []).forEach((p) => {
    participantNameMap[p.id] = p.name;
  });

  // 정산 항목 조회
  const { data: expenseItems } = await supabase
    .from("expense_items")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  // 본인 정산 분배 조회
  const expenseItemIds = (expenseItems ?? []).map((item) => item.id);
  const { data: mySplits } =
    expenseItemIds.length > 0
      ? await supabase
          .from("expense_splits")
          .select("*")
          .eq("participant_id", participant.id)
          .in("item_id", expenseItemIds)
      : { data: [] };

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      {/* 고정 상단 헤더: 로고 + 이벤트명 */}
      <header className="fixed top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[480px] items-center gap-2 px-4">
          <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
          <p className="truncate text-sm font-semibold">{event.title}</p>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="mx-auto max-w-[480px] px-4 pb-8 pt-14">
        <div className="mt-4 space-y-4">
          {/* 이벤트 정보 요약 카드 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* 날짜 */}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm">{formatDate(event.date)}</p>
              </div>

              {/* 장소 */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm">{event.location}</p>
              </div>
            </CardContent>
          </Card>

          {/* 참여자 정보 헤더 */}
          <div className="flex items-center justify-between rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold">
              {participant.name}님의 참여 정보
            </p>
            {getStatusBadge(participant.status)}
          </div>

          {/* 탭 구조 */}
          <Tabs defaultValue="announcements">
            {/* 탭 바 (좌우 스크롤 가능) */}
            <div className="-mx-4 overflow-x-auto px-4">
              <TabsList className="w-full min-w-max">
                <TabsTrigger value="announcements" className="flex-1">
                  공지
                </TabsTrigger>
                <TabsTrigger value="carpool" className="flex-1">
                  카풀
                </TabsTrigger>
                <TabsTrigger value="expense" className="flex-1">
                  정산
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 공지 탭 */}
            <TabsContent value="announcements" className="mt-4">
              <AnnouncementTab initialAnnouncements={announcements ?? []} />
            </TabsContent>

            {/* 카풀 탭 */}
            <TabsContent value="carpool" className="mt-4">
              <CarpoolTab
                carpoolGroups={carpoolGroups ?? []}
                myParticipantId={participant.id}
                participantNameMap={participantNameMap}
              />
            </TabsContent>

            {/* 정산 탭 */}
            <TabsContent value="expense" className="mt-4">
              <ExpenseTab
                expenseItems={expenseItems ?? []}
                mySplits={mySplits ?? []}
                joinToken={joinToken}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
