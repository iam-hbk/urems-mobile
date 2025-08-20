"use client";
import StepperView from "@/components/stepper-view";
import { useStore } from "@/lib/store";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import QuickLinks from "@/components/quick-links";
import { Eye, EyeOffIcon, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssessmentToolsSummary from "@/components/assessment-tools-summary";
import { CommandPalette } from "@/components/command-palette";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotesDialog from "@/components/the-prf-form/notes-dialog";

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
  // State to control the popover open/close
  const [popoverOpen, setPopoverOpen] = useState(false);

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

        <div className="flex w-full items-center justify-between">
          {/* <div className="flex flex-row items-center gap-1">
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
          </div> */}

          <div className="mt-[1rem] flex items-center gap-2 sm:mt-[0rem]">
            {/* Desktop view */}
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant={"outline"}
                onClick={() => setShowQuickLinks(!showQuickLinks)}
              >
                {showQuickLinks ? (
                  <>
                    <EyeOffIcon size={20} />
                    <span className="ml-[0.5rem]">Hide Links</span>
                  </>
                ) : (
                  <>
                    <Eye size={20} />
                    <span className="ml-[0.5rem]">Show Links</span>
                  </>
                )}
              </Button>
              <Button
                variant={"outline"}
                onClick={() => setShowCommandPalette(true)}
              >
                <Search size={20} />
                <span className="ml-[0.5rem]">Search (⌘K)</span>
              </Button>

              {!!prf && (
                <StepperView
                  prf={prf}
                  triggerTitle="View Progress"
                ></StepperView>
              )}
            </div>

            {/* Mobile view */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild className="sm:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="flex flex-col gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setShowQuickLinks(!showQuickLinks);
                      setPopoverOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    {showQuickLinks ? (
                      <>
                        <EyeOffIcon size={20} />
                        <span className="ml-2">Hide Links</span>
                      </>
                    ) : (
                      <>
                        <Eye size={20} />
                        <span className="ml-2">Show Links</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setShowCommandPalette(true);
                      setPopoverOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Search size={20} />
                    <span className="ml-2">Search (⌘K)</span>
                  </Button>

                  {!!prf && (
                    <StepperView
                      prf={prf}
                      triggerTitle="View Progress"
                    ></StepperView>
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
      <NotesDialog />
      {prf && <AssessmentToolsSummary prf={prf} />}
    </div>
  );
}

export default Layout;
