import { z } from "zod";

/**
 * 이벤트 생성 폼 Zod 스키마
 * - invite_token은 DB에서 gen_random_bytes()로 자동 생성하므로 미포함
 * - max_participants: 빈 문자열 허용 → null 처리는 Server Action에서 담당
 */
export const createEventSchema = z.object({
  title: z.string().min(1, "이벤트 제목을 입력해주세요"),
  date: z.string().min(1, "날짜를 선택해주세요"),
  location: z.string().min(1, "장소를 입력해주세요"),
  max_participants: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === "" ||
        (Number.isInteger(Number(val)) && Number(val) > 0),
      "1 이상의 정수를 입력해주세요"
    ),
  description: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * 이벤트 수정 폼 Zod 스키마 (생성과 동일)
 */
export const updateEventSchema = createEventSchema;

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
