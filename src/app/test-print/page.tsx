"use client";

import { PrintPRF } from "@/components/PrintPRF";
import { data } from "@/utils/mock-full-prf-data";

export default function TestPrintPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test PRF Print</h1>
      <PrintPRF prf={data[0]} />
    </div>
  );
} 