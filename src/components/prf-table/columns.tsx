"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { FormResponseSummary } from "@/types/form-template";
import { DataTableColumnHeader } from "../form-task-details-table/data-table-column-header";
import { Button } from "../ui/button";
import { dateRangeFilter } from "./data-table";
import Link from "next/link";

const fuzzyFilter: FilterFn<FormResponseSummary> = (
  row,
  columnId,
  value: string,
) => {
  const val = row.getValue(columnId);
  if (!val) return false;
  return val.toString().toLowerCase().includes(value.toLowerCase());
};

export const columns: ColumnDef<FormResponseSummary>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PRF Number" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/edit-prf/${row.getValue("id")}`}>
          <Button variant="link">{row.getValue("id")}</Button>
        </Link>
      );
    },
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      // TODO: Remove this manual +2 hour offset once backend sends dates in correct timezone
      const date = new Date(row.getValue("createdAt"));
      date.setHours(date.getHours() + 2);
      return date.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        // timeZone: "Africa/Johannesburg",
      });
    },
    filterFn: dateRangeFilter,
  },
  // {
  //   accessorKey: "employeeId",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Employee" />
  //   ),
  //   cell: ({ row }) => {
  //     const employeeId = row.getValue("employeeId");
  //     return employeeId || "N/A";
  //   },
  //   filterFn: fuzzyFilter,
  // },
  {
    accessorKey: "prfData.patient_details.patientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => {
      // TODO: Make this function async then useQuery the patient details
      // TODO: Fetch patient details from the API using the Patient ID `patientID`

      // const patientName = row.original.patientId;
      // const patientSurname = row.original.patientId;
      // return patientName && patientSurname
      //   ? `${patientName} ${patientSurname}`
      //   : "Unknown";
      return "Unknown";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return row.original.isCompleted ? "Completed" : "Draft";
    },
  },
];
