"use client";
import { SearchIcon } from "lucide-react";
import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { Input } from "./ui/input";

export const SearchField = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString().trim();
    if (!q) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }
  return (
    <Form onSubmit={handleSubmit} action="/search">
      <div className="relative">
        <Input
          name="q"
          placeholder="Search"
          className="bg-secondary pe-10"
          defaultValue={searchParams.get("q") || undefined}
        />
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 right-3 size-5 transform text-muted-foreground" />
      </div>
    </Form>
  );
};
