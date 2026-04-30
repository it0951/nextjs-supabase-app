"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { createCarpoolGroupSchema } from "@/lib/schemas/carpool";

/**
 * 카풀 그룹 생성 Server Action (주최자 전용)
 * - 이벤트 소유권 검증
 * - carpool_groups INSERT
 */
export async function createCarpoolGroupAction(
  eventId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 소유권 확인
  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (!event || event.owner_id !== user.id) {
    return { success: false, error: "카풀 그룹을 생성할 권한이 없습니다." };
  }

  // 폼 데이터 추출 및 스키마 검증
  const rawData = {
    driver_participant_id: formData.get("driver_participant_id"),
    capacity: Number(formData.get("capacity")),
    name: formData.get("name") ?? undefined,
  };

  const parsed = createCarpoolGroupSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError ?? "입력값을 확인해주세요." };
  }

  const { driver_participant_id, capacity, name } = parsed.data;

  // carpool_groups INSERT
  const { error: insertError } = await supabase.from("carpool_groups").insert({
    event_id: eventId,
    driver_participant_id,
    capacity,
    name: name ?? `${capacity}인승 카풀`,
  });

  if (insertError) {
    return {
      success: false,
      error: insertError.message ?? "카풀 그룹 생성에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}

/**
 * 카풀 그룹 삭제 Server Action (주최자 전용)
 * - 이벤트 소유권 검증
 * - carpool_groups DELETE (carpool_assignments는 CASCADE 삭제)
 */
export async function deleteCarpoolGroupAction(
  groupId: string,
  eventId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 소유권 확인
  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (!event || event.owner_id !== user.id) {
    return { success: false, error: "카풀 그룹을 삭제할 권한이 없습니다." };
  }

  // carpool_groups DELETE
  const { error: deleteError } = await supabase
    .from("carpool_groups")
    .delete()
    .eq("id", groupId)
    .eq("event_id", eventId);

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message ?? "카풀 그룹 삭제에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}

/**
 * 카풀 배정 업데이트 Server Action (주최자 전용)
 * - 기존 carpool_assignments DELETE 후 새 배정 INSERT
 * - 좌석 초과 서버 검증
 */
export async function updateCarpoolAssignmentsAction(
  groupId: string,
  eventId: string,
  memberParticipantIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 소유권 확인
  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (!event || event.owner_id !== user.id) {
    return { success: false, error: "카풀 배정을 변경할 권한이 없습니다." };
  }

  // 그룹 capacity 확인
  const { data: group } = await supabase
    .from("carpool_groups")
    .select("capacity")
    .eq("id", groupId)
    .single();

  if (!group) {
    return { success: false, error: "카풀 그룹을 찾을 수 없습니다." };
  }

  // 좌석 초과 검증 (드라이버 1명 포함)
  const maxMembers = group.capacity - 1;
  if (memberParticipantIds.length > maxMembers) {
    return {
      success: false,
      error: `최대 ${maxMembers}명까지 배정할 수 있습니다. (드라이버 포함 총 ${group.capacity}석)`,
    };
  }

  // 기존 배정 DELETE
  const { error: deleteError } = await supabase
    .from("carpool_assignments")
    .delete()
    .eq("group_id", groupId);

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message ?? "기존 배정 삭제에 실패했습니다.",
    };
  }

  // 새 배정 INSERT (멤버가 있는 경우만)
  if (memberParticipantIds.length > 0) {
    const newAssignments = memberParticipantIds.map((participant_id) => ({
      group_id: groupId,
      participant_id,
    }));

    const { error: insertError } = await supabase
      .from("carpool_assignments")
      .insert(newAssignments);

    if (insertError) {
      return {
        success: false,
        error: insertError.message ?? "배정 저장에 실패했습니다.",
      };
    }
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}
