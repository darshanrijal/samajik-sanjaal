"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { FormEvent, useRef } from "react";

const SearchField = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hashtag = pathname.split("/")[2];

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string | null;
    if (!q) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q.toString())}`);
  }

  return (
    <form onSubmit={handleSearch} action={"/search"} method="GET">
      <div className="relative">
        <Input
          name="q"
          placeholder="Search someone"
          className="pe-10"
          defaultValue={
            searchParams.get("q")?.toString() ||
            (pathname.includes("/hashtag") ? `#${hashtag}` : undefined)
          }
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};

export default SearchField;
