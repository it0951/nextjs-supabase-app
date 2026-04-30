import { describe, it, expect } from "vitest";
import type { ActionResult } from "@/lib/types";

describe("ActionResult 타입 검증", () => {
  it("성공 결과 - void 타입", () => {
    const result: ActionResult = { success: true, data: undefined };
    expect(result.success).toBe(true);
  });

  it("성공 결과 - 문자열 데이터", () => {
    const result: ActionResult<string> = { success: true, data: "hello" };
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("실패 결과 - 에러 메시지", () => {
    const result: ActionResult = { success: false, error: "에러 발생" };
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("에러 발생");
    }
  });
});
