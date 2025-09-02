"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
          <h2 className="text-2xl font-semibold">Application Error</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load the page. Please try again.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => reset()}>Try again</Button>
          </div>
          {error?.digest && (
            <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}


