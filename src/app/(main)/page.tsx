import { getCurrentSession } from "@/auth";
import { PostEditor } from "@/components/posts/editor/post-editor";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }
  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0">
        <PostEditor />
      </div>
    </main>
  );
}
