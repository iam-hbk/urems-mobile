import { Asterisk, CheckCircle, Dot, Square } from "lucide-react";

export const statuses = [
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
  },
  {
    value: "incomplete",
    label: "Not Completed",
    icon: Square,
  },
];

export const priorities = [
  {
    label: "Required",
    value: "required",
    icon: Asterisk,
  },
  {
    label: "Optional",
    value: "optional",
    icon: Dot,
  },
];
