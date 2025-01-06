"use client";
import { trpc } from "@/__rpc/react";
import Link from "next/link";
import type React from "react";
import { UserTooltip } from "./user-tooltip";

interface UserLinkWithTooltipProps extends React.PropsWithChildren {
  username: string;
}

export const UserLinkWithTooltip = ({
  username,
  children,
}: UserLinkWithTooltipProps) => {
  const { data } = trpc.users.getUserByUsername.useQuery(
    { username },
    {
      throwOnError: false,
      staleTime: Number.POSITIVE_INFINITY,
      retry(failureCount, error) {
        if (error.data && error.data.code === "NOT_FOUND") {
          return false;
        }
        return failureCount < 3;
      },
    }
  );

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }
  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
};
