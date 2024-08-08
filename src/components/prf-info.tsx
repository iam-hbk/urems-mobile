import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Link from "next/link";
import {
  Calendar,
  GroupIcon,
  Heart,
  HeartPulse,
  ThermometerSun,
  Trees,
  User2,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function Prf_Info() {
  return (
    <Card className="w-full hover:bg-primary/5 xl:max-w-lg hover:border-primary/15 hover:shadow-xl transition-all duration-500 ">
      <CardHeader className="flex items-center gap-4 pb-4">
        <Badge className="self-end rounded-md bg-green-700 dark:bg-green-400">
          Submitted
        </Badge>
        <div className="flex flex-row gap-2 ">
          <Avatar className="border-2 border-primary">
            <AvatarImage src="/placeholder-user.jpg" alt="Patient Avatar" />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <div className="text-lg font-semibold">John Doe</div>
            <div className="text-muted-foreground flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>32 years old,</span>
              <GroupIcon className="w-4 h-4" />
              <span>Male</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-medium">Temperature</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <ThermometerSun />
            38.6°C
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Blood Pressure</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <HeartPulse />
            120/80 mmHg
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Heart Rate</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Heart />
            72 bpm
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Oxygen Levels</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Trees />
            98%
          </div>
        </div>
        <div className="col-span-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="symptoms">
              <AccordionTrigger>Symptoms</AccordionTrigger>
              <AccordionContent>
                Chest pain, shortness of breath, and dizziness.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="medical-history">
              <AccordionTrigger>Medical History</AccordionTrigger>
              <AccordionContent>
                Hypertension, type 2 diabetes, and a history of heart disease.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link
          href="#"
          className="text-primary hover:underline"
          prefetch={false}
        >
          View Full Report
        </Link>
      </CardFooter>
    </Card>
  );
}
