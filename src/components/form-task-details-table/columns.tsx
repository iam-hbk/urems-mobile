"use client";

import { ColumnDef } from "@tanstack/react-table";

import { PRF_TABLE_SECTION_DATA } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "../ui/checkbox";
import { priorities, statuses } from "./helper-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<PRF_TABLE_SECTION_DATA>[] = [
  {
    id: "route",
    accessorKey: "route",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sectionDescription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section Description" />
    ),
    cell: ({ row }) => {
      const route = row.getValue("route") as string;

      return (
        <Link href={route} className="hover:underline">
          <div className="min-w-24">{row.getValue("sectionDescription")}</div>
        </Link>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );
      const isRequired = row.getValue("priority") === "required";
      const isCompleted = row.getValue("status") === "completed";

      if (!status) {
        return "Unknown";
      }

      return (
        <div
          className={cn({
            "text-destructive": isRequired,
            "dark:text-green-500 text-green-600": isCompleted,
            "flex w-[130px] items-center": true,
          })}
        >
          {status.icon && <status.icon className="mr-2 h-4 w-4" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
