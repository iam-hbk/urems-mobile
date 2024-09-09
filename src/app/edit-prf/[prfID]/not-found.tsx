import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center border">
      <h2>Not Found</h2>
      <p>Could not find requested prf</p>
      <Link href="/">
        <Button variant={"link"}>Return Home</Button>
      </Link>
    </div>
  );
}
