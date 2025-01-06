import { getCurrentSession } from "@/auth";
import { TrendsSidebar } from "@/components/trends-sidebar";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SearchPage } from "./search-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const { q } = await searchParams;

  if (!q) {
    notFound();
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center font-bold text-2xl">
            Search Results for "{q}"
          </h1>
        </div>
        <SearchPage q={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  if (!q) {
    return {};
  }

  return {
    title: `Search results for "${q}"`,
  };
}
