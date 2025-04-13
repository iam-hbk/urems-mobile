"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRFFormType } from "@/interfaces/prf-schema-docs";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
interface PrintPRFProps {
  prf: PRFFormType;
}

export function PrintPRF({ prf }: PrintPRFProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const handlePrint = async () => {
    const element = document.getElementById("prf-preview");
    if (!element) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: [0.5, 0.5],
        filename: `PRF-${prf.prfFormId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PRF saved successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isPreviewOpen) {
    return (
      <Button onClick={() => setIsPreviewOpen(true)}>
        Preview & Print PRF
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-[894px] overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-2xl font-bold">PRF Preview</h2>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>Print PDF</Button>
          </div>
        </div>

        <div className="mx-auto w-[730px] bg-white p-[50px]" id="prf-preview">
          {/* Page 1: Basic Information */}
          <div className="page-break-after mb-8">
            <div>
              <div className="mb-8 flex flex-row items-center justify-between">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/urems-erp.png"
                    alt="UREMS ERP Logo"
                    width={150}
                    height={150}
                    priority
                    className="border"
                  />
                  <p className="text-2xl font-bold text-primary">
                    <span>UREMS</span>
                    <span className="text-red-800">ERP</span>
                  </p>
                </div>
                {/* date and time  */}
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">
                    {format(new Date(), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">Patient Record Form</h1>
                <p className="text-sm">Form ID: {prf.prfFormId}</p>
              </div>
            </div>

            {/* Case Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between">
                    <div className="w-1/2">
                      <p className="font-semibold">Region/District:</p>
                      <p>{prf.prfData.case_details?.data.regionDistrict}</p>
                    </div>
                    <div className="w-1/2">
                      <p className="font-semibold">Base:</p>
                      <p>{prf.prfData.case_details?.data.base}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/2">
                      <p className="font-semibold">Province:</p>
                      <p>{prf.prfData.case_details?.data.province}</p>
                    </div>
                    <div className="w-1/2">
                      <p className="font-semibold">Date:</p>
                      <p>
                        {prf.prfData.case_details?.data.dateOfCase.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Vehicle Details:</p>
                    <div className="pl-4">
                      <p>Name: {prf.prfData.case_details?.data.vehicle.name}</p>
                      <p>
                        License:{" "}
                        {prf.prfData.case_details?.data.vehicle.license}
                      </p>
                      <p>
                        Registration:{" "}
                        {
                          prf.prfData.case_details?.data.vehicle
                            .registrationNumber
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between">
                    <div className="w-1/2">
                      <p className="font-semibold">Name:</p>
                      <p>
                        {prf.prfData.patient_details?.data.patientName}{" "}
                        {prf.prfData.patient_details?.data.patientSurname}
                      </p>
                    </div>
                    <div className="w-1/2">
                      <p className="font-semibold">Age:</p>
                      <p>
                        {prf.prfData.patient_details?.data.age}{" "}
                        {prf.prfData.patient_details?.data.ageUnit}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/2">
                      <p className="font-semibold">Gender:</p>
                      <p>{prf.prfData.patient_details?.data.gender}</p>
                    </div>
                    <div className="w-1/2">
                      <p className="font-semibold">ID/Passport:</p>
                      <p>
                        {prf.prfData.patient_details?.data.id ||
                          prf.prfData.patient_details?.data.passport}
                      </p>
                    </div>
                  </div>

                  {/* Next of Kin */}
                  {prf.prfData.patient_details?.data.nextOfKin && (
                    <div>
                      <p className="mb-2 font-semibold">Next of Kin:</p>
                      <div className="space-y-2 pl-4">
                        <p>
                          Name:{" "}
                          {prf.prfData.patient_details.data.nextOfKin.name}
                        </p>
                        <p>
                          Relation:{" "}
                          {
                            prf.prfData.patient_details.data.nextOfKin
                              .relationToPatient
                          }
                        </p>
                        <p>
                          Phone:{" "}
                          {prf.prfData.patient_details.data.nextOfKin.phoneNo}
                        </p>
                        {prf.prfData.patient_details.data.nextOfKin
                          .alternatePhoneNo && (
                          <p>
                            Alt. Phone:{" "}
                            {
                              prf.prfData.patient_details.data.nextOfKin
                                .alternatePhoneNo
                            }
                          </p>
                        )}
                        <p>
                          Address:{" "}
                          {
                            prf.prfData.patient_details.data.nextOfKin
                              .physicalAddress
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Medical Aid */}
                  {prf.prfData.patient_details?.data.medicalAid && (
                    <div>
                      <p className="mb-2 font-semibold">Medical Aid:</p>
                      <div className="space-y-2 pl-4">
                        <p>
                          Name:{" "}
                          {prf.prfData.patient_details.data.medicalAid.name}
                        </p>
                        <p>
                          Number:{" "}
                          {prf.prfData.patient_details.data.medicalAid.number}
                        </p>
                        <p>
                          Principal Member:{" "}
                          {
                            prf.prfData.patient_details.data.medicalAid
                              .principalMember
                          }
                        </p>
                        {prf.prfData.patient_details.data.medicalAid.authNo && (
                          <p>
                            Auth No:{" "}
                            {prf.prfData.patient_details.data.medicalAid.authNo}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Page 2: Clinical Information */}
          <div className="page-break-after mb-8">
            {/* Vital Signs */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  {prf.prfData.vital_signs?.data.readings.map(
                    (reading, index) => (
                      <div key={index} className="border-b pb-4">
                        <p className="mb-2 font-semibold">
                          Time: {reading.time}
                        </p>
                        <div className="flex flex-col space-y-2 pl-4">
                          <p>
                            BP: {reading.bp.systolic}/{reading.bp.diastolic}
                          </p>
                          <p>Pulse: {reading.pulse}</p>
                          <p>SpO2: {reading.spo2}%</p>
                          <p>Temperature: {reading.temperature}°C</p>
                          <p>
                            GCS: E{reading.gcs.eyes} V{reading.gcs.verbal} M
                            {reading.gcs.motor}
                          </p>
                          <div>
                            <p className="font-semibold">Pupils:</p>
                            <div className="pl-4">
                              <p>
                                Left: {reading.pupils.left.size}mm (
                                {reading.pupils.left.reaction})
                              </p>
                              <p>
                                Right: {reading.pupils.right.size}mm (
                                {reading.pupils.right.reaction})
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Primary Survey */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Primary Survey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div>
                    <p className="font-semibold">Airway:</p>
                    <div className="pl-4">
                      <p>
                        Patent:{" "}
                        {prf.prfData.primary_survey?.data.airway.patent
                          ? "Yes"
                          : "No"}
                      </p>
                      <p>
                        Obstruction:{" "}
                        {prf.prfData.primary_survey?.data.airway.obstruction
                          ? "Yes"
                          : "No"}
                      </p>
                      {prf.prfData.primary_survey?.data.airway.notes && (
                        <p>
                          Notes: {prf.prfData.primary_survey.data.airway.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Breathing:</p>
                    <div className="pl-4">
                      <p>
                        Spontaneous:{" "}
                        {prf.prfData.primary_survey?.data.breathing.spontaneous
                          ? "Yes"
                          : "No"}
                      </p>
                      <p>
                        Rate: {prf.prfData.primary_survey?.data.breathing.rate}
                      </p>
                      <p>
                        Effort:{" "}
                        {prf.prfData.primary_survey?.data.breathing.effort}
                      </p>
                      <p>
                        Sounds:{" "}
                        {prf.prfData.primary_survey?.data.breathing.sounds.join(
                          ", ",
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Circulation:</p>
                    <div className="pl-4">
                      <p>
                        Pulse Present:{" "}
                        {prf.prfData.primary_survey?.data.circulation
                          .pulsePresent
                          ? "Yes"
                          : "No"}
                      </p>
                      <p>
                        Rate:{" "}
                        {prf.prfData.primary_survey?.data.circulation.pulseRate}
                      </p>
                      <p>
                        Skin Color:{" "}
                        {prf.prfData.primary_survey?.data.circulation.skinColor}
                      </p>
                      <p>
                        Skin Temperature:{" "}
                        {prf.prfData.primary_survey?.data.circulation.skinTemp}
                      </p>
                      <p>
                        Capillary Refill:{" "}
                        {
                          prf.prfData.primary_survey?.data.circulation
                            .capillaryRefill
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Page 3: Treatment and Handover */}
          <div className="mb-8">
            {/* Medications */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Medications Administered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  {prf.prfData.medication_administration?.data.medications.map(
                    (med, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex flex-col space-y-2">
                          <p>Medicine: {med.medicine}</p>
                          <p>Dose: {med.dose}</p>
                          <p>Route: {med.route}</p>
                          <p>Time: {med.time.value}</p>
                          <p>
                            Given By: {med.name} (HPCSA: {med.hpcsa})
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Procedures */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div>
                    <p className="font-semibold">Airway:</p>
                    <div className="space-y-1 pl-4">
                      {prf.prfData.procedures?.data.airway.ett && <p>ETT</p>}
                      {prf.prfData.procedures?.data.airway.iGel && <p>iGel</p>}
                      {prf.prfData.procedures?.data.airway.lma && <p>LMA</p>}
                      {prf.prfData.procedures?.data.airway.opa && <p>OPA</p>}
                      {prf.prfData.procedures?.data.airway.suction && (
                        <p>Suction</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Breathing:</p>
                    <div className="space-y-1 pl-4">
                      {prf.prfData.procedures?.data.breathing.bvm && <p>BVM</p>}
                      {prf.prfData.procedures?.data.breathing.cpap && (
                        <p>CPAP</p>
                      )}
                      {prf.prfData.procedures?.data.breathing.oxygen && (
                        <p>Oxygen</p>
                      )}
                      {prf.prfData.procedures?.data.breathing.ventilation && (
                        <p>Ventilation</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Circulation:</p>
                    <div className="space-y-1 pl-4">
                      {prf.prfData.procedures?.data.circulation.cpr && (
                        <p>CPR</p>
                      )}
                      {prf.prfData.procedures?.data.circulation.defib && (
                        <p>Defibrillation</p>
                      )}
                      {prf.prfData.procedures?.data.circulation.ecg && (
                        <p>ECG</p>
                      )}
                      {prf.prfData.procedures?.data.circulation.iv && (
                        <p>IV Access</p>
                      )}
                      {prf.prfData.procedures?.data.circulation.io && (
                        <p>IO Access</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Handover Details */}
            <Card>
              <CardHeader>
                <CardTitle>Handover Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div>
                    <p className="font-semibold">Receiving Facility:</p>
                    <p>
                      {prf.prfData.patient_handover?.data.receivingFacility}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Time:</p>
                    <p>{prf.prfData.patient_handover?.data.handoverTime}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Received By:</p>
                    <p>
                      {prf.prfData.patient_handover?.data.staffMember.name} (
                      {
                        prf.prfData.patient_handover?.data.staffMember
                          .designation
                      }
                      )
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Patient Condition:</p>
                    <p>{prf.prfData.patient_handover?.data.patientCondition}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Documentation:</p>
                    <div className="pl-4">
                      <p>
                        PRF Copy:{" "}
                        {prf.prfData.patient_handover?.data.documentation
                          .prfCopy
                          ? "Yes"
                          : "No"}
                      </p>
                      <p>
                        ECG Strips:{" "}
                        {prf.prfData.patient_handover?.data.documentation
                          .ecgStrips
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
