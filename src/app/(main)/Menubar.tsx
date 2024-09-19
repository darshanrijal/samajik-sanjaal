import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bell, Bookmark, HomeIcon, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import NotificationsButton from "./NotificationsButton";
import streamServerChat from "@/lib/stream";
import MessagesButton from "./MessagesButton";

const Menubar = async ({ className }: { className?: string }) => {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const [unreadNotificationCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerChat.getUnreadCount(user.id)).total_unread_count,
  ]);
  return (
    <div className={className}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href={`/`}>
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href={`/bookmarks`}>
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default Menubar;
