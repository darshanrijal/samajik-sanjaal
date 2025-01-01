import { Skeleton } from "../ui/skeleton";

export const PostsLoadingSkeleton = () => {
  return (
    <div className="space-y-5">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
};

function PostLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full bg-muted" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded bg-muted" />
          <Skeleton className="h-4 w-20 rounded bg-muted" />
        </div>
      </div>
      <Skeleton className="h-16 rounded bg-muted" />
    </div>
  );
}
