import type { Metadata } from "next";
import { Urbanist as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NavigationBar } from "@/components/main-navigation";
import { Toaster } from "@/components/ui/sonner";
import QueryClientWrapper from "@/lib/react-query-client";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "UREMS - PRF",
  description: "Patient Report Form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <QueryClientWrapper>
          <NavigationBar>{children}</NavigationBar>
        </QueryClientWrapper>
        <Toaster richColors />
      </body>
    </html>
  );
}
