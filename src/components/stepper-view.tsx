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
import { PRF_FORM } from "@/interfaces/prf-form";

interface Props {
  triggerTitle: string;
  prf: PRF_FORM;
}

const StepperView: React.FC<Props> = ({ triggerTitle, prf }) => {
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
        <Stepper prf={prf} />
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
