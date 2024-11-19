import { Link } from "next-view-transitions";
import Image from "next/image";

import { FormRegister } from "../_components/form-register";

export default async function Register() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card bg-slate-900 shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">
              Sign up to{" "}
              <span className="font-bold text-blue-500">Social Book</span>
            </h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-5">
            <FormRegister />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src="/signup-image.jpg"
          alt="Sign up image"
          width={1000}
          height={1000}
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
