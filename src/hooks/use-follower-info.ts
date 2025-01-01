import { trpc } from "@/__rpc/react";
import type { FollowerInfo } from "@/lib/types";

export function useFollowerInfo(userId: string, initialState: FollowerInfo) {
  const query = trpc.users.getFollowerInfo.useQuery(
    { userId },
    {
      initialData: initialState,
      staleTime: Number.POSITIVE_INFINITY,
    }
  );
  return query;
}
