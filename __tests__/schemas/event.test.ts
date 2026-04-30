import { describe, it, expect } from "vitest";
import { createEventSchema } from "@/lib/schemas/event";

describe("createEventSchema - 이벤트 생성 Zod 스키마 검증", () => {
  /**
   * 유효한 필수 데이터만 있는 경우 통과
   */
  it("유효한 필수 데이터만 전달 시 통과", () => {
    const result = createEventSchema.safeParse({
      title: "봄 야유회",
      date: "2025-06-01",
      location: "경기도 가평",
    });
    expect(result.success).toBe(true);
  });

  /**
   * 유효한 전체 데이터(옵션 포함)인 경우 통과
   */
  it("유효한 전체 데이터 전달 시 통과", () => {
    const result = createEventSchema.safeParse({
      title: "2025 여름 캠핑",
      date: "2025-08-15",
      location: "강원도 화천 캠핑장",
      max_participants: "30",
      description: "여름 캠핑 모임입니다.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("2025 여름 캠핑");
    }
  });

  /**
   * title이 빈 문자열인 경우 에러 반환
   */
  it("title 빈 문자열 → 에러", () => {
    const result = createEventSchema.safeParse({
      title: "",
      date: "2025-06-01",
      location: "서울",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
    }
  });

  /**
   * date가 빈 문자열인 경우 에러 반환
   */
  it("date 빈 문자열 → 에러", () => {
    const result = createEventSchema.safeParse({
      title: "이벤트",
      date: "",
      location: "서울",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("date");
    }
  });

  /**
   * location이 빈 문자열인 경우 에러 반환
   */
  it("location 빈 문자열 → 에러", () => {
    const result = createEventSchema.safeParse({
      title: "이벤트",
      date: "2025-06-01",
      location: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("location");
    }
  });

  /**
   * max_participants에 음수 문자열 전달 시 에러
   */
  it("max_participants 음수 문자열 → 에러", () => {
    const result = createEventSchema.safeParse({
      title: "이벤트",
      date: "2025-06-01",
      location: "서울",
      max_participants: "-5",
    });
    expect(result.success).toBe(false);
  });

  /**
   * max_participants가 미입력(undefined)인 경우 통과
   */
  it("max_participants 미입력(undefined) → null로 처리되며 통과", () => {
    const result = createEventSchema.safeParse({
      title: "이벤트",
      date: "2025-06-01",
      location: "서울",
      max_participants: undefined,
    });
    expect(result.success).toBe(true);
  });

  /**
   * max_participants가 빈 문자열인 경우 통과 (선택 필드)
   */
  it("max_participants 빈 문자열 → 통과 (선택 필드)", () => {
    const result = createEventSchema.safeParse({
      title: "이벤트",
      date: "2025-06-01",
      location: "서울",
      max_participants: "",
    });
    expect(result.success).toBe(true);
  });

  /**
   * description이 null/undefined인 경우 통과
   */
  it("description null/undefined → 통과 (선택 필드)", () => {
    const withNull = createEventSchema.safeParse({
      title: "이벤트",
      date: "2025-06-01",
      location: "서울",
      description: undefined,
    });
    expect(withNull.success).toBe(true);
  });

  /**
   * max_participants가 소수인 경우 에러 (정수만 허용)
   */
  it("max_participants 소수 문자열 → 에러 (정수 아님)", () => {
    const result = createEventSchema.safeParse({
      title: "이벤트",
      date: "2025-06-01",
      location: "서울",
      max_participants: "5.5",
    });
    expect(result.success).toBe(false);
  });
});
