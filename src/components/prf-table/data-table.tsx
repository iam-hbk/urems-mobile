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
// import { useRouter } from "next/navigation";
import { FormResponseSummary } from "@/types/form-template";

interface DataTableProps {
  columns: ColumnDef<FormResponseSummary>[];
  data: FormResponseSummary[];
}

// Custom filter function for date ranges
export const dateRangeFilter: FilterFn<FormResponseSummary> = (
  row,
  columnId,
  filterValue: RangeValue<DateValue>,
) => {
  if (!filterValue?.start || !filterValue?.end) return true;

  const rowDate = new Date(row.getValue(columnId));
  const startDate = new Date(filterValue.start.toString());
  const endDate = new Date(filterValue.end.toString());

  return rowDate >= startDate && rowDate <= endDate;
};

export function DataTable({ columns, data }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [dateRange, setDateRange] = React.useState<RangeValue<DateValue>>();
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

  const handleDateRangeChange = React.useCallback(
    (value: RangeValue<DateValue> | null) => {
      if (value) {
        setDateRange(value);
        // Apply date filter
        const dateColumn = table.getColumn("createdAt");
        if (dateColumn) {
          dateColumn.setFilterValue(value);
        }
      }
    },
    [table],
  );

  // Apply initial date filter
  React.useEffect(() => {
    const dateColumn = table.getColumn("createdAt");
    if (dateColumn) {
      dateColumn.setFilterValue(dateRange);
    }
  }, [dateRange, table]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by PRF Number..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

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
                start: new CalendarDate(
                  today("UTC").year,
                  today("UTC").month,
                  today("UTC").day,
                ).subtract({ weeks: 1 }),
                end: new CalendarDate(
                  today("UTC").year,
                  today("UTC").month,
                  today("UTC").day,
                ),
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
                            header.getContext(),
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
