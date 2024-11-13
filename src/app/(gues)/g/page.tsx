import Link from "next/link";

export default function Guest() {
  return (
    <section className="flex h-screen w-full items-center justify-center">
      <Link className="font-bold" href="/login">
        Login
      </Link>
    </section>
  );
}
