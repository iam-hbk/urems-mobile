"use client";
import StepperView from "@/components/stepper-view";
import { useStore } from "@/lib/store";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Script from "next/script";
import QuickLinks from "@/components/quick-links";

type Props = {};

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

  return (
    <div className="flex w-full flex-col items-center overflow-auto">
      <div className="sticky top-2 z-10 m-2 flex w-11/12 flex-col items-center justify-between space-y-2 rounded-lg p-2 shadow shadow-slate-200 backdrop-blur">
        {prf && <QuickLinks prf={prf} />}

        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row gap-1">
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
          {!!prf && (
            <StepperView prf={prf} triggerTitle="View Progress"></StepperView>
          )}
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
    </div>
  );
}

export default Layout;
