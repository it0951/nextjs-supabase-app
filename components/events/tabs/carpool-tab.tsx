"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import {
  createCarpoolGroupAction,
  deleteCarpoolGroupAction,
  updateCarpoolAssignmentsAction,
} from "@/lib/actions/carpools";
import type { Tables } from "@/types/supabase";

// ─────────────────────────────────────────
// DB 타입 정의
// ─────────────────────────────────────────
type CarpoolGroup = Tables<"carpool_groups"> & {
  carpool_assignments: Tables<"carpool_assignments">[];
};
type Participant = Tables<"participants">;

// ─────────────────────────────────────────
// 그룹 추가 폼 스키마
// ─────────────────────────────────────────
const addGroupSchema = z.object({
  driver_participant_id: z.string().min(1, "드라이버를 선택해주세요."),
  capacity: z
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
  /** 서버에서 조회한 카풀 그룹 목록 (carpool_assignments 포함) */
  initialCarpoolGroups: CarpoolGroup[];
  /** 서버에서 조회한 전체 참여자 목록 */
  initialParticipants: Participant[];
}

/**
 * 카풀 탭 컴포넌트 (Supabase 연동)
 * - 카풀 그룹 카드 목록 표시
 * - 그룹 추가 다이얼로그 (react-hook-form + zod)
 * - 참여자 배정 다이얼로그 (체크박스 선택)
 */
export function CarpoolTab({
  eventId,
  initialCarpoolGroups,
  initialParticipants,
}: CarpoolTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 확정된 참여자만 (배정 후보)
  const confirmedParticipants = initialParticipants.filter(
    (p) => p.status === "confirmed"
  );

  // 그룹 추가 다이얼로그 상태
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 배정 다이얼로그 상태
  const [assignGroupId, setAssignGroupId] = useState<string | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // 그룹 추가 폼
  const form = useForm<AddGroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: { driver_participant_id: "", capacity: "4" },
  });

  // 참여자 이름 조회 헬퍼
  const getParticipantName = (participantId: string): string => {
    return (
      initialParticipants.find((p) => p.id === participantId)?.name ??
      "알 수 없음"
    );
  };

  // 이미 다른 그룹에 배정된 참여자 ID 집합 (드라이버 포함)
  const assignedParticipantIds = new Set<string>(
    initialCarpoolGroups.flatMap((g) => [
      g.driver_participant_id,
      ...g.carpool_assignments.map((a) => a.participant_id),
    ])
  );

  // 그룹 추가 제출 핸들러
  const handleAddGroup = async (values: AddGroupFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("driver_participant_id", values.driver_participant_id);
      formData.set("capacity", values.capacity);

      const result = await createCarpoolGroupAction(
        eventId,
        { success: false, error: "" },
        formData
      );

      if (result.success) {
        toast.success("카풀 그룹이 추가되었습니다.");
        setIsAddGroupOpen(false);
        form.reset();
        startTransition(() => router.refresh());
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async (groupId: string) => {
    const result = await deleteCarpoolGroupAction(groupId, eventId);
    if (result.success) {
      toast.success("카풀 그룹이 삭제되었습니다.");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.error);
    }
  };

  // 배정 다이얼로그 열기
  const handleOpenAssign = (group: CarpoolGroup) => {
    setAssignGroupId(group.id);
    setSelectedMemberIds(
      group.carpool_assignments.map((a) => a.participant_id)
    );
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
  const handleSaveAssign = async () => {
    if (!assignGroupId) return;

    setIsAssigning(true);
    try {
      const result = await updateCarpoolAssignmentsAction(
        assignGroupId,
        eventId,
        selectedMemberIds
      );

      if (result.success) {
        toast.success("참여자 배정이 저장되었습니다.");
        setAssignGroupId(null);
        startTransition(() => router.refresh());
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsAssigning(false);
    }
  };

  // 배정 다이얼로그에서 선택 가능한 참여자 계산
  const currentGroup = initialCarpoolGroups.find((g) => g.id === assignGroupId);
  const currentGroupMemberIds = new Set(
    currentGroup?.carpool_assignments.map((a) => a.participant_id) ?? []
  );

  type CandidateParticipant = Participant & { disabled: boolean };
  const assignCandidates: CandidateParticipant[] = confirmedParticipants
    .filter((p) => p.id !== currentGroup?.driver_participant_id)
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
          총 {initialCarpoolGroups.length}개 그룹
        </p>
        <Button
          size="sm"
          onClick={() => setIsAddGroupOpen(true)}
          disabled={isPending}
        >
          그룹 추가
        </Button>
      </div>

      {/* 카풀 그룹 카드 목록 */}
      {initialCarpoolGroups.length === 0 ? (
        <EmptyState
          icon={<Car className="h-full w-full" />}
          title="아직 카풀 그룹이 없습니다"
          description="그룹 추가 버튼을 눌러 카풀 그룹을 만들어 보세요."
        />
      ) : (
        <div className="space-y-3">
          {initialCarpoolGroups.map((group) => {
            const memberCount = group.carpool_assignments.length;
            // 드라이버 포함 총 탑승 인원
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
                          {getParticipantName(group.driver_participant_id)}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          드라이버
                        </Badge>
                      </div>
                      {/* 좌석 정보 */}
                      <p className="text-xs text-muted-foreground">
                        {occupiedSeats}/{group.capacity}석
                      </p>
                    </div>
                    {/* 배정/삭제 버튼 */}
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 text-xs"
                        onClick={() => handleOpenAssign(group)}
                        disabled={isPending}
                      >
                        <UserPlus className="mr-1 h-3.5 w-3.5" />
                        배정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteGroup(group.id)}
                        disabled={isPending}
                      >
                        삭제
                      </Button>
                    </div>
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
                      {group.carpool_assignments.map((assignment) => (
                        <Badge
                          key={assignment.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {getParticipantName(assignment.participant_id)}
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
                name="driver_participant_id"
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>총 좌석수 (드라이버 포함)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2}
                        max={15}
                        placeholder="4"
                        {...field}
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "추가 중..." : "추가"}
                </Button>
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
                드라이버:{" "}
                {getParticipantName(currentGroup.driver_participant_id)} | 최대
                동승 {currentGroup.capacity - 1}명 (총 {currentGroup.capacity}
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
            <Button onClick={handleSaveAssign} disabled={isAssigning}>
              {isAssigning ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
