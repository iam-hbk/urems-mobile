"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  Row,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { FormResponseSummary } from "@/types/form-template";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

// Mock patient data fetching function - replace with your actual API call
const fetchPatientDetails = async (
  patientId: number,
): Promise<{ id: number; firstName: string; lastName: string } | null> => {
  // console.log(`Fetching patient details for ID: ${patientId}`);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300)); // Shorter delay
  // Example data - replace with actual API logic
  const mockPatients: { [key: number]: { id: number; firstName: string; lastName: string } } = {
    1: { id: 1, firstName: "John", lastName: "Doe" },
    2: { id: 2, firstName: "Jane", lastName: "Smith" },
    3: { id: 3, firstName: "Alice", lastName: "Wonderland" },
  };
  return mockPatients[patientId] || null;
};


interface EnrichedFormResponseSummary extends FormResponseSummary {
  patientFullName?: string;
}

interface FormResponsesTableProps {
  templateId: string;
  initialResponses: FormResponseSummary[];
  isLoadingInitialResponses: boolean;
}

export const FormResponsesTable: React.FC<FormResponsesTableProps> = ({
  templateId,
  initialResponses,
  isLoadingInitialResponses,
}) => {
  const router = useRouter();
  const [enrichedResponses, setEnrichedResponses] = useState<EnrichedFormResponseSummary[]>([]);
  const [isEnriching, setIsEnriching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const enrichResponses = async () => {
      if (!initialResponses || initialResponses.length === 0) {
        setEnrichedResponses([]);
        return;
      }
      setIsEnriching(true);
      const enriched = await Promise.all(
        initialResponses.map(async (response) => {
          let patientFullName: string | undefined;
          if (response.patientId) {
            try {
              const patientDetails = await fetchPatientDetails(response.patientId);
              if (patientDetails) {
                patientFullName = `${patientDetails.firstName} ${patientDetails.lastName}`;
              }
            } catch (error) {
              console.error(`Failed to fetch patient details for ID ${response.patientId}:`, error);
            }
          }
          return { ...response, patientFullName };
        }),
      );
      setEnrichedResponses(enriched);
      setIsEnriching(false);
    };

    enrichResponses();
  }, [initialResponses]);

  const columns = useMemo<ColumnDef<EnrichedFormResponseSummary>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Response ID",
        cell: ({ row }) => (
          <Link
            href={`/forms/${templateId}/${row.original.id}`}
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()} // Prevent row click from interfering
          >
            #{row.original.id.substring(0, 8)}
          </Link>
        ),
      },
      {
        accessorKey: "patientFullName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Patient Name
              {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          )
        },
        cell: ({ row }) => row.original.patientFullName || "N/A",
        enableGlobalFilter: true,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Created At
              {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          )
        },
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "isCompleted",
        header: "Status",
        cell: ({ row }) =>
          row.original.isCompleted ? (
            <Badge
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Completed
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              In Progress
            </Badge>
          ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Link
            href={`/forms/${templateId}/${row.original.id}`}
            className="text-green-600 hover:underline"
            onClick={(e) => e.stopPropagation()} // Prevent row click from interfering
          >
            Edit
          </Link>
        ),
      },
    ],
    [templateId],
  );

  const table = useReactTable({
    data: enrichedResponses,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Set desired page size
      }
    }
  });

  const handleRowClick = (row: Row<EnrichedFormResponseSummary>) => {
    router.push(`/forms/${templateId}/${row.original.id}`);
  };

  if (isLoadingInitialResponses || isEnriching) {
    return <div className="px-1 py-2 text-sm italic text-gray-500">Loading responses and patient data...</div>;
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                    <TableCell key={cell.id} className="py-3">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between space-x-2">
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
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
    </div>
  );
}; 