import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCarpoolGroups, mockParticipants } from "@/lib/mock/data";

interface CarpoolTabProps {
  participantId: string;
  eventId: string;
}

/**
 * 카풀 탭 - 읽기 전용
 * 해당 참여자가 배정된 카풀 그룹 정보를 표시합니다.
 */
export function CarpoolTab({ participantId, eventId }: CarpoolTabProps) {
  // 해당 이벤트 카풀 그룹 중 현재 참여자가 속한 그룹 조회
  // (드라이버이거나 동승자인 경우 모두 포함)
  const carpoolGroup = mockCarpoolGroups.find(
    (group) =>
      group.eventId === eventId &&
      (group.driverParticipantId === participantId ||
        group.memberIds.includes(participantId))
  );

  // 카풀 미배정 상태 처리
  if (!carpoolGroup) {
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

  // 드라이버 정보 조회
  const driver = mockParticipants.find(
    (p) => p.id === carpoolGroup.driverParticipantId
  );

  // 동승자 정보 조회
  const members = carpoolGroup.memberIds
    .map((id) => mockParticipants.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 현재 탑승 인원 (드라이버 포함)
  const currentOccupancy = 1 + carpoolGroup.memberIds.length;

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
            {currentOccupancy}/{carpoolGroup.seats}석
          </span>
        </div>

        {/* 드라이버 */}
        {driver && (
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
            <span
              className={`text-sm ${
                driver.id === participantId ? "font-semibold" : ""
              }`}
            >
              {driver.name}
              {driver.id === participantId && (
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
        )}

        {/* 동승자 목록 */}
        {members.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">동승자</p>
            <div className="space-y-1.5">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center rounded-lg px-3 py-2 hover:bg-muted/30"
                >
                  <span
                    className={`text-sm ${
                      member.id === participantId ? "font-semibold" : ""
                    }`}
                  >
                    {member.name}
                    {member.id === participantId && (
                      <span className="ml-1 text-xs text-primary">(나)</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 동승자가 없는 경우 */}
        {members.length === 0 && (
          <p className="text-xs text-muted-foreground">
            아직 동승자가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
