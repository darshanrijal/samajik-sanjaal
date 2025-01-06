import { getCurrentSession } from "@/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Chat } from "./chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }
  return <Chat />;
}
