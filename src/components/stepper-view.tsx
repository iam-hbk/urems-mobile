import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { PropsWithChildren } from "react";
import { TrendingUp } from "lucide-react";

interface Props extends PropsWithChildren {
  triggerTitle: string;
}

const StepperView: React.FC<Props> = (props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          {props.triggerTitle}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Form Steps</SheetTitle>
          <SheetDescription>
            Follow the steps below to complete the form
          </SheetDescription>
        </SheetHeader>
        {props.children}
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
