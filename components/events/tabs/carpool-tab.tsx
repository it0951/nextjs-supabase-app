"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Car, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { mockCarpoolGroups, mockParticipants } from "@/lib/mock/data";
import { type CarpoolGroup, type Participant } from "@/lib/mock/types";

// ─────────────────────────────────────────
// 그룹 추가 폼 스키마
// ─────────────────────────────────────────
// 폼 값은 string으로 받아서 제출 시 수동으로 변환
const addGroupSchema = z.object({
  groupName: z.string().optional(),
  driverParticipantId: z.string().min(1, "드라이버를 선택해주세요."),
  seats: z
    .string()
    .min(1, "좌석수를 입력해주세요.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 2,
      "최소 2석 이상이어야 합니다."
    )
    .refine((v) => Number(v) <= 15, "최대 15석까지 가능합니다."),
});

type AddGroupFormValues = z.infer<typeof addGroupSchema>;

interface CarpoolTabProps {
  /** 이벤트 ID */
  eventId: string;
}

/**
 * 카풀 탭 컴포넌트
 * - 카풀 그룹 카드 목록 표시
 * - 그룹 추가 다이얼로그 (react-hook-form + zod)
 * - 참여자 배정 다이얼로그 (체크박스 선택)
 */
export function CarpoolTab({ eventId }: CarpoolTabProps) {
  // mock data에서 해당 이벤트의 카풀 그룹 초기값
  const [groups, setGroups] = useState<CarpoolGroup[]>(
    mockCarpoolGroups.filter((g) => g.eventId === eventId)
  );

  // 해당 이벤트의 참여자 목록 (confirmed 포함 전체)
  const allParticipants = mockParticipants.filter((p) => p.eventId === eventId);
  // 확정된 참여자만 (배정 후보)
  const confirmedParticipants = allParticipants.filter(
    (p) => p.status === "confirmed"
  );

  // 그룹 추가 다이얼로그 상태
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  // 배정 다이얼로그 상태
  const [assignGroupId, setAssignGroupId] = useState<string | null>(null);
  // 배정 다이얼로그에서 선택된 참여자 ID 목록
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // 그룹 추가 폼
  const form = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: { groupName: "", driverParticipantId: "", seats: "4" },
  });

  // 참여자 이름 조회 헬퍼
  const getParticipantName = (participantId: string): string => {
    return (
      allParticipants.find((p) => p.id === participantId)?.name ?? "알 수 없음"
    );
  };

  // 이미 다른 그룹에 드라이버 또는 동승자로 배정된 참여자 ID 집합
  const assignedParticipantIds = new Set<string>(
    groups.flatMap((g) => [g.driverParticipantId, ...g.memberIds])
  );

  // 그룹 추가 제출 핸들러
  const handleAddGroup = (values: AddGroupFormValues) => {
    const newGroup: CarpoolGroup = {
      id: crypto.randomUUID(),
      eventId,
      driverParticipantId: values.driverParticipantId,
      seats: Number(values.seats),
      memberIds: [],
    };
    setGroups((prev) => [...prev, newGroup]);
    toast.success("카풀 그룹이 추가되었습니다.");
    setIsAddGroupOpen(false);
    form.reset();
  };

  // 배정 다이얼로그 열기
  const handleOpenAssign = (group: CarpoolGroup) => {
    setAssignGroupId(group.id);
    setSelectedMemberIds([...group.memberIds]);
  };

  // 체크박스 토글 핸들러
  const handleToggleMember = (participantId: string, checked: boolean) => {
    if (checked) {
      setSelectedMemberIds((prev) => [...prev, participantId]);
    } else {
      setSelectedMemberIds((prev) => prev.filter((id) => id !== participantId));
    }
  };

  // 배정 저장 핸들러
  const handleSaveAssign = () => {
    if (!assignGroupId) return;
    const group = groups.find((g) => g.id === assignGroupId);
    if (!group) return;

    // 좌석 초과 검사 (드라이버 제외 동승 가능 인원)
    const maxMembers = group.seats - 1;
    if (selectedMemberIds.length > maxMembers) {
      toast.error(
        `최대 ${maxMembers}명까지 배정할 수 있습니다. (드라이버 포함 총 ${group.seats}석)`
      );
      return;
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.id === assignGroupId ? { ...g, memberIds: selectedMemberIds } : g
      )
    );
    toast.success("참여자 배정이 저장되었습니다.");
    setAssignGroupId(null);
  };

  // 배정 다이얼로그에서 선택 가능한 참여자 계산
  // - 드라이버 제외
  // - 다른 그룹에 이미 배정된 참여자는 비활성화 (현재 그룹 멤버는 허용)
  const currentGroup = groups.find((g) => g.id === assignGroupId);
  const currentGroupMemberIds = new Set(currentGroup?.memberIds ?? []);

  const assignCandidates: Array<Participant & { disabled: boolean }> =
    confirmedParticipants
      .filter((p) => p.id !== currentGroup?.driverParticipantId)
      .map((p) => ({
        ...p,
        // 다른 그룹에 배정되어 있으면서 현재 그룹 멤버가 아닌 경우 비활성화
        disabled:
          assignedParticipantIds.has(p.id) && !currentGroupMemberIds.has(p.id),
      }));

  return (
    <div className="space-y-4">
      {/* 탭 상단: 통계 + 그룹 추가 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {groups.length}개 그룹
        </p>
        <Button size="sm" onClick={() => setIsAddGroupOpen(true)}>
          그룹 추가
        </Button>
      </div>

      {/* 카풀 그룹 카드 목록 */}
      {groups.length === 0 ? (
        <EmptyState
          icon={<Car className="h-full w-full" />}
          title="아직 카풀 그룹이 없습니다"
          description="그룹 추가 버튼을 눌러 카풀 그룹을 만들어 보세요."
        />
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const memberCount = group.memberIds.length;
            // 드라이버 포함 총 탑승 인원 (드라이버 1명 + 동승자)
            const occupiedSeats = memberCount + 1;

            return (
              <Card key={group.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      {/* 드라이버 정보 */}
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">
                          드라이버:{" "}
                          {getParticipantName(group.driverParticipantId)}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          드라이버
                        </Badge>
                      </div>
                      {/* 좌석 정보 */}
                      <p className="text-xs text-muted-foreground">
                        {occupiedSeats}/{group.seats}석
                      </p>
                    </div>
                    {/* 배정 관리 버튼 */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 shrink-0 text-xs"
                      onClick={() => handleOpenAssign(group)}
                    >
                      <UserPlus className="mr-1 h-3.5 w-3.5" />
                      배정 관리
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 동승자 배지 목록 */}
                  {memberCount === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      배정된 동승자가 없습니다.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {group.memberIds.map((memberId) => (
                        <Badge
                          key={memberId}
                          variant="outline"
                          className="text-xs"
                        >
                          {getParticipantName(memberId)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 그룹 추가 다이얼로그 */}
      <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>카풀 그룹 추가</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddGroup)}
              className="space-y-4"
            >
              {/* 드라이버 선택 */}
              <FormField
                control={form.control}
                name="driverParticipantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>드라이버</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="드라이버를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {confirmedParticipants.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            disabled={assignedParticipantIds.has(p.id)}
                          >
                            {p.name}
                            {assignedParticipantIds.has(p.id) && " (배정됨)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 총 좌석수 */}
              <FormField
                control={form.control}
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>총 좌석수 (드라이버 포함)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2}
                        max={15}
                        placeholder="4"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddGroupOpen(false);
                    form.reset();
                  }}
                >
                  취소
                </Button>
                <Button type="submit">추가</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 참여자 배정 다이얼로그 */}
      <Dialog
        open={assignGroupId !== null}
        onOpenChange={(open) => {
          if (!open) setAssignGroupId(null);
        }}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>동승자 배정</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {currentGroup && (
              <p className="text-sm text-muted-foreground">
                드라이버: {getParticipantName(currentGroup.driverParticipantId)}{" "}
                | 최대 동승 {currentGroup.seats - 1}명 (총 {currentGroup.seats}
                석)
              </p>
            )}
            {assignCandidates.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                배정 가능한 확정 참여자가 없습니다.
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {assignCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center gap-3 rounded-md px-1 py-1.5"
                  >
                    <Checkbox
                      id={`assign-${candidate.id}`}
                      checked={selectedMemberIds.includes(candidate.id)}
                      disabled={candidate.disabled}
                      onCheckedChange={(checked) =>
                        handleToggleMember(candidate.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`assign-${candidate.id}`}
                      className={`flex-1 cursor-pointer text-sm ${
                        candidate.disabled
                          ? "cursor-not-allowed text-muted-foreground"
                          : ""
                      }`}
                    >
                      {candidate.name}
                      {candidate.disabled && (
                        <span className="ml-1 text-xs">(다른 그룹 배정됨)</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAssignGroupId(null)}>
              취소
            </Button>
            <Button onClick={handleSaveAssign}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
