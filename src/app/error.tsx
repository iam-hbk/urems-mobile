"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">
        An unexpected error occurred. You can try again or go back to the login
        page.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => router.push("/login")}>
          Go to login
        </Button>
      </div>
      {error?.digest && (
        <p className="text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
