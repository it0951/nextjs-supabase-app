import { z } from "zod";

/**
 * 공지사항 작성/수정 Zod 스키마
 */
export const announcementSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(200, "제목은 200자 이내로 입력해주세요."),
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(5000, "내용은 5000자 이내로 입력해주세요."),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
