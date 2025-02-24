"use client";
import StepperView from "@/components/stepper-view";
import { useStore } from "@/lib/store";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Script from "next/script";
import QuickLinks from "@/components/quick-links";
import { Eye, EyeOffIcon, Notebook, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssessmentToolsSummary from "@/components/assessment-tools-summary";
import { CommandPalette } from "@/components/command-palette";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const path_blocks = pathname.split("/");
  const prf = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == path_blocks[2],
  );
  // Put join index 1 and 2
  path_blocks[1] = path_blocks[1] + "/" + path_blocks[2];
  //Remove index 2
  path_blocks.splice(2, 1);
  // to toggle the quick links
  const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  return (
    <div className="flex w-full flex-col items-center overflow-auto">
      {/* Command Palette */}
      <CommandPalette 
        prf={prf} 
        open={showCommandPalette} 
        onOpenChange={setShowCommandPalette} 
      />

      {/* Header */}
      <div className="sticky top-2 z-10 m-2 flex w-11/12 flex-col items-center justify-between space-y-2 rounded-lg p-2 shadow shadow-slate-200 backdrop-blur">
        {/* showQuickLinks - to show the quick links components */}
        {prf && showQuickLinks && <QuickLinks prf={prf} />}

        <div className="flex w-full flex-col justify-between sm:flex-row">
          <div className="flex flex-row items-center gap-1">
            {path_blocks.map((block, index) => {
              if (index == 0) {
                return (
                  <Link key={index} href={`/`}>
                    <Badge className="rounded-md bg-slate-500">Home</Badge>
                  </Link>
                );
              }
              return (
                <Link key={index} href={index == 1 ? `/${block}` : `${block}`}>
                  <Badge className="rounded-md bg-slate-500 capitalize">
                    / {block}
                  </Badge>
                </Link>
              );
            })}
          </div>

          {/* left side of the components */}
          <div className="mt-[1rem] flex items-center sm:mt-[0rem]">
            {/* Command palette button */}
            <Button
              className="mr-[0.5rem] flex items-center text-[0.89rem]"
              onClick={() => setShowCommandPalette(true)}
            >
              <Search size={20} />
              <span className="ml-[0.5rem]">Search (⌘K)</span>
            </Button>

            {/* toogle between showing the quicks links and not, to provider user with more view */}
            <Button
              className="mr-[0.5rem] flex items-center text-[0.89rem]"
              onClick={() => setShowQuickLinks(!showQuickLinks)}
            >
              {showQuickLinks ? <EyeOffIcon size={20} /> : <Eye size={20} />}
              <span className="ml-[0.5rem]">Quick Links</span>
            </Button>
            {/*  */}
            {!!prf && (
              <StepperView prf={prf} triggerTitle="View Progress"></StepperView>
            )}
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="grid w-11/12 flex-grow grid-cols-1 justify-items-center">
        {children}
      </div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        async
      />
      <div className="absolute bottom-10 right-10 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <Notebook />
      </div>
      {prf && <AssessmentToolsSummary prf={prf} />}
    </div>
  );
}

export default Layout;
