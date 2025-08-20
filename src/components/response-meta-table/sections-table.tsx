"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate, DetailedFormResponse } from "@/types/form-template";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  Row,
} from "@tanstack/react-table";

interface SectionsTableProps {
  formTemplate: FormTemplate;
  formResponse: DetailedFormResponse;
  formId: string;
}

type BaseSectionType = FormTemplate["sections"][number];
type EnrichedSection = BaseSectionType & {
  statusText: string;
  isCompleted: boolean;
};

export function SectionsTable({
  formTemplate,
  formResponse,
  formId,
}: SectionsTableProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const getSectionStatus = (sectionId: string): boolean => {
    const status = formResponse.sectionStatuses?.find(
      (status) => status.sectionId === sectionId,
    );
    return status?.isCompleted ?? false;
  };

  const enrichedSectionsData = useMemo<EnrichedSection[]>(() => {
    if (!formTemplate.sections || !Array.isArray(formTemplate.sections)) {
      return [];
    }
    return formTemplate.sections.map((section) => {
      const isCompleted = getSectionStatus(section.id);
      let statusText = "Incomplete";
      if (isCompleted) {
        statusText = "Completed";
      } else if (section.isRequired) {
        statusText = "Required";
      }
      return { ...section, isCompleted, statusText };
    });
  }, [formTemplate.sections, formResponse.sectionStatuses, getSectionStatus]);

  const columns = useMemo<ColumnDef<EnrichedSection>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-1"
          >
            Section Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-md truncate">
            {row.original.description || "No description"}
          </div>
        ),
      },
      {
        accessorKey: "statusText",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-1"
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const section = row.original;
          if (section.isCompleted) {
            return (
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-1 h-3 w-3" /> Completed
              </Badge>
            );
          } else if (section.isRequired) {
            return (
              <Badge
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                <AlertCircle className="mr-1 h-3 w-3" /> Required
              </Badge>
            );
          }
          return (
            <Badge
              variant="secondary"
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <XCircle className="mr-1 h-3 w-3" /> Incomplete
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/forms/${formId}/${formResponse.id}/${row.original.id}`}
                  className="w-full cursor-pointer"
                >
                  View/Edit Section
                </Link>
              </DropdownMenuItem>
              {/* Add more DropdownMenuItem here for other actions */}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [formId, formResponse.id],
  );

  const table = useReactTable({
    data: enrichedSectionsData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleRowClick = (row: Row<EnrichedSection>) => {
    router.push(`/forms/${formId}/${formResponse.id}/${row.original.id}`);
  };

  const totalSections = formTemplate.sections?.length ?? 0;
  const completedSections =
    formResponse.sectionStatuses?.filter((status) => status.isCompleted)
      ?.length ?? 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search sections..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {totalSections > 0 && (
          <div className="text-sm text-muted-foreground">
            {completedSections} of {totalSections} sections completed
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {globalFilter
                    ? "No sections matching your search."
                    : "No sections found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
