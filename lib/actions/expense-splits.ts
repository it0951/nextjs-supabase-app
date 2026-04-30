"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/**
 * 정산 납부 여부 토글 Server Action (주최자용)
 * - 이벤트 소유권 검증 후 expense_split의 is_paid 업데이트
 */
export async function toggleExpenseSplitPaidAction(
  splitId: string,
  eventId: string,
  isPaid: boolean
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
    return {
      success: false,
      error: "정산 납부 상태를 변경할 권한이 없습니다.",
    };
  }

  // expense_split is_paid 업데이트
  const { error } = await supabase
    .from("expense_splits")
    .update({ is_paid: isPaid })
    .eq("id", splitId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "납부 상태 변경에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}

/**
 * 정산 납부 여부 토글 Server Action (참여자용)
 * - join_token 기반으로 본인 split만 수정 가능
 */
export async function toggleMyExpenseSplitPaidAction(
  splitId: string,
  joinToken: string,
  isPaid: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  // join_token으로 참여자 조회
  const { data: participant } = await supabase
    .from("participants")
    .select("id, event_id")
    .eq("join_token", joinToken)
    .single();

  if (!participant) {
    return { success: false, error: "유효하지 않은 참여 토큰입니다." };
  }

  // 해당 split이 본인 것인지 확인
  const { data: split } = await supabase
    .from("expense_splits")
    .select("participant_id")
    .eq("id", splitId)
    .single();

  if (!split || split.participant_id !== participant.id) {
    return { success: false, error: "본인의 정산 내역만 수정할 수 있습니다." };
  }

  // is_paid 업데이트
  const { error } = await supabase
    .from("expense_splits")
    .update({ is_paid: isPaid })
    .eq("id", splitId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "납부 상태 변경에 실패했습니다.",
    };
  }

  revalidatePath(`/join/${joinToken}`);
  return { success: true, data: undefined };
}
