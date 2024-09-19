import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function GithubSignInButton() {
  return (
    <Button
      variant={"outline"}
      className="bg-white text-black hover:bg-gray-100 hover:text-black"
      asChild
    >
      <a href={"/login/github"} className="flex w-full items-center gap-2">
        <GithubLogo />
        Sign in with Github
      </a>
    </Button>
  );
}

function GithubLogo() {
  return (
    <Image
      src={"/assets/github-mark.svg"}
      height={20}
      width={20}
      alt="github"
    />
  );
}
