import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await validateRequest();
  if (!session.user) {
    redirect("/login");
  }
  return <>{children}</>;
}
