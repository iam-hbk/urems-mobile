"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { FormResponseSummary } from "@/types/form-template";
import { DataTableColumnHeader } from "../form-task-details-table/data-table-column-header";
import { Button } from "../ui/button";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
// import { DataTableRowActions } from "../form-task-details-table/data-table-row-actions";
import { PrintPRF } from "../PrintPRF";

const fuzzyFilter: FilterFn<FormResponseSummary> = (
  row,
  columnId,
  value: string,
) => {
  const val = row.getValue(columnId);
  if (!val) return false;
  return val.toString().toLowerCase().includes(value.toLowerCase());
};

const dateRangeFilter: FilterFn<FormResponseSummary> = (
  row,
  columnId,
  // filterValue: any,
  filterValue,
) => {
  if (!filterValue?.start || !filterValue?.end) return true;

  const rowDate = new Date(row.getValue(columnId));
  const startDate = new Date(filterValue.start.toString());
  const endDate = new Date(filterValue.end.toString());

  return rowDate >= startDate && rowDate <= endDate;
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
          <Button variant="link">{row.original.id.split("-")[0]}</Button>
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
  // {
  //   accessorKey: "prfData.patient_details.patientName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Patient Name" />
  //   ),
  //   cell: () => {
  //     // TODO: Make this function async then useQuery the patient details
  //     // TODO: Fetch patient details from the API using the Patient ID `patientID`

  //     // const patientName = row.original.patientId;
  //     // const patientSurname = row.original.patientId;
  //     // return patientName && patientSurname
  //     //   ? `${patientName} ${patientSurname}`
  //     //   : "Unknown";
  //     return "Unknown";
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isCompleted = row.original.isCompleted;
      const message = isCompleted ? "Completed" : "Draft";
      return (
        <Badge
          className={cn("rounded-md border bg-transparent", {
            "border-green-600 text-green-600 hover:bg-green-700 hover:text-white":
              isCompleted,
            "border-yellow-600 text-yellow-600 hover:bg-yellow-700 hover:text-white":
              !isCompleted,
          })}
        >
          {message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "print",
    header: "Print",
    cell: ({ row }) => {
      return <PrintPRF variant="outline" prfResponseId={row.original.id} />;
    },
  },
];
