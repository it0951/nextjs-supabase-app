"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Megaphone, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { mockAnnouncements } from "@/lib/mock/data";
import { type Announcement } from "@/lib/mock/types";

// ─────────────────────────────────────────
// 폼 유효성 검증 스키마 (zod v4)
// ─────────────────────────────────────────
const announcementSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface AnnouncementTabProps {
  /** 이벤트 ID */
  eventId: string;
}

/**
 * 공지 탭 컴포넌트
 * - 공지사항 목록 표시 (카드 형태)
 * - 공지 작성/수정 다이얼로그
 * - 공지 삭제 확인 다이얼로그
 */
export function AnnouncementTab({ eventId }: AnnouncementTabProps) {
  // mock data에서 해당 이벤트의 공지사항 초기값 설정
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    mockAnnouncements.filter((a) => a.eventId === eventId)
  );

  // 작성/수정 다이얼로그 상태
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  // 현재 수정 중인 공지 (null이면 새 공지 작성)
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  // 삭제 확인 다이얼로그 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // 삭제 대상 공지 ID
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // react-hook-form 설정
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "" },
  });

  // 공지 작성 버튼 클릭 핸들러
  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    form.reset({ title: "", content: "" });
    setIsFormDialogOpen(true);
  };

  // 공지 수정 버튼 클릭 핸들러
  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.reset({ title: announcement.title, content: announcement.content });
    setIsFormDialogOpen(true);
  };

  // 폼 제출 핸들러 (작성 및 수정 공통)
  const handleSubmit = (values: AnnouncementFormValues) => {
    if (editingAnnouncement) {
      // 수정 처리
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id
            ? { ...a, title: values.title, content: values.content }
            : a
        )
      );
      toast.success("공지가 수정되었습니다.");
    } else {
      // 새 공지 추가
      const newAnnouncement: Announcement = {
        id: crypto.randomUUID(),
        eventId,
        title: values.title,
        content: values.content,
        createdAt: new Date().toISOString(),
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      toast.success("공지가 등록되었습니다.");
    }
    setIsFormDialogOpen(false);
    form.reset();
  };

  // 삭제 버튼 클릭 핸들러 (확인 다이얼로그 열기)
  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 삭제 확인 핸들러
  const handleConfirmDelete = () => {
    if (!deletingId) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== deletingId));
    toast.success("공지가 삭제되었습니다.");
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {/* 탭 상단: 제목 + 공지 작성 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {announcements.length}개의 공지
        </p>
        <Button size="sm" onClick={handleOpenCreate}>
          공지 작성
        </Button>
      </div>

      {/* 공지사항 목록 */}
      {announcements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-full w-full" />}
          title="등록된 공지가 없습니다"
          description="공지 작성 버튼을 눌러 첫 공지를 등록하세요."
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-snug">
                    {announcement.title}
                  </CardTitle>
                  {/* 수정/삭제 드롭다운 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        aria-label="공지 관리"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenEdit(announcement)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleOpenDelete(announcement.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* 공지 내용 */}
                <p className="text-sm leading-relaxed text-foreground">
                  {announcement.content}
                </p>
                {/* 날짜 */}
                <p className="text-xs text-muted-foreground">
                  {new Date(announcement.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 공지 작성/수정 다이얼로그 */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? "공지 수정" : "공지 작성"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* 제목 필드 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="공지 제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 내용 필드 */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>내용</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="공지 내용을 입력하세요"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormDialogOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>공지 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            이 공지를 삭제하시겠습니까? 삭제된 공지는 복구할 수 없습니다.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
