import { getCurrentSession } from "@/auth";
import { PostEditor } from "@/components/posts/editor/post-editor";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { redirect } from "next/navigation";
import { ForYouFeed } from "./for-you-feed";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
