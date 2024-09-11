import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 *
 * @param userId the user id to follow
 * @param initialState initial data of user, contains isFollowedByUser and the user's total followers
 * @returns useQuery hook to get the user info
 */
export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers `).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
