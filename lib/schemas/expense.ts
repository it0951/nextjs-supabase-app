import { z } from "zod";

/**
 * 정산 항목 생성 폼 Zod 스키마
 * - title: 항목명 (1자 이상)
 * - amount: 총 금액 (string으로 수신, 1 이상 정수)
 */
export const createExpenseItemSchema = z.object({
  title: z.string().min(1, "항목명을 입력해주세요."),
  amount: z
    .string()
    .min(1, "금액을 입력해주세요.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1,
      "금액은 1원 이상이어야 합니다."
    )
    .refine((v) => Number.isInteger(Number(v)), "금액은 정수로 입력해주세요."),
});

export type CreateExpenseItemInput = z.infer<typeof createExpenseItemSchema>;
