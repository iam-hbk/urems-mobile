import type { Metadata } from "next";
import { Urbanist as FontSans } from "next/font/google";
import "./globals.css";
import "./print.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import QueryClientWrapper from "@/lib/react-query-client";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "UREMS - PRF",
  description: "Patient Report Form",
  // manifest: "/manifest.ts" // in public folder
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen">
            <AppSidebar />
            {/* <div className="flex-1 overflow-y-auto p-8"> */}
              <QueryClientWrapper>
                {children}
              </QueryClientWrapper>
            {/* </div> */}
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
