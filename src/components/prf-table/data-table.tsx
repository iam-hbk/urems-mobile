"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

import { DataTablePagination } from "../form-task-details-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { CalendarDate, DateValue, today } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { PRF_FORM } from "@/interfaces/prf-form";
import { useRouter } from "next/navigation";

interface DataTableProps {
  columns: ColumnDef<PRF_FORM>[];
  data: PRF_FORM[];
}

// Custom filter function for date ranges
const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue: RangeValue<DateValue>) => {
  if (!filterValue?.start || !filterValue?.end) return true;
  
  const rowDate = new Date(row.getValue(columnId));
  const startDate = new Date(filterValue.start.toString());
  const endDate = new Date(filterValue.end.toString());
  
  return rowDate >= startDate && rowDate <= endDate;
};

export function DataTable({
  columns,
  data,
}: DataTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [dateRange, setDateRange] = React.useState<RangeValue<DateValue>>();

  const handleDateRangeChange = React.useCallback((value: RangeValue<DateValue> | null) => {
    if (value) {
      setDateRange(value);
      // Apply date filter
      const dateColumn = table.getColumn("createdAt");
      if (dateColumn) {
        dateColumn.setFilterValue(value);
      }
    }
  }, []);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      dateRange: dateRangeFilter,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Apply initial date filter
  React.useEffect(() => {
    const dateColumn = table.getColumn("createdAt");
    if (dateColumn) {
      dateColumn.setFilterValue(dateRange);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by PRF Number..."
          value={(table.getColumn("prfFormId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("prfFormId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* <Input
          placeholder="Filter by Employee..."
          value={(table.getColumn("prfData.case_details.employeeId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("prfData.case_details.employeeId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        <DatePickerWithRange
          value={dateRange}
          onChange={handleDateRangeChange}
        />
        {(table.getState().columnFilters.length > 0 || dateRange) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setDateRange({
                start: new CalendarDate(today("UTC").year, today("UTC").month, today("UTC").day).subtract({ weeks: 1 }),
                end: new CalendarDate(today("UTC").year, today("UTC").month, today("UTC").day)
              });
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    router.push(`/edit-prf/${row.original.prfFormId}`);
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <DataTablePagination table={table} />
    </div>
  );
} 