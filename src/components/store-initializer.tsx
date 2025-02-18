"use client";

import { useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";

export function StoreInitializer({ prfForms }: { prfForms: PRF_FORM[] }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useStore.setState({ prfForms });
      initialized.current = true;
    }
  }, [prfForms]);

  return null;
}
