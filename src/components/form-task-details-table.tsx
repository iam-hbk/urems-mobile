"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "./ui/card";
import {
  CheckCircleIcon,
  CheckIcon,
  PlusCircleIcon,
  Settings2,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

// import { Table } from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";

interface DataTableViewOptionsProps {
  //   table: Table<TData>
  formSectionsColumns: any;
  setFormSectionsColumns: any;
}

const formSections = [
  {
    description: "Patient Information",
    isRequired: true,
    isCompleted: true,
    route: "patient-details",
  },
  {
    description: "Primary Survey",
    isRequired: true,
    isCompleted: true,
    route: "primary-survey",
  },
  {
    description: "Vital Signs",
    isRequired: true,
    isCompleted: false,
    route: "vital-signs",
  },
  {
    description: "Notes",
    isRequired: false,
    isCompleted: false,
    route: "notes",
  },
  {
    description: "Patient Handover",
    isRequired: true,
    isCompleted: false,
    route: "patient-handover-form-section",
  },
];

type Props = {
  prfID: string;
};

export function FormTaskDetailsTable({ prfID }: Props) {
  const [formSectionsColumns, setFormSectionsColumns] = useState([
    {
      Header: "Section Description",
      accessor: "description",
      isVisible: true,
    },
    {
      Header: "Priority",
      accessor: "isRequired",
      isVisible: true,
    },
    {
      Header: "Status",
      accessor: "isCompleted",
      isVisible: true,
    },
  ]);

  const [filteredSections, setFilteredSections] = useState(formSections);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const filterSectionsBy = (filterType: string, filter: string) => {
    // filter type is either "priority" or "status"
    // filter is any of the values in the filterType column
    // e.g. filterSectionsBy("priority", "Required")
    // e.g. filterSectionsBy("status", "Completed")
    setFilteredSections(
      formSections.filter((section: any) =>
        section[filterType].toLowerCase().includes(filter)
      )
    );
  };
  const clearFilters = () => {
    setFilteredSections(formSections);
    setIsFiltered(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row items-center gap-2">
          <Input
            placeholder="Filter tasks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(e.target.value.length > 0);
              setFilteredSections(
                formSections.filter((section) =>
                  section.description.toLowerCase().includes(searchTerm)
                )
              );
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <FilterByComponent
            filterSectionsBy={filterSectionsBy}
            filterType="Priority"
            options={[
              { label: "Required", value: "Required" },
              { label: "Optional", value: "Optional" },
            ]}
          />
          <FilterByComponent
            filterSectionsBy={filterSectionsBy}
            filterType="Status"
            options={[
              { label: "Completed", value: "Completed" },
              { label: "Not Completed", value: "Not Completed" },
            ]}
          />
          {/* <Button variant={"outline"} className="border-dashed">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Priority
          </Button>
          <Button variant={"outline"} className="border-dashed">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Status
          </Button> */}
          {isFiltered && (
            <Button onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          )}
        </div>
        <div>
          {/* <Button variant={"outline"}>
            <Settings2 className="mr-2 h-4 w-4" /> View
          </Button> */}
          <DataTableViewOptions
            formSectionsColumns={formSectionsColumns}
            setFormSectionsColumns={setFormSectionsColumns}
          />
        </div>
      </div>
      <Card className="w-full">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            {/* <TableRow className="bg-primary hover:bg-primary rounded-sm text-primary-foreground text-sm">
              <TableHead className="rounded-ss-lg">
                Section Description
              </TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="rounded-se-lg">Status</TableHead>
            </TableRow> */}
            <TableRow>
              {formSectionsColumns.map((column: any, index: number) => {
                return column.isVisible ? (
                  <TableHead key={index}>{column.Header}</TableHead>
                ) : null;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {formSections.map((section) => (
              <TableRow key={section.description}>
                <TableCell className="font-medium">
                  {section.description}
                </TableCell>
                <TableCell>
                  {section.isRequired ? "Required" : "Optional"}
                </TableCell>
                <TableCell>
                  {section.isCompleted ? (
                    <CheckCircleIcon className="text-green-600 dark:text-green-500" />
                  ) : (
                    <Square
                      className={cn({
                        "text-gray-400 dark:text-gray-500":
                          !section.isCompleted && !section.isRequired,
                        "text-destructive":
                          !section.isCompleted && section.isRequired,
                      })}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))} */}
            {isSearching
              ? filteredSections.map((section: any) => (
                  <TableRow key={section.description}>
                    {formSectionsColumns.map((column: any, index: number) => {
                      return column.isVisible ? (
                        <TableCell key={index}>
                          {column.accessor === "isCompleted" ? (
                            section.isCompleted ? (
                              <CheckCircleIcon className="text-green-600 dark:text-green-500" />
                            ) : (
                              <Square
                                className={cn({
                                  "text-gray-400 dark:text-gray-500":
                                    !section.isCompleted && !section.isRequired,
                                  "text-destructive":
                                    !section.isCompleted && section.isRequired,
                                })}
                              />
                            )
                          ) : column.accessor === "isRequired" ? (
                            section.isRequired ? (
                              "Required"
                            ) : (
                              "Optional"
                            )
                          ) : column.accessor === "description" ? (
                            <Link
                              className="hover:underline"
                              href={`${prfID}/${section.route}`}
                            >
                              {section.description}
                            </Link>
                          ) : null}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                ))
              : formSections.map((section: any) => (
                  <TableRow key={section.description}>
                    {formSectionsColumns.map((column: any, index: number) => {
                      return column.isVisible ? (
                        <TableCell key={index}>
                          {column.accessor === "isCompleted" ? (
                            section.isCompleted ? (
                              <CheckCircleIcon className="text-green-600 dark:text-green-500" />
                            ) : (
                              <Square
                                className={cn({
                                  "text-gray-400 dark:text-gray-500":
                                    !section.isCompleted && !section.isRequired,
                                  "text-destructive":
                                    !section.isCompleted && section.isRequired,
                                })}
                              />
                            )
                          ) : column.accessor === "isRequired" ? (
                            section.isRequired ? (
                              "Required"
                            ) : (
                              "Optional"
                            )
                          ) : column.accessor === "description" ? (
                            <Link
                              className="hover:underline"
                              href={`${prfID}/${section.route}`}
                            >
                              {section.description}
                            </Link>
                          ) : null}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            {/* <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{formSections.length}</TableCell>
              <TableCell>
                {formSections.filter((section) => section.isCompleted).length}
              </TableCell>
            </TableRow> */}

            <TableRow>
              {isSearching
                ? formSectionsColumns.map((column: any, index: number) => {
                    return column.isVisible ? (
                      <TableCell key={index}>
                        {column.accessor === "description"
                          ? "Total"
                          : column.accessor === "isRequired"
                          ? filteredSections.length
                          : column.accessor === "isCompleted"
                          ? filteredSections.filter(
                              (section: any) => section.isCompleted
                            ).length
                          : null}
                      </TableCell>
                    ) : null;
                  })
                : formSectionsColumns.map((column: any, index: number) => {
                    return column.isVisible ? (
                      <TableCell key={index}>
                        {column.accessor === "description"
                          ? "Total"
                          : column.accessor === "isRequired"
                          ? formSections.length
                          : column.accessor === "isCompleted"
                          ? formSections.filter(
                              (section: any) => section.isCompleted
                            ).length
                          : null}
                      </TableCell>
                    ) : null;
                  })}
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
}

function DataTableViewOptions({
  formSectionsColumns,
  setFormSectionsColumns,
}: DataTableViewOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formSectionsColumns
          //   .filter(
          //     (column) =>
          //       typeof column.accessorFn !== "undefined" && column.getCanHide()
          //   )
          .map((column: any, index: number) => {
            return (
              <DropdownMenuCheckboxItem
                key={index}
                className="capitalize"
                checked={column.isVisible}
                onCheckedChange={(value) =>
                  setFormSectionsColumns(
                    formSectionsColumns.map((col: any) => {
                      if (col.Header === column.Header) {
                        return {
                          ...col,
                          isVisible: value,
                        };
                      }
                      return col;
                    })
                  )
                }
              >
                {column.Header}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FilterByProps {
  filterType: string;
  filterSectionsBy: (filterType: string, filter: string) => void;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
const FilterByComponent = ({
  filterType,
  filterSectionsBy,
  options,
}: FilterByProps) => {
  const [selectedValues, setSelectedValues] = useState(new Set());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {filterType}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={filterType} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      filterSectionsBy(filterType, filterValues.join(","));
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues(new Set());
                      filterSectionsBy(filterType, "");
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
