
import PatientDetailsForm from "@/components/the-prf-form/patient-details-section";
import TransportationForm from "@/components/the-prf-form/transportation-section";

import React from "react";


function PatientDetails() {
  
  return (
    <div className="border w-11/12 rounded-md p-8 m-10">
      <TransportationForm />
    </div>
  );
}

export default PatientDetails;
