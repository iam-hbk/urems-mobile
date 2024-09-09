"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";

export function StoreInitializer({ prfForms }: { prfForms: PRF_FORM[] }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useStore.setState({ prfForms });
    initialized.current = true;
  }
  return null;
}
