"use client";

import { useParams } from "next/navigation";
import { Calendar, MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockParticipants, mockEvents } from "@/lib/mock/data";
import {
  type Event,
  type Participant,
  type ParticipantStatus,
} from "@/lib/mock/types";
import { AnnouncementTab } from "@/components/join/announcement-tab";
import { CarpoolTab } from "@/components/join/carpool-tab";
import { ExpenseTab } from "@/components/join/expense-tab";

// 동적 라우트: useParams() 사용으로 정적 프리렌더 비활성화
export const dynamic = "force-dynamic";

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
 * 비회원 참여자 뷰 페이지
 * - joinToken으로 참여자 정보 조회
 * - 해당 이벤트 정보 표시
 * - 공지 / 카풀 / 정산 탭 골격 (구현 예정)
 */
export default function JoinPage() {
  const params = useParams();
  const joinToken = params.joinToken as string;

  // joinToken으로 참여자 조회 (동기 계산)
  const participant: Participant | null =
    mockParticipants.find((p) => p.joinToken === joinToken) ?? null;

  // 참여자의 이벤트 정보 조회
  const event: Event | null = participant
    ? (mockEvents.find((e) => e.id === participant.eventId) ?? null)
    : null;

  // 유효하지 않은 토큰 여부 판단
  const isInvalidToken = !participant || !event;

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 유효하지 않은 토큰 처리
  if (isInvalidToken) {
    return (
      <div className="min-h-screen bg-background">
        {/* 심플 헤더 */}
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

  if (!participant || !event) {
    return null;
  }

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
              <AnnouncementTab eventId={event.id} />
            </TabsContent>

            {/* 카풀 탭 */}
            <TabsContent value="carpool" className="mt-4">
              <CarpoolTab participantId={participant.id} eventId={event.id} />
            </TabsContent>

            {/* 정산 탭 */}
            <TabsContent value="expense" className="mt-4">
              <ExpenseTab participantId={participant.id} eventId={event.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
