"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { PRF_FORM } from "@/interfaces/prf-form";
import { DataTableColumnHeader } from "../form-task-details-table/data-table-column-header";
import { Button } from "../ui/button";
import Link from "next/link";
import { format } from "date-fns";

const fuzzyFilter: FilterFn<PRF_FORM> = (row, columnId, value: string) => {
  const val = row.getValue(columnId);
  if (!val) return false;
  return val.toString().toLowerCase().includes(value.toLowerCase());
};

export const columns: ColumnDef<PRF_FORM>[] = [
  {
    accessorKey: "prfFormId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PRF Number" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/edit-prf/${row.getValue("prfFormId")}`}>
          <Button variant="link">{row.getValue("prfFormId")}</Button>
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
      console.log("ROW - CREATE_AT",row.getValue("createdAt"));
      return row.getValue("createdAt");
      // return format(new Date(row.getValue("createdAt")), "PPP");
    },
    filterFn: "dateRange" as any, // Using type assertion as the custom filter is defined in data-table.tsx
  },
  {
    accessorKey: "EmployeeID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const employeeId = row.getValue("EmployeeID");
      return employeeId || "N/A";
    },
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: "prfData.patient_details.patientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => {
      const patientName =
        row.original.prfData.patient_details?.data.patientName || "N/A";
      const patientSurname =
        row.original.prfData.patient_details?.data.patientSurname || "N/A";
      return `${patientName} ${patientSurname}`;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return row.getValue("status") || "Draft";
    },
  },
];
