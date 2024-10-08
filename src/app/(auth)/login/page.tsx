import { Metadata } from "next";
import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
import Image from "next/image";
import GoogleSignInButton from "./GoogleSignInButton";
import GithubSignInButton from "./GithubSigninButton";

export const metadata: Metadata = {
  title: "Login",
};

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Login to bugbook</h1>
          <div className="space-y-5">
            <GoogleSignInButton />
            <GithubSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link
              href={"/signup"}
              className="block text-center underline-offset-2 hover:underline"
            >
              Don&apos;t have an account?
            </Link>
          </div>
        </div>
        <Image
          src={"/assets/login-image.jpg"}
          alt="login"
          height={1000}
          width={1000}
          priority
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
