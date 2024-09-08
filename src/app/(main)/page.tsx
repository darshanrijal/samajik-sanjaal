import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: PostDataInclude,
  });
  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </main>
  );
}
