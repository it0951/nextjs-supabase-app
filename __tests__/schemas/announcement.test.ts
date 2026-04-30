import { describe, it, expect } from "vitest";
import { announcementSchema } from "@/lib/schemas/announcement";

describe("announcementSchema - 공지사항 Zod 스키마 검증", () => {
  /**
   * 유효한 데이터 전달 시 통과
   */
  it("유효한 데이터 전달 시 통과", () => {
    const result = announcementSchema.safeParse({
      title: "중요 공지사항",
      content: "이번 모임 장소가 변경되었습니다.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("중요 공지사항");
    }
  });

  /**
   * title이 빈 문자열인 경우 에러
   */
  it("title 빈 문자열 → 에러", () => {
    const result = announcementSchema.safeParse({
      title: "",
      content: "공지 내용입니다.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
      expect(result.error.issues[0]?.message).toBe("제목을 입력해주세요.");
    }
  });

  /**
   * content가 빈 문자열인 경우 에러
   */
  it("content 빈 문자열 → 에러", () => {
    const result = announcementSchema.safeParse({
      title: "공지 제목",
      content: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("content");
      expect(result.error.issues[0]?.message).toBe("내용을 입력해주세요.");
    }
  });

  /**
   * title이 200자를 초과하는 경우 에러
   */
  it("title 200자 초과 → 에러", () => {
    const longTitle = "가".repeat(201);
    const result = announcementSchema.safeParse({
      title: longTitle,
      content: "내용",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("title");
      expect(result.error.issues[0]?.message).toContain("200자");
    }
  });

  /**
   * title이 정확히 200자인 경우 통과 (경계값)
   */
  it("title 정확히 200자 → 통과 (경계값)", () => {
    const maxTitle = "가".repeat(200);
    const result = announcementSchema.safeParse({
      title: maxTitle,
      content: "내용",
    });
    expect(result.success).toBe(true);
  });

  /**
   * content가 5000자를 초과하는 경우 에러
   */
  it("content 5000자 초과 → 에러", () => {
    const longContent = "가".repeat(5001);
    const result = announcementSchema.safeParse({
      title: "제목",
      content: longContent,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("content");
      expect(result.error.issues[0]?.message).toContain("5000자");
    }
  });

  /**
   * content가 정확히 5000자인 경우 통과 (경계값)
   */
  it("content 정확히 5000자 → 통과 (경계값)", () => {
    const maxContent = "가".repeat(5000);
    const result = announcementSchema.safeParse({
      title: "제목",
      content: maxContent,
    });
    expect(result.success).toBe(true);
  });

  /**
   * title과 content 모두 빈 문자열인 경우 에러 2개 반환
   */
  it("title, content 모두 빈 문자열 → 에러 2개 반환", () => {
    const result = announcementSchema.safeParse({
      title: "",
      content: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
    }
  });
});
