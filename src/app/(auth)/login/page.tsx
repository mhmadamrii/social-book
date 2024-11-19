// import { Link } from "next-view-transitions";
import Image from "next/image";

import { Link } from "next-view-transitions";
import { FormLogin } from "../_components/form-login";
import { DiscordButton } from "../_components/discord-button";

export default async function Login() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card bg-slate-900 shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">
            Login to{" "}
            <span className="font-bold text-blue-500">Social Book</span>
          </h1>
          <div className="space-y-5">
            <DiscordButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <FormLogin />
            <Link
              href="/register"
              className="block text-center hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src="/login-image.jpg"
          alt="login image"
          width={1000}
          height={1000}
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
