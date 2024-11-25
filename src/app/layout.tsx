import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ViewTransitions } from "next-view-transitions";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { SessionWrapper } from "~/components/globals/session-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "stream-chat-react/dist/css/v2/index.css";

export const metadata: Metadata = {
  title: "Discover — Social Book",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SessionWrapper>
          <ViewTransitions>
            <TRPCReactProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster richColors position="top-center" />
                <NuqsAdapter>{children}</NuqsAdapter>
              </ThemeProvider>
            </TRPCReactProvider>
          </ViewTransitions>
        </SessionWrapper>
      </body>
    </html>
  );
}
