"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import PatientDetailsForm from "./patient-details-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card } from "../ui/card";

type Props = {
  formData: any;
};

const ThePrfForm = (props: Props) => {
  const collectData = (data: any) => {
    //Will update the global form data state with the new data from any section
    console.log(data);
  };

  return (
    <Card>
      <Accordion type="single" collapsible  className="m-6">
        <AccordionItem value="patient-details">
          <AccordionTrigger className="bg-primary/5 p-2 m-1 rounded-md">
            <h3
              id="patient-details-form-section"
              className="scroll-m-20 text-lg text-primary tracking-tight"
            >
              Patient Details
            </h3>
          </AccordionTrigger>
          <AccordionContent className="p-4 border rounded-sm m-2">
            <PatientDetailsForm collectData={collectData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="transportation">
          <AccordionTrigger className="bg-primary/5 p-2 m-1 rounded-md">
            <h3
              id="transportation-form-section"
              className="scroll-m-20 text-lg text-primary tracking-tight"
            >
              Transportation
            </h3>
          </AccordionTrigger>
          <AccordionContent className="p-4 border rounded-sm m-2">
            <PatientDetailsForm collectData={collectData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="primary-survey">
          <AccordionTrigger className="bg-primary/5 p-2 m-1 rounded-md">
            <h3
              id="primary-survey-form-section"
              className="scroll-m-20 text-lg text-primary tracking-tight"
            >
              Primary Survey
            </h3>
          </AccordionTrigger>
          <AccordionContent className="p-4 border rounded-sm m-2">
            <PatientDetailsForm collectData={collectData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default ThePrfForm;
