"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FormTemplateSummary } from "@/types/form-template";
import { DataTableColumnHeader } from "../form-task-details-table/data-table-column-header";
import Link from "next/link";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

export const formsColumns: ColumnDef<FormTemplateSummary>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Form Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium min-w-48">
          {row.getValue("title")}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="text-sm text-muted-foreground max-w-md truncate">
          {description || "No description"}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Link href={`/forms/${row.original.id}`}>
          <Button variant="ghost" size="sm" className="h-8">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Details
          </Button>
        </Link>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
]; 