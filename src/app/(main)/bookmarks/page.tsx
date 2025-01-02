import { getCurrentSession } from "@/auth";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { redirect } from "next/navigation";
import { BookmarkPage } from "./bookmark-page";

export const metadata = {
  title: "Bookmarks",
};

export default async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center font-bold text-2xl">Bookmarks</h1>
        </div>

        <BookmarkPage />
      </div>
      <TrendsSidebar />
    </main>
  );
}
