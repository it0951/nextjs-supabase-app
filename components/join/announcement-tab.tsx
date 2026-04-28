import { Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnnouncements } from "@/lib/mock/data";

interface AnnouncementTabProps {
  eventId: string;
}

/**
 * 공지사항 탭 - 읽기 전용
 * 해당 이벤트의 공지사항 목록을 최신순으로 표시합니다.
 */
export function AnnouncementTab({ eventId }: AnnouncementTabProps) {
  // 해당 이벤트의 공지사항 필터링 (최신순 정렬)
  const announcements = mockAnnouncements
    .filter((a) => a.eventId === eventId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // 빈 상태 처리
  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Megaphone className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          아직 공지사항이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {announcement.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(announcement.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm text-foreground/80">
              {announcement.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
