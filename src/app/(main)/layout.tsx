import { TRPCReactProvider } from "@/__rpc/react";
import { getCurrentSession } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "./navbar";
import { SessionProvider } from "./session-provider";

export default async function MainLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session.user) {
    redirect("/login");
  }
  return (
    <SessionProvider session={session}>
      <TRPCReactProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="mx-auto max-w-7xl p-5">{children}</div>
        </div>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
