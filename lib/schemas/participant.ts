import { z } from "zod";

/**
 * 참여자 등록 폼 Zod 스키마
 * - 이름: 1~50자
 * - 연락처: 010-XXXX-XXXX 형식 필수
 */
export const registerParticipantSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .max(50, "이름은 50자 이하로 입력해주세요."),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, "010-0000-0000 형식으로 입력해주세요."),
});

export type RegisterParticipantInput = z.infer<
  typeof registerParticipantSchema
>;
