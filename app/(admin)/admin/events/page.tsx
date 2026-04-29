import { mockEvents, mockParticipants } from "@/lib/mock/data";
import { mockAdminUsers } from "@/lib/mock/admin-data";
import {
  AdminEventsTable,
  type AdminEventItem,
} from "@/components/admin/events/admin-events-table";

/**
 * 관리자 이벤트 관리 페이지 (Server Component)
 * - mockEvents, mockParticipants, mockAdminUsers를 기반으로 이벤트 목록 구성
 * - AdminEventsTable에 AdminEventItem[] 형식으로 데이터 전달
 */
export default function AdminEventsPage() {
  /**
   * 각 이벤트에 주최자 이름과 참여자 수를 합산하여 테이블용 데이터 생성
   */
  const adminEventItems: AdminEventItem[] = mockEvents.map((event) => {
    // 주최자 이름: mockAdminUsers에서 ownerId로 검색, 없으면 '알 수 없음'
    const organizerName =
      mockAdminUsers.find((u) => u.id === event.ownerId)?.name ?? "알 수 없음";

    // 참여자 수: mockParticipants에서 eventId 일치하는 항목 카운트
    const participantCount = mockParticipants.filter(
      (p) => p.eventId === event.id
    ).length;

    return {
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      organizerName,
      participantCount,
    };
  });

  return (
    <div className="py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">이벤트 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총{" "}
            <span className="font-semibold text-foreground">
              {adminEventItems.length}
            </span>
            개의 이벤트
          </p>
        </div>
      </div>

      {/* 이벤트 목록 테이블 */}
      <AdminEventsTable events={adminEventItems} />
    </div>
  );
}
