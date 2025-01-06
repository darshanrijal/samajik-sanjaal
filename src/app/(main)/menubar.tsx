import { api } from "@/__rpc/server";
import { getCurrentSession } from "@/auth";
import { Button } from "@/components/ui/button";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import { MessagesButton } from "./messages-button";
import { NotificationsButton } from "./notifications-button";

interface MenuBarProps {
  className?: string;
}

export const MenuBar = async ({ className }: MenuBarProps) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    api.notifications.getUnreadCount(),
    api.stream.getStreamUnreadCount(),
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton initialState={unreadNotificationsCount} />
      <MessagesButton initialState={unreadMessagesCount} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};
