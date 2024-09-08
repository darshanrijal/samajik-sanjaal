import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";

export default async function Home() {
  return (
    <main className="h-[200vh] w-full bg-red-50">
      <div className="w-full">
        <PostEditor />
      </div>
    </main>
  );
}
