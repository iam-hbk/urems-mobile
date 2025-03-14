import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  MapPin,
  Ambulance,
  FileText,
  Heart,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { PRF_FORM } from "@/interfaces/prf-form";

export default function PRF_Summary({
  patientRecord,
}: {
  patientRecord: PRF_FORM;
}) {
  const {
    prfFormId,
    prfData: { incident_information, patient_details, case_details },
    isCompleted,
  } = patientRecord;

  const fullName = `${patient_details?.data.patientName || "Unknown"} ${patient_details?.data.patientSurname || "Unknown"}`;

  return (
    <Link
      href={`/edit-prf/${prfFormId}`}
      className="relative block transition-opacity hover:opacity-80"
    >
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <CardTitle className="mb-2 text-xl sm:text-2xl">
                Patient Record Summary
              </CardTitle>
              <CardDescription>PRF Form ID: {prfFormId}</CardDescription>
            </div>
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className="absolute right-2 top-2"
            >
              {isCompleted ? "Completed" : "Incomplete"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{fullName}</span>
              <span className="text-muted-foreground">
                ({patient_details?.data.age || "-"} years,{" "}
                {patient_details?.data.gender || "-"})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Chief Complaint:</span>
              <span className="break-all">
                {incident_information?.data.chiefComplaint || "Unknown"}
              </span>
            </div>
            <Separator />
            <div className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="break-words text-sm">
                {incident_information?.data.sceneAddress || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm">
                {case_details?.data.dateOfCase
                  ? new Date(case_details.data.dateOfCase).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Ambulance className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm">
                Ambulance:{" "}
                {case_details?.data.vehicle?.name
                  ? case_details?.data.vehicle?.name
                  : "Unknown"}
              </span>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex flex-wrap items-center gap-2">
                <Heart className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Allergies:</span>
                {/* <span className="break-all text-sm">
                  {incident_information?.data.pastHistory.allergies || "-"}
                </span> */}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Brain className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Medical Hx:</span>
                {/* <span className="break-all text-sm">
                  {incident_information?.data.pastHistory.medicalHx || "-"}
                </span> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
