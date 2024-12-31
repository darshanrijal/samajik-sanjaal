import { getCurrentSession } from "@/auth";
import { PostEditor } from "@/components/posts/editor/post-editor";
import { Post } from "@/components/posts/post";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { db } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postDataInclude,
  });
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  );
}
