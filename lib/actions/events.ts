"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createEventSchema, updateEventSchema } from "@/lib/schemas/event";
import type { ActionResult } from "@/lib/types";

/**
 * 이벤트 생성 Server Action
 * - 로그인 유저 확인 → Zod 검증 → Supabase insert → 이벤트 상세 리다이렉트
 * - invite_token은 DB에서 자동 생성되므로 INSERT 페이로드에 미포함
 */
export async function createEventAction(
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

  // FormData → 객체로 변환 후 Zod 검증
  const rawData = {
    title: formData.get("title") as string,
    date: formData.get("date") as string,
    location: formData.get("location") as string,
    max_participants: (formData.get("max_participants") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = createEventSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "입력값을 확인해주세요.",
    };
  }

  // max_participants 문자열 → 숫자 또는 null 변환
  const maxParticipants =
    parsed.data.max_participants && parsed.data.max_participants !== ""
      ? Number(parsed.data.max_participants)
      : null;

  // Supabase에 이벤트 저장 (invite_token은 DB 자동 생성)
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      date: parsed.data.date,
      location: parsed.data.location,
      max_participants: maxParticipants,
      description: parsed.data.description ?? null,
    })
    .select()
    .single();

  if (error || !event) {
    return {
      success: false,
      error: error?.message ?? "이벤트 생성에 실패했습니다.",
    };
  }

  revalidatePath("/dashboard");
  redirect(`/events/${event.id}`);
}

/**
 * 이벤트 수정 Server Action
 * - owner_id 이중 검증 (DB RLS + Server Action)
 */
export async function updateEventAction(
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

  // owner_id 이중 검증
  const { data: existingEvent } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (!existingEvent || existingEvent.owner_id !== user.id) {
    return { success: false, error: "이벤트를 수정할 권한이 없습니다." };
  }

  // FormData → 객체로 변환 후 Zod 검증
  const rawData = {
    title: formData.get("title") as string,
    date: formData.get("date") as string,
    location: formData.get("location") as string,
    max_participants: (formData.get("max_participants") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = updateEventSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "입력값을 확인해주세요.",
    };
  }

  // max_participants 문자열 → 숫자 또는 null 변환
  const maxParticipants =
    parsed.data.max_participants && parsed.data.max_participants !== ""
      ? Number(parsed.data.max_participants)
      : null;

  // Supabase 이벤트 업데이트
  const { error } = await supabase
    .from("events")
    .update({
      title: parsed.data.title,
      date: parsed.data.date,
      location: parsed.data.location,
      max_participants: maxParticipants,
      description: parsed.data.description ?? null,
    })
    .eq("id", eventId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "이벤트 수정에 실패했습니다.",
    };
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");

  return { success: true, data: undefined };
}

/**
 * 이벤트 삭제 Server Action
 * - owner_id 이중 검증 (DB RLS + Server Action)
 */
export async function deleteEventAction(
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

  // owner_id 이중 검증
  const { data: existingEvent } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (!existingEvent || existingEvent.owner_id !== user.id) {
    return { success: false, error: "이벤트를 삭제할 권한이 없습니다." };
  }

  // Supabase에서 이벤트 삭제
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "이벤트 삭제에 실패했습니다.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
