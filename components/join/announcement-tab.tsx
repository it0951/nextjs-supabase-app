import { Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/types/supabase";

type Announcement = Tables<"announcements">;

interface AnnouncementTabProps {
  /** 서버에서 조회한 공지사항 목록 (최신순 정렬됨) */
  initialAnnouncements: Announcement[];
}

/**
 * 공지사항 탭 - 읽기 전용 (참여자 뷰)
 * 해당 이벤트의 공지사항 목록을 최신순으로 표시합니다.
 */
export function AnnouncementTab({
  initialAnnouncements,
}: AnnouncementTabProps) {
  // 빈 상태 처리
  if (initialAnnouncements.length === 0) {
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
      {initialAnnouncements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {announcement.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(announcement.created_at).toLocaleDateString("ko-KR")}
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
