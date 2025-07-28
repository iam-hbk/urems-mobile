"use client";

import { DetailedFormResponse } from "@/types/form-template";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react"; // For boolean display

// Helper to format date or return N/A
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return "Invalid Date";
  }
};

export const responseMetaColumns: ColumnDef<DetailedFormResponse>[] = [
  {
    accessorKey: "id",
    header: "Response ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "formTemplate.title",
    header: "Form Title",
    cell: ({ row }) => {
      const formTemplate = row.original.formTemplate;
      return formTemplate?.title || "N/A";
    },
  },
  {
    accessorKey: "isCompleted",
    header: "Status",
    cell: ({ row }) => {
      const isCompleted = row.getValue("isCompleted");
      return isCompleted ? (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">
          <XCircle className="mr-1 h-3 w-3" /> In Progress
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => formatDate(row.getValue("updatedAt")),
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => row.getValue("patientId") || "N/A",
  },
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
    cell: ({ row }) => row.getValue("vehicleId") || "N/A",
  },
  {
    accessorKey: "crewId",
    header: "Crew ID",
    cell: ({ row }) => row.getValue("crewId") || "N/A",
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    cell: ({ row }) => row.getValue("employeeId") || "N/A",
  },
  {
    accessorKey: "formTemplateId",
    header: "Template ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("formTemplateId")}</div>,
  },
]; 