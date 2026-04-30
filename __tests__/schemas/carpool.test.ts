import { describe, it, expect } from "vitest";
import { createCarpoolGroupSchema } from "@/lib/schemas/carpool";

describe("createCarpoolGroupSchema - 카풀 그룹 생성 Zod 스키마 검증", () => {
  /**
   * 유효한 드라이버 ID와 capacity 전달 시 통과
   */
  it("유효한 driver_participant_id와 capacity 2 → 통과", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "uuid-1234",
      capacity: 2,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.capacity).toBe(2);
    }
  });

  /**
   * capacity 15(최대) 전달 시 통과
   */
  it("capacity 15(최대) → 통과", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "uuid-1234",
      capacity: 15,
    });
    expect(result.success).toBe(true);
  });

  /**
   * 선택적 name 포함 시 통과
   */
  it("선택적 name 포함 → 통과", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "uuid-5678",
      capacity: 4,
      name: "서울팀 카풀",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("서울팀 카풀");
    }
  });

  /**
   * driver_participant_id가 빈 문자열인 경우 에러
   */
  it("driver_participant_id 빈 문자열 → 에러", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "",
      capacity: 4,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("driver_participant_id");
    }
  });

  /**
   * capacity가 1인 경우 에러 (최소 2 이상)
   */
  it("capacity 1 → 에러 (최소 2)", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "uuid-1234",
      capacity: 1,
    });
    expect(result.success).toBe(false);
  });

  /**
   * capacity가 16인 경우 에러 (최대 15 이하)
   */
  it("capacity 16 → 에러 (최대 15)", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "uuid-1234",
      capacity: 16,
    });
    expect(result.success).toBe(false);
  });

  /**
   * capacity가 소수인 경우 에러 (정수만 허용)
   */
  it("capacity 3.5 → 에러 (정수 아님)", () => {
    const result = createCarpoolGroupSchema.safeParse({
      driver_participant_id: "uuid-1234",
      capacity: 3.5,
    });
    expect(result.success).toBe(false);
  });

  /**
   * driver_participant_id 누락 시 에러
   */
  it("driver_participant_id 누락 → 에러", () => {
    const result = createCarpoolGroupSchema.safeParse({
      capacity: 4,
    });
    expect(result.success).toBe(false);
  });
});
