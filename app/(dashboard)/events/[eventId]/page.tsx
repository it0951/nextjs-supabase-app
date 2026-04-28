"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Calendar, MapPin, Users, Copy, Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEvents } from "@/lib/mock/data";
import { type Event } from "@/lib/mock/types";
import { AnnouncementTab } from "@/components/events/tabs/announcement-tab";
import { ParticipantTab } from "@/components/events/tabs/participant-tab";
import { CarpoolTab } from "@/components/events/tabs/carpool-tab";
import { ExpenseTab } from "@/components/events/tabs/expense-tab";

// 동적 라우트: useParams() 사용으로 정적 프리렌더 비활성화
export const dynamic = "force-dynamic";

/**
 * 이벤트 관리 페이지
 * - 5개 탭: 개요, 공지, 참여자, 카풀, 정산
 * - 개요 탭: 이벤트 정보 + 초대 링크 복사
 */
export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  // mock data에서 이벤트 찾기 (동기 계산)
  const event: Event | null = mockEvents.find((e) => e.id === eventId) ?? null;

  // 이벤트가 없으면 404 처리
  if (!event) {
    notFound();
  }

  // window.location은 클라이언트에서만 사용 가능하므로 조건부 접근
  const [inviteUrl] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/invite/${event.inviteToken}`;
  });

  // 초대 링크 복사 핸들러
  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("초대 링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 헤더: 뒤로가기 + 이벤트 제목 */}
      <header className="fixed top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[480px] items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => router.push("/dashboard")}
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5" />
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
                {event.maxParticipants !== undefined && (
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">최대 인원</p>
                      <p className="text-sm font-medium">
                        {event.maxParticipants}명
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

            {/* 초대 링크 카드 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">초대 링크</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 링크 URL 표시 */}
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                  <Link className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="flex-1 truncate text-xs text-muted-foreground">
                    {inviteUrl || "링크를 생성 중입니다..."}
                  </p>
                </div>

                {/* 링크 복사 버튼 */}
                <Button
                  variant="outline"
                  className="h-10 w-full"
                  onClick={handleCopyInviteLink}
                  disabled={!inviteUrl}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  링크 복사
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 공지 탭 */}
          <TabsContent value="announcements" className="mt-4">
            <AnnouncementTab eventId={eventId} />
          </TabsContent>

          {/* 참여자 탭 */}
          <TabsContent value="participants" className="mt-4">
            <ParticipantTab eventId={eventId} />
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
