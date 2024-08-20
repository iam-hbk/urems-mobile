
import PatientDetailsForm from "@/components/the-prf-form/patient-details-section";
import { useStore } from "@/lib/store";
import React from "react";


function PatientDetails() {
  
  return (
    <div className="border w-11/12 rounded-md p-8 m-10">
      <PatientDetailsForm />
    </div>
  );
}

export default PatientDetails;
