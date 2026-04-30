import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementTab } from "@/components/events/tabs/announcement-tab";
import { ParticipantTab } from "@/components/events/tabs/participant-tab";
import { CarpoolTab } from "@/components/events/tabs/carpool-tab";
import { ExpenseTab } from "@/components/events/tabs/expense-tab";
import { EditEventDialog } from "@/components/events/edit-event-dialog";
import { DeleteEventDialog } from "@/components/events/delete-event-dialog";
import { InviteLinkCard } from "@/components/events/invite-link-card";

/**
 * 이벤트 상세 페이지 (Server Component)
 * - Next.js 16 async params 패턴 사용
 * - Supabase에서 이벤트 데이터 조회 + owner_id 검증
 * - 5개 탭: 개요, 공지, 참여자, 카풀, 정산
 */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const supabase = await createClient();

  // 현재 로그인한 유저 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 이벤트 조회 (owner_id 기반 RLS 적용됨)
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    notFound();
  }

  // 공지사항 목록 조회 (최신순)
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  // 참여자 목록 조회
  const { data: participants } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  // 초대 링크 서버에서 구성
  // NEXT_PUBLIC_SITE_URL 환경변수 우선, 없으면 request host 헤더 사용
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    baseUrl = `${protocol}://${host}`;
  }
  const inviteUrl = `${baseUrl}/invite/${event.invite_token}`;

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 헤더: 뒤로가기 + 이벤트 제목 */}
      <header className="fixed top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[480px] items-center gap-2 px-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            aria-label="뒤로가기"
          >
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="truncate text-base font-semibold">{event.title}</h1>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="mx-auto max-w-[480px] px-4 pb-20 pt-14">
        {/* 탭 영역 */}
        <Tabs defaultValue="overview" className="mt-4">
          {/* 탭 바 (좌우 스크롤 가능) */}
          <div className="-mx-4 overflow-x-auto px-4">
            <TabsList className="w-full min-w-max">
              <TabsTrigger value="overview" className="flex-1">
                개요
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex-1">
                공지
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">
                참여자
              </TabsTrigger>
              <TabsTrigger value="carpool" className="flex-1">
                카풀
              </TabsTrigger>
              <TabsTrigger value="expense" className="flex-1">
                정산
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* 이벤트 정보 카드 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">이벤트 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 날짜 */}
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">날짜</p>
                    <p className="text-sm font-medium">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                {/* 장소 */}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">장소</p>
                    <p className="text-sm font-medium">{event.location}</p>
                  </div>
                </div>

                {/* 최대 인원 (선택 필드) */}
                {event.max_participants !== null && (
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">최대 인원</p>
                      <p className="text-sm font-medium">
                        {event.max_participants}명
                      </p>
                    </div>
                  </div>
                )}

                {/* 설명 (선택 필드) */}
                {event.description && (
                  <div className="border-t pt-3">
                    <p className="mb-1 text-xs text-muted-foreground">설명</p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {event.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 초대 링크 카드 (Client Component) */}
            <InviteLinkCard inviteUrl={inviteUrl} />

            {/* 이벤트 관리 버튼 영역 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <LinkIcon className="h-4 w-4" />
                  이벤트 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                {/* 수정 다이얼로그 */}
                <EditEventDialog event={event} />
                {/* 삭제 다이얼로그 */}
                <DeleteEventDialog eventId={event.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 공지 탭 */}
          <TabsContent value="announcements" className="mt-4">
            <AnnouncementTab
              eventId={eventId}
              initialAnnouncements={announcements ?? []}
            />
          </TabsContent>

          {/* 참여자 탭 */}
          <TabsContent value="participants" className="mt-4">
            <ParticipantTab
              eventId={eventId}
              initialParticipants={participants ?? []}
            />
          </TabsContent>

          {/* 카풀 탭 */}
          <TabsContent value="carpool" className="mt-4">
            <CarpoolTab eventId={eventId} />
          </TabsContent>

          {/* 정산 탭 */}
          <TabsContent value="expense" className="mt-4">
            <ExpenseTab eventId={eventId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
