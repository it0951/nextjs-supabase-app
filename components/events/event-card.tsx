"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Event } from "@/types/supabase";

interface EventCardProps {
  event: Event;
  participantCount: number;
}

/**
 * 이벤트 상태를 계산하는 헬퍼 함수
 * - 오늘: "진행중" (green)
 * - 미래: "예정" (blue)
 * - 과거: "완료" (gray)
 */
function getEventStatus(dateStr: string): {
  label: string;
  className: string;
} {
  const eventDate = new Date(dateStr);
  const today = new Date();

  // 날짜만 비교하기 위해 시간 정보 제거
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (eventDay.getTime() === todayDay.getTime()) {
    return {
      label: "진행중",
      className:
        "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
  }

  if (eventDay > todayDay) {
    return {
      label: "예정",
      className:
        "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
  }

  return {
    label: "완료",
    className:
      "border-transparent bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };
}

/**
 * 날짜를 "M월 D일" 형식으로 포맷하는 헬퍼 함수
 */
function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}

/**
 * 이벤트 카드 컴포넌트 (모바일 최적화 가로형 리스트 카드)
 * - Supabase Event 타입 사용 (snake_case 필드명)
 * - 카드 전체를 /events/${event.id} 링크로 감쌈
 * - 상태 Badge: 예정(blue) / 진행중(green) / 완료(gray)
 */
export function EventCard({ event, participantCount }: EventCardProps) {
  const status = getEventStatus(event.date);
  const formattedDate = formatEventDate(event.date);

  return (
    <Link
      href={`/events/${event.id}`}
      className="block min-h-[44px] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="cursor-pointer p-4 transition-colors hover:bg-accent active:bg-accent/80">
        <div className="flex items-start gap-3">
          {/* 왼쪽: 캘린더 아이콘 */}
          <div className="mt-0.5 flex-shrink-0 text-muted-foreground">
            <CalendarDays className="h-5 w-5" />
          </div>

          {/* 오른쪽: 이벤트 내용 */}
          <div className="min-w-0 flex-1">
            {/* 상단: 제목 + 상태 Badge */}
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-foreground">
                {event.title}
              </h3>
              <Badge className={status.className}>{status.label}</Badge>
            </div>

            {/* 날짜 */}
            <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>

            {/* 장소 */}
            <div className="mb-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            {/* 참여자 수 */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {participantCount}명 참석
                {event.max_participants != null &&
                  ` / 최대 ${event.max_participants}명`}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
