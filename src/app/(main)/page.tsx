import { getCurrentSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }
  return <p>Hello world</p>;
}
