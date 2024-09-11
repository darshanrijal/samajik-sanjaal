import { PostData } from "@/lib/types";

declare interface ActionResult {
  error: string;
}

declare interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

declare interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
