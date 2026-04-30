"use client";

import { Copy, Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InviteLinkCardProps {
  /** 서버에서 생성된 초대 링크 URL */
  inviteUrl: string;
}

/**
 * 초대 링크 카드 컴포넌트 (Client Component)
 * - 서버에서 생성된 inviteUrl을 props로 받아 표시
 * - 클립보드 복사 기능 제공
 */
export function InviteLinkCard({ inviteUrl }: InviteLinkCardProps) {
  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("초대 링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">초대 링크</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 링크 URL 표시 */}
        <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
          <Link className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="flex-1 truncate text-xs text-muted-foreground">
            {inviteUrl}
          </p>
        </div>

        {/* 링크 복사 버튼 */}
        <Button
          variant="outline"
          className="h-10 w-full"
          onClick={handleCopyInviteLink}
        >
          <Copy className="mr-2 h-4 w-4" />
          링크 복사
        </Button>
      </CardContent>
    </Card>
  );
}
