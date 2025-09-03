"use client";

import { useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { FormResponseSummary } from "@/types/form-template";

export function StoreInitializer({
  prfForms,
}: {
  prfForms: FormResponseSummary[];
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useStore.setState({ prfForms });
      initialized.current = true;
    }
  }, [prfForms]);

  return null;
}
