import { Calendar, MapPin, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { JoinForm } from "@/components/invite/join-form";

/**
 * 비회원 이벤트 초대 페이지 (async Server Component)
 * - invite_token으로 이벤트 조회 및 유효성 검증
 * - JoinForm Client Component에 eventId를 props로 전달
 */
export default async function InvitePage({
  params,
}: {
  params: Promise<{ inviteToken: string }>;
}) {
  // Next.js 16 async params 패턴
  const { inviteToken } = await params;

  const supabase = await createClient();

  // invite_token으로 이벤트 조회 (RLS: anon/authenticated 모두 허용)
  // maybeSingle(): 결과 없을 때 406 대신 null 반환
  const { data: event } = await supabase
    .from("events")
    .select("id, title, date, location, description, max_participants")
    .eq("invite_token", inviteToken)
    .maybeSingle();

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 유효하지 않은 토큰 처리
  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        {/* 심플 헤더 */}
        <header className="flex h-14 items-center border-b px-4">
          <div className="mx-auto flex w-full max-w-[480px] items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">모이자</span>
          </div>
        </header>

        <main className="mx-auto max-w-[480px] px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="mb-2 text-base font-semibold">
                유효하지 않은 초대 링크입니다
              </h2>
              <p className="text-sm text-muted-foreground">
                초대 링크가 만료되었거나 올바르지 않습니다.
                <br />
                주최자에게 새로운 링크를 요청해주세요.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 심플 헤더 (로고만, 탭 네비 없음) */}
      <header className="flex h-14 items-center border-b px-4">
        <div className="mx-auto flex w-full max-w-[480px] items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">모이자</span>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="mx-auto max-w-[480px] space-y-4 px-4 py-8">
        {/* 이벤트 정보 카드 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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

            {/* 설명 */}
            {event.description && (
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 참여 신청 폼 (Client Component) */}
        <JoinForm eventId={event.id} />
      </main>
    </div>
  );
}
