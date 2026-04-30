import { describe, it, expect } from "vitest";
import { registerParticipantSchema } from "@/lib/schemas/participant";

describe("registerParticipantSchema - 참여자 등록 Zod 스키마 검증", () => {
  /**
   * 유효한 이름과 연락처 전달 시 통과
   */
  it("유효한 이름과 연락처 → 통과", () => {
    const result = registerParticipantSchema.safeParse({
      name: "홍길동",
      phone: "010-1234-5678",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("홍길동");
      expect(result.data.phone).toBe("010-1234-5678");
    }
  });

  /**
   * 이름이 빈 문자열인 경우 에러 반환
   */
  it("이름 빈 문자열 → 에러", () => {
    const result = registerParticipantSchema.safeParse({
      name: "",
      phone: "010-1234-5678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("name");
    }
  });

  /**
   * 이름이 50자 초과인 경우 에러 반환
   */
  it("이름 51자 → 에러 (최대 50자)", () => {
    const result = registerParticipantSchema.safeParse({
      name: "가".repeat(51),
      phone: "010-1234-5678",
    });
    expect(result.success).toBe(false);
  });

  /**
   * 이름이 50자인 경우 통과
   */
  it("이름 50자 → 통과", () => {
    const result = registerParticipantSchema.safeParse({
      name: "가".repeat(50),
      phone: "010-1234-5678",
    });
    expect(result.success).toBe(true);
  });

  /**
   * 하이픈 없는 연락처 → 에러
   */
  it("하이픈 없는 연락처(01012345678) → 에러", () => {
    const result = registerParticipantSchema.safeParse({
      name: "홍길동",
      phone: "01012345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("phone");
    }
  });

  /**
   * 010이 아닌 번호 형식 → 에러
   */
  it("010 외 번호(011-1234-5678) → 에러", () => {
    const result = registerParticipantSchema.safeParse({
      name: "홍길동",
      phone: "011-1234-5678",
    });
    expect(result.success).toBe(false);
  });

  /**
   * 자릿수가 맞지 않는 경우 → 에러
   */
  it("자릿수 불일치(010-123-5678) → 에러", () => {
    const result = registerParticipantSchema.safeParse({
      name: "홍길동",
      phone: "010-123-5678",
    });
    expect(result.success).toBe(false);
  });

  /**
   * 연락처가 빈 문자열인 경우 에러 반환
   */
  it("연락처 빈 문자열 → 에러", () => {
    const result = registerParticipantSchema.safeParse({
      name: "홍길동",
      phone: "",
    });
    expect(result.success).toBe(false);
  });

  /**
   * 연락처 누락 시 에러
   */
  it("연락처 필드 누락 → 에러", () => {
    const result = registerParticipantSchema.safeParse({
      name: "홍길동",
    });
    expect(result.success).toBe(false);
  });
});
