"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import type { ParticipantStatus } from "@/types/supabase";

/**
 * 참여자 상태 변경 Server Action
 * - 이벤트 소유권 확인 후 participant 상태 업데이트
 * - 허용된 상태값: pending | confirmed | cancelled
 */
export async function updateParticipantStatusAction(
  participantId: string,
  eventId: string,
  status: ParticipantStatus
): Promise<ActionResult> {
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 소유권 확인 (해당 이벤트의 주최자만 참여자 상태 변경 가능)
  const { data: event } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (!event || event.owner_id !== user.id) {
    return {
      success: false,
      error: "참여자 상태를 변경할 권한이 없습니다.",
    };
  }

  // 참여자 상태 업데이트
  const { error } = await supabase
    .from("participants")
    .update({ status })
    .eq("id", participantId)
    .eq("event_id", eventId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "상태 변경에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}
