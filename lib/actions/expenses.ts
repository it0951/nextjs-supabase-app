"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { createExpenseItemSchema } from "@/lib/schemas/expense";
import { calculateEvenSplits } from "@/lib/utils/expense-splits";

/**
 * 정산 항목 생성 Server Action (주최자 전용)
 * - 이벤트 소유권 검증
 * - expense_items INSERT
 * - confirmed 참여자에게 균등 분배하여 expense_splits 자동 생성
 */
export async function createExpenseItemAction(
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
    return { success: false, error: "정산 항목을 추가할 권한이 없습니다." };
  }

  // 폼 데이터 추출 및 스키마 검증
  const rawData = {
    title: formData.get("title"),
    amount: formData.get("amount"),
  };

  const parsed = createExpenseItemSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError ?? "입력값을 확인해주세요." };
  }

  const { title, amount } = parsed.data;
  const amountNumber = Number(amount);

  // expense_items INSERT
  const { data: expenseItem, error: insertError } = await supabase
    .from("expense_items")
    .insert({
      event_id: eventId,
      title,
      amount: amountNumber,
    })
    .select("id")
    .single();

  if (insertError || !expenseItem) {
    return {
      success: false,
      error: insertError?.message ?? "정산 항목 추가에 실패했습니다.",
    };
  }

  // confirmed 참여자 조회
  const { data: confirmedParticipants } = await supabase
    .from("participants")
    .select("id")
    .eq("event_id", eventId)
    .eq("status", "confirmed");

  // 균등 분배하여 expense_splits 자동 생성
  if (confirmedParticipants && confirmedParticipants.length > 0) {
    const participantIds = confirmedParticipants.map((p) => p.id);
    const splits = calculateEvenSplits(amountNumber, participantIds);
    const splitsWithItemId = splits.map((split) => ({
      ...split,
      item_id: expenseItem.id,
    }));

    const { error: splitsError } = await supabase
      .from("expense_splits")
      .insert(splitsWithItemId);

    if (splitsError) {
      // 항목은 생성됐지만 분배 실패 시 롤백하지 않고 에러만 반환
      return {
        success: false,
        error: splitsError.message ?? "정산 분배 생성에 실패했습니다.",
      };
    }
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}

/**
 * 정산 항목 삭제 Server Action (주최자 전용)
 * - 이벤트 소유권 검증
 * - expense_items DELETE (expense_splits는 CASCADE 삭제)
 */
export async function deleteExpenseItemAction(
  itemId: string,
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
    return { success: false, error: "정산 항목을 삭제할 권한이 없습니다." };
  }

  // expense_items DELETE (CASCADE로 expense_splits도 삭제됨)
  const { error: deleteError } = await supabase
    .from("expense_items")
    .delete()
    .eq("id", itemId)
    .eq("event_id", eventId);

  if (deleteError) {
    return {
      success: false,
      error: deleteError.message ?? "정산 항목 삭제에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}
