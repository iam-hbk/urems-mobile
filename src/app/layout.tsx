import type { Metadata } from "next";
import { Urbanist as FontSans } from "next/font/google";
import "./globals.css";
import "./print.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

import AppBreadcrumbs from "@/components/app-breadcrumbs";
import QueryClientWrapper from "@/lib/react-query-client";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";

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
          fontSans.variable,
        )}
      >
        <QueryClientWrapper>
          <GoogleMapsProvider 
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            libraries={["places"]}
          >
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
                  <SidebarTrigger className="-ml-1 h-4 w-4 text-gray-500" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <AppBreadcrumbs />
                </header>
                <div className="flex flex-1 flex-col">{children}</div>
              </SidebarInset>
            </SidebarProvider>

            <Toaster richColors position="top-right" />
          </GoogleMapsProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
