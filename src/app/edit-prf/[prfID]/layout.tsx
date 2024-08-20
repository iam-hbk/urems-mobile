"use client";
import { Stepper } from "@/components/stepper";
import StepperView from "@/components/stepper-view";
import { useStore } from "@/lib/store";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type Props = {};

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const form = useStore((state) => state.prfForms);
  const pathname = usePathname();
  const path_blocks =pathname.split("/");
  // Put join index 1 and 2
  path_blocks[1] = path_blocks[1] + "/" + path_blocks[2];
  //Remove index 2
  path_blocks.splice(2, 1);


  return (
    <div className="flex flex-col overflow-auto w-full items-center ">
      <div className="sticky top-2 flex-row flex  p-2 w-11/12 m-2 rounded-lg items-center justify-between backdrop-blur z-10 shadow shadow-slate-200">
        <div className="flex flex-row gap-1">
          {path_blocks.map((block, index) => {
            if (index == 0) {
              return (
                <Link key={index} href={`/`}>
                  <Badge className="bg-slate-500 rounded-md">Home</Badge>
                </Link>
              );
            }
            return (
              <Link key={index} href={index == 1 ? `/${block}` :`${block}`}>
                <Badge className="bg-slate-500 rounded-md capitalize">
                  / {block}
                </Badge>
              </Link>
            );
          })}
        </div>
        <StepperView triggerTitle="View Progress">
          <Stepper />
        </StepperView>
      </div>
      {/* Body */}
      <div className="w-11/12 flex-grow grid grid-cols-1 justify-items-center">
        {children}
      </div>
    </div>
  );
}

export default Layout;
