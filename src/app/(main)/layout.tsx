import { Navbar } from "~/components/globals/navbar";
import { LeftBar } from "./_components/left-bar";
import { RightBar } from "./_components/right-bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
        <LeftBar />
        {children}
        <RightBar />
      </div>
    </div>
  );
}
