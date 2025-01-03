"use client";

import { trpc } from "@/__rpc/react";
import { InfiniteScrollContainer } from "@/components/infinite-scroll-container";
import { PostsLoadingSkeleton } from "@/components/posts/post-loading-skeleton";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Notification } from "./notification";

export const NotificationsPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = trpc.notifications.getNotifications.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastpage) => lastpage.nextCursor,
      staleTime: 0.3,
    }
  );

  const utils = trpc.useUtils();

  const { mutate } = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getUnreadCount.setData(undefined, {
        unreadCount: 0,
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }

  if (error) {
    return (
      <p className="text-center text-destructive">
        An error occured while fetching your notifications
      </p>
    );
  }
  const notifications = data.pages.flatMap((page) => page.notifications);

  if (!notifications.length) {
    return (
      <p className="text-center text-muted-foreground">
        You dont have any notifications
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isPending && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};
