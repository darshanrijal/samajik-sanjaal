import { getCurrentSession } from "@/auth";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { redirect } from "next/navigation";
import { NotificationsPage } from "./notifications-page";

export const metadata = {
  title: "Notifications",
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
          <h1 className="text-center font-bold text-2xl">Notifications</h1>
        </div>
        <NotificationsPage />
      </div>
      <TrendsSidebar />
    </main>
  );
}
