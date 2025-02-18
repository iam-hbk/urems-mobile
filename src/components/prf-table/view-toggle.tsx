"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "table" | "summary";
  onViewChange: (view: "table" | "summary") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          view === "table" && "bg-muted hover:bg-muted"
        )}
        onClick={() => onViewChange("table")}
      >
        <Table2 className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          view === "summary" && "bg-muted hover:bg-muted"
        )}
        onClick={() => onViewChange("summary")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Summary view</span>
      </Button>
    </div>
  );
} 