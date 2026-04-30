"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import type { ParticipantStatus } from "@/types/supabase";
import { registerParticipantSchema } from "@/lib/schemas/participant";

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

/**
 * 참여자 등록 Server Action (비회원)
 * - invite_token으로 이벤트 조회 후 유효성 검증
 * - 최대 인원 초과 확인
 * - participants INSERT, DB에서 자동 생성된 join_token 반환
 */
export async function registerParticipantAction(
  eventId: string,
  _prevState: ActionResult<{ joinToken: string }>,
  formData: FormData
): Promise<ActionResult<{ joinToken: string }>> {
  const supabase = await createClient();

  // 폼 데이터 추출 및 스키마 검증
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
  };

  const parsed = registerParticipantSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return {
      success: false,
      error: firstError ?? "입력값을 확인해주세요.",
    };
  }

  const { name, phone } = parsed.data;

  // 이벤트 유효성 확인
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, max_participants")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return { success: false, error: "유효하지 않은 이벤트입니다." };
  }

  // 최대 인원 초과 검증
  if (event.max_participants !== null) {
    const { count } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .neq("status", "cancelled");

    if (count !== null && count >= event.max_participants) {
      return {
        success: false,
        error: `최대 참여 인원(${event.max_participants}명)을 초과했습니다.`,
      };
    }
  }

  // 참여자 INSERT (join_token은 DB에서 자동 생성)
  const { data: participant, error: insertError } = await supabase
    .from("participants")
    .insert({
      event_id: eventId,
      name,
      phone,
      status: "pending",
    })
    .select("join_token")
    .single();

  if (insertError || !participant) {
    return {
      success: false,
      error: insertError?.message ?? "참여 신청에 실패했습니다.",
    };
  }

  return { success: true, data: { joinToken: participant.join_token } };
}
