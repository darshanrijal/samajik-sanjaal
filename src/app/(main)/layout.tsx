import { TRPCReactProvider } from "@/__rpc/react";
import { HydrateClient, api } from "@/__rpc/server";
import { getCurrentSession } from "@/auth";
import { redirect } from "next/navigation";
import { MenuBar } from "./menubar";
import { Navbar } from "./navbar";
import { SessionProvider } from "./session-provider";

export default async function MainLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session.user) {
    redirect("/login");
  }

  api.notifications.getUnreadCount.prefetch();
  api.stream.getStreamUnreadCount.prefetch();

  return (
    <SessionProvider session={session}>
      <TRPCReactProvider>
        <HydrateClient>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
              <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
              {children}
            </div>
            <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
          </div>
        </HydrateClient>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
