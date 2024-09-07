import { buttonVariants } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Signup to Bugbook</h1>
            <p className="text-muted-foreground">
              Typical <span className="italic">social media</span> app
            </p>
          </div>
          <div className="space-y-5">
            <SignupForm />
            <Link
              href={"/login"}
              className="block text-center underline-offset-2 hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </div>
        <Image
          src={"/assets/signup-image.jpg"}
          height={1000}
          width={1000}
          alt="signup"
          priority
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
