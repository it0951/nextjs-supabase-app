"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { announcementSchema } from "@/lib/schemas/announcement";
import type { ActionResult } from "@/lib/types";

/**
 * 이벤트 소유권 확인 헬퍼 함수
 * - 현재 유저가 해당 이벤트의 owner인지 검증
 */
async function verifyEventOwnership(
  eventId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();
  return data?.owner_id === userId;
}

/**
 * 공지사항 생성 Server Action
 * - 이벤트 소유권 확인 → Zod 검증 → Supabase insert
 */
export async function createAnnouncementAction(
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
  const isOwner = await verifyEventOwnership(eventId, user.id);
  if (!isOwner) {
    return { success: false, error: "이벤트를 관리할 권한이 없습니다." };
  }

  // FormData 파싱 후 Zod 검증
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const parsed = announcementSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "입력값을 확인해주세요.",
    };
  }

  // Supabase에 공지사항 저장
  const { error } = await supabase.from("announcements").insert({
    event_id: eventId,
    title: parsed.data.title,
    content: parsed.data.content,
  });

  if (error) {
    return {
      success: false,
      error: error.message ?? "공지 등록에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}

/**
 * 공지사항 수정 Server Action
 * - 이벤트 소유권 확인 → Zod 검증 → Supabase update
 */
export async function updateAnnouncementAction(
  announcementId: string,
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
  const isOwner = await verifyEventOwnership(eventId, user.id);
  if (!isOwner) {
    return { success: false, error: "공지를 수정할 권한이 없습니다." };
  }

  // FormData 파싱 후 Zod 검증
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const parsed = announcementSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "입력값을 확인해주세요.",
    };
  }

  // Supabase 공지사항 업데이트
  const { error } = await supabase
    .from("announcements")
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
    })
    .eq("id", announcementId)
    .eq("event_id", eventId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "공지 수정에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}

/**
 * 공지사항 삭제 Server Action
 * - 이벤트 소유권 확인 → Supabase delete
 */
export async function deleteAnnouncementAction(
  announcementId: string,
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
  const isOwner = await verifyEventOwnership(eventId, user.id);
  if (!isOwner) {
    return { success: false, error: "공지를 삭제할 권한이 없습니다." };
  }

  // Supabase 공지사항 삭제
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId)
    .eq("event_id", eventId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "공지 삭제에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, data: undefined };
}
