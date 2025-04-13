import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Notebook } from "lucide-react";
import NotesForm from "./notes-section";

export default function NotesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-10 right-10 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
          <Notebook />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Notes Quick Edit</DialogTitle>
          <DialogDescription>
            Add or update your notes for this PRF form.
          </DialogDescription>
        </DialogHeader>
        <NotesForm />
      </DialogContent>
    </Dialog>
  );
} 