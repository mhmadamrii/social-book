import { Navbar } from "~/components/globals/navbar";
import { LeftBar } from "./_components/left-bar";
import { RightBar } from "./_components/right-bar";
import { MobileNav } from "~/components/globals/mobile-nav";
import { Suspense } from "react";
import { SplashScreen } from "~/components/globals/splash-screen";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 pt-5">
          <LeftBar />
          {children}
          <RightBar />
        </div>
        <MobileNav />
      </div>
    </Suspense>
  );
}
