"use client";
import { trpc } from "@/__rpc/react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: {
    unreadCount: number;
  };
}

export const MessagesButton = ({ initialState }: MessagesButtonProps) => {
  const { data } = trpc.stream.getStreamUnreadCount.useQuery(undefined, {
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="-right-2 -top-2 absolute rounded-full bg-primary px-1 font-medium text-primary-foreground text-xs tabular-nums">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};
