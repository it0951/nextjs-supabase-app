import { describe, it, expect } from "vitest";
import { createExpenseItemSchema } from "@/lib/schemas/expense";

describe("createExpenseItemSchema - 정산 항목 생성 Zod 스키마 검증", () => {
  /**
   * 유효한 title과 amount 전달 시 통과
   */
  it("유효한 title과 amount → 통과", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "식사비",
      amount: "50000",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("식사비");
      expect(result.data.amount).toBe("50000");
    }
  });

  /**
   * amount가 1인 경우 통과 (최솟값)
   */
  it("amount '1' → 통과 (최솟값)", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "최소 항목",
      amount: "1",
    });
    expect(result.success).toBe(true);
  });

  /**
   * title이 빈 문자열인 경우 에러
   */
  it("title 빈 문자열 → 에러", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "",
      amount: "10000",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
    }
  });

  /**
   * amount가 빈 문자열인 경우 에러
   */
  it("amount 빈 문자열 → 에러", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "항목명",
      amount: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("amount");
    }
  });

  /**
   * amount가 0인 경우 에러 (1 이상이어야 함)
   */
  it("amount '0' → 에러 (1 이상이어야 함)", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "항목명",
      amount: "0",
    });
    expect(result.success).toBe(false);
  });

  /**
   * amount가 음수인 경우 에러
   */
  it("amount 음수('-100') → 에러", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "항목명",
      amount: "-100",
    });
    expect(result.success).toBe(false);
  });

  /**
   * amount가 소수인 경우 에러 (정수만 허용)
   */
  it("amount 소수('1000.5') → 에러 (정수 아님)", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "항목명",
      amount: "1000.5",
    });
    expect(result.success).toBe(false);
  });

  /**
   * amount가 숫자 문자열이 아닌 경우 에러
   */
  it("amount 문자열('abc') → 에러 (숫자 아님)", () => {
    const result = createExpenseItemSchema.safeParse({
      title: "항목명",
      amount: "abc",
    });
    expect(result.success).toBe(false);
  });

  /**
   * title 누락 시 에러
   */
  it("title 누락 → 에러", () => {
    const result = createExpenseItemSchema.safeParse({
      amount: "10000",
    });
    expect(result.success).toBe(false);
  });
});
