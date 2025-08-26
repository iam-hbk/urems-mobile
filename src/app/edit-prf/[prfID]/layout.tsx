"use client";
import StepperView from "@/components/stepper-view";
import { useStore } from "@/lib/store";
import React, { use, useState } from "react";
import { usePathname } from "next/navigation";
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
import { useGetPRFResponseMetadata } from "@/hooks/prf/usePrfForms";

type Params = Promise<{ prfID: string }>;

function Layout(props: { children: React.ReactNode; params: Params }) {
  const params = use(props.params);
  const prfID = params.prfID;
  const {
    data: prfResponseMetadata,
    isLoading,
    error,
  } = useGetPRFResponseMetadata(prfID);

  // to toggle the quick links
  const [showQuickLinks, setShowQuickLinks] = useState<boolean>(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  // State to control the popover open/close
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-center overflow-auto">
      {/* Command Palette */}
      {/* <CommandPalette
        open={showCommandPalette}
        onOpenChangeAction={setShowCommandPalette}
      /> */}

      {/* Header */}
      <div className="sticky top-2 z-10 m-2 flex w-11/12 flex-col items-center justify-between space-y-2 rounded-lg p-2 shadow shadow-slate-200 backdrop-blur">
        {/* showQuickLinks - to show the quick links components */}
        {/* {showQuickLinks && <QuickLinks />} */}

        <div className="flex w-full items-center justify-between">
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

              {/* <StepperView triggerTitle="View Progress"></StepperView> */}
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

                  {/* <StepperView triggerTitle="View Progress"></StepperView> */}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="grid w-11/12 flex-grow grid-cols-1 justify-items-center">
        {props.children}
      </div>
      <NotesDialog />
      {/* {prf && <AssessmentToolsSummary prf={prf} />} */}
    </div>
  );
}

export default Layout;
