import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/types/supabase";

type CarpoolGroup = Tables<"carpool_groups"> & {
  carpool_assignments: Tables<"carpool_assignments">[];
};

interface CarpoolTabProps {
  /** 서버에서 조회한 카풀 그룹 목록 (carpool_assignments 포함) */
  carpoolGroups: CarpoolGroup[];
  /** 현재 참여자 ID */
  myParticipantId: string;
  /** 참여자 이름 매핑 (id → name) */
  participantNameMap: Record<string, string>;
}

/**
 * 카풀 탭 - 읽기 전용 (참여자 뷰)
 * 해당 참여자가 배정된 카풀 그룹 정보를 표시합니다.
 */
export function CarpoolTab({
  carpoolGroups,
  myParticipantId,
  participantNameMap,
}: CarpoolTabProps) {
  // 현재 참여자가 속한 카풀 그룹 조회
  const myCarpoolGroup = carpoolGroups.find(
    (group) =>
      group.driver_participant_id === myParticipantId ||
      group.carpool_assignments.some(
        (a) => a.participant_id === myParticipantId
      )
  );

  // 카풀 미배정 상태 처리
  if (!myCarpoolGroup) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Car className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            아직 카풀이 배정되지 않았습니다.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            주최자가 곧 배정할 예정입니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 드라이버 이름 조회
  const driverName =
    participantNameMap[myCarpoolGroup.driver_participant_id] ?? "알 수 없음";
  const isDriver = myCarpoolGroup.driver_participant_id === myParticipantId;

  // 동승자 목록
  const assignments = myCarpoolGroup.carpool_assignments;

  // 현재 탑승 인원 (드라이버 + 동승자)
  const currentOccupancy = 1 + assignments.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">배정된 카풀</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 좌석 현황 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>좌석 현황</span>
          <span className="font-medium text-foreground">
            {currentOccupancy}/{myCarpoolGroup.capacity}석
          </span>
        </div>

        {/* 드라이버 */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
          <span className={`text-sm ${isDriver ? "font-semibold" : ""}`}>
            {driverName}
            {isDriver && (
              <span className="ml-1 text-xs text-primary">(나)</span>
            )}
          </span>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 hover:bg-blue-100"
          >
            드라이버
          </Badge>
        </div>

        {/* 동승자 목록 */}
        {assignments.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">동승자</p>
            <div className="space-y-1.5">
              {assignments.map((assignment) => {
                const memberName =
                  participantNameMap[assignment.participant_id] ?? "알 수 없음";
                const isMe = assignment.participant_id === myParticipantId;

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center rounded-lg px-3 py-2 hover:bg-muted/30"
                  >
                    <span className={`text-sm ${isMe ? "font-semibold" : ""}`}>
                      {memberName}
                      {isMe && (
                        <span className="ml-1 text-xs text-primary">(나)</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 동승자가 없는 경우 */}
        {assignments.length === 0 && (
          <p className="text-xs text-muted-foreground">
            아직 동승자가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
