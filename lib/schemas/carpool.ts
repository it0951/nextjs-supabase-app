import { z } from "zod";

/**
 * 카풀 그룹 생성 폼 Zod 스키마
 * - driver_participant_id: 드라이버 참여자 ID (필수)
 * - capacity: 총 좌석수 (드라이버 포함, 2~15)
 * - name: 그룹명 (선택)
 */
export const createCarpoolGroupSchema = z.object({
  driver_participant_id: z.string().min(1, "드라이버를 선택해주세요."),
  capacity: z
    .number()
    .int("좌석수는 정수여야 합니다.")
    .min(2, "최소 2석 이상이어야 합니다.")
    .max(15, "최대 15석까지 가능합니다."),
  name: z.string().optional(),
});

export type CreateCarpoolGroupInput = z.infer<typeof createCarpoolGroupSchema>;
