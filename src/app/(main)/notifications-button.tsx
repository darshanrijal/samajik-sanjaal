"use client";

import { trpc } from "@/__rpc/react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationsButtonProps {
  initialState: {
    unreadCount: number;
  };
}

export const NotificationsButton = ({
  initialState,
}: NotificationsButtonProps) => {
  const { data } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    staleTime: 0.25,
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="-right-2 -top-2 absolute rounded-full bg-primary px-1 font-medium text-primary-foreground text-xs tabular-nums">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
};
