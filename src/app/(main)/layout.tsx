import { Navbar } from "~/components/globals/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
        {children}
      </div>
    </div>
  );
}
