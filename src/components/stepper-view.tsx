"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { TrendingUp } from "lucide-react";
import { Stepper } from "./stepper";

interface Props {
  triggerTitle: string;
}

const StepperView: React.FC<Props> = ({ triggerTitle }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          {triggerTitle}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Form Steps</SheetTitle>
          <SheetDescription>
            Follow the steps below to complete the form
          </SheetDescription>
        </SheetHeader>
        <Stepper />
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default StepperView;
