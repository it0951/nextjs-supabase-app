"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
  updateAnnouncementAction,
} from "@/lib/actions/announcements";
import {
  announcementSchema,
  type AnnouncementInput,
} from "@/lib/schemas/announcement";
import type { ActionResult } from "@/lib/types";
import type { Announcement } from "@/types/supabase";

// ─────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────
interface AnnouncementTabProps {
  /** 이벤트 ID */
  eventId: string;
  /** 서버에서 전달받은 초기 공지 목록 */
  initialAnnouncements: Announcement[];
}

const initialCreateState: ActionResult = { success: false, error: "" };

/**
 * 공지 탭 컴포넌트
 * - Supabase Server Action 기반 CRUD
 * - 공지 목록은 서버에서 초기 전달받고, CRUD 후 router.refresh()로 최신화
 */
export function AnnouncementTab({
  eventId,
  initialAnnouncements,
}: AnnouncementTabProps) {
  const router = useRouter();

  // 작성 다이얼로그 상태
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  // 수정 중인 공지 (null이면 신규 작성)
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  // 삭제 확인 다이얼로그 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  // 신규 공지 작성용 Server Action (eventId bind)
  const boundCreateAction = createAnnouncementAction.bind(null, eventId);
  const [createState, createFormAction, isCreatePending] = useActionState(
    boundCreateAction,
    initialCreateState
  );

  // 수정용 Server Action (announcementId + eventId bind)
  const [editState, setEditState] = useState<ActionResult>(initialCreateState);
  const [isEditPending, startEditTransition] = useTransition();

  // 수정 폼
  const form = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "" },
  });

  // 신규 작성 성공/실패 처리
  const prevCreateStateRef = useRef<ActionResult | null>(null);
  useEffect(() => {
    if (!createState || createState === prevCreateStateRef.current) return;
    prevCreateStateRef.current = createState;

    if (createState.success) {
      toast.success("공지가 등록되었습니다.");
      queueMicrotask(() => {
        setIsFormDialogOpen(false);
        router.refresh();
      });
    } else if (createState.error) {
      form.setError("root", { message: createState.error });
    }
  }, [createState, form, router]);

  // 수정 성공/실패 처리
  const prevEditStateRef = useRef<ActionResult | null>(null);
  useEffect(() => {
    if (!editState || editState === prevEditStateRef.current) return;
    prevEditStateRef.current = editState;

    if (editState.success) {
      toast.success("공지가 수정되었습니다.");
      queueMicrotask(() => {
        setIsFormDialogOpen(false);
        router.refresh();
      });
    } else if (editState.error) {
      form.setError("root", { message: editState.error });
    }
  }, [editState, form, router]);

  // 공지 작성 버튼 클릭 핸들러
  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    form.reset({ title: "", content: "" });
    form.clearErrors();
    setIsFormDialogOpen(true);
  };

  // 공지 수정 버튼 클릭 핸들러
  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.reset({ title: announcement.title, content: announcement.content });
    form.clearErrors();
    setIsFormDialogOpen(true);
  };

  // 폼 제출 핸들러 (신규/수정 분기)
  const handleFormSubmit = (formData: FormData) => {
    if (editingAnnouncement) {
      // 수정 Server Action 호출
      startEditTransition(async () => {
        const result = await updateAnnouncementAction(
          editingAnnouncement.id,
          eventId,
          editState,
          formData
        );
        setEditState(result);
      });
    }
    // 신규 작성은 form의 action으로 처리됨
  };

  // 삭제 버튼 클릭 핸들러
  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 삭제 확인 핸들러
  const handleConfirmDelete = () => {
    if (!deletingId) return;
    startDeleteTransition(async () => {
      const result = await deleteAnnouncementAction(deletingId, eventId);
      if (result.success) {
        toast.success("공지가 삭제되었습니다.");
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* 탭 상단: 공지 수 + 작성 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {initialAnnouncements.length}개의 공지
        </p>
        <Button size="sm" onClick={handleOpenCreate}>
          공지 작성
        </Button>
      </div>

      {/* 공지사항 목록 */}
      {initialAnnouncements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-full w-full" />}
          title="등록된 공지가 없습니다"
          description="공지 작성 버튼을 눌러 첫 공지를 등록하세요."
        />
      ) : (
        <div className="space-y-3">
          {initialAnnouncements.map((announcement) => (
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
                <p className="text-sm leading-relaxed text-foreground">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleDateString(
                    "ko-KR"
                  )}
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

          {/* 서버 오류 메시지 */}
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <Form {...form}>
            <form
              action={editingAnnouncement ? undefined : createFormAction}
              onSubmit={
                editingAnnouncement
                  ? (e) => {
                      e.preventDefault();
                      handleFormSubmit(new FormData(e.currentTarget));
                    }
                  : undefined
              }
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
                  disabled={isCreatePending || isEditPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatePending || isEditPending}
                >
                  {isCreatePending || isEditPending ? "저장 중..." : "저장"}
                </Button>
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
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
