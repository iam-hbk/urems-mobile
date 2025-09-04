"use client";

import { useState, useEffect } from "react";
import { getFullPrfResponse } from "@/lib/api/prf-api";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useGetFullPrfResponse } from "@/hooks/prf/usePrfForms";

type PrintablePRF = Record<
  string,
  | {
    isCompleted?: boolean;
    isOptional?: boolean;
    data?: Record<string, unknown>;
  }
  | null
  | undefined
>;

// Extended CSS style declaration that includes pageBreakInside property
type ExtendedCSSStyleDeclaration = CSSStyleDeclaration & {
  pageBreakInside?: string;
};

// Utility functions for rendering
const humanize = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
const isBase64Image = (value: unknown) =>
  typeof value === "string" && value.startsWith("data:image");

function renderValue(value: unknown): HTMLElement {
  const span = document.createElement("span");
  if (value === null || value === undefined || value === "") {
    span.textContent = "—";
    span.className = "text-muted-foreground";
    return span;
  }
  if (isBase64Image(value)) {
    const img = document.createElement("img");
    img.src = String(value);
    img.alt = "embedded";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "180px";
    (img.style as ExtendedCSSStyleDeclaration).pageBreakInside = "avoid";
    return img;
  }
  if (Array.isArray(value)) {
    const ul = document.createElement("ul");
    ul.className = "list-disc pl-5";
    if (value.length === 0) {
      const dash = document.createElement("span");
      dash.textContent = "—";
      dash.className = "text-muted-foreground";
      return dash;
    }
    value.forEach((v) => {
      const li = document.createElement("li");
      li.appendChild(renderValue(v));
      ul.appendChild(li);
    });
    return ul;
  }
  if (typeof value === "object") {
    return renderObject(value as Record<string, unknown>);
  }
  if (typeof value === "boolean") {
    span.textContent = value ? "✓" : "✗";
    span.style.fontWeight = "bold";
    span.style.fontSize = "1.2em";
    return span;
  }
  span.textContent = String(value);
  return span;
}

function renderObject(obj: Record<string, unknown>): HTMLElement {
  const wrap = document.createElement("div");
  Object.entries(obj).forEach(([k, v]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.marginBottom = "0.5rem";
    const label = document.createElement("p");
    label.textContent = `${humanize(k)}:`;
    label.style.width = "12rem";
    label.style.paddingRight = "0.75rem";
    label.style.fontWeight = "600";
    label.style.flexShrink = "0";
    const val = document.createElement("div");
    val.style.flex = "1";
    val.appendChild(renderValue(v));
    row.appendChild(label);
    row.appendChild(val);
    wrap.appendChild(row);
  });
  return wrap;
}

function buildPrintable(
  fullPrf: PrintablePRF | null | undefined,
  printableId: string,
): HTMLElement {
  const root = document.createElement("div");
  root.style.width = "1100px";
  root.style.background = "white";
  root.style.padding = "50px";

  // Header
  const headerBlock = document.createElement("div");
  headerBlock.style.marginBottom = "2rem";
  const hTop = document.createElement("div");
  hTop.style.display = "flex";
  hTop.style.justifyContent = "space-between";
  const left = document.createElement("div");
  left.style.textAlign = "center";
  const img = document.createElement("img");
  img.src = "/urems-erp.png";
  img.width = 150;
  img.height = 150;
  img.style.border = "1px solid #e5e7eb";
  left.appendChild(img);
  const brand = document.createElement("p");
  brand.textContent = "UREMSERP";
  brand.style.fontWeight = "700";
  brand.style.fontSize = "1.875rem";
  brand.style.color = "#1f2937";
  left.appendChild(brand);
  const right = document.createElement("div");
  const ts = document.createElement("p");
  ts.textContent = format(new Date(), "dd/MM/yyyy HH:mm");
  ts.style.fontSize = "0.875rem";
  right.appendChild(ts);
  hTop.appendChild(left);
  hTop.appendChild(right);
  headerBlock.appendChild(hTop);
  const title = document.createElement("div");
  title.style.textAlign = "center";
  title.style.marginTop = "1rem";
  const h1 = document.createElement("h1");
  h1.textContent = "Patient Record Form";
  h1.style.fontSize = "1.5rem";
  h1.style.fontWeight = "700";
  const pid = document.createElement("p");
  pid.textContent = `ID: ${printableId}`;
  pid.style.fontSize = "0.875rem";
  title.appendChild(h1);
  title.appendChild(pid);
  headerBlock.appendChild(title);
  root.appendChild(headerBlock);

  // Sections
  if (fullPrf) {
    Object.entries(fullPrf).forEach(([sectionKey, sectionVal]) => {
      const section = sectionVal as
        | {
          isCompleted?: boolean;
          data?: Record<string, unknown>;
        }
        | null
        | undefined;

      // Skip null or undefined sections
      if (!section) {
        return;
      }

      const block = document.createElement("div");
      block.style.breakAfter = "page";
      block.style.marginBottom = "1.5rem";
      const card = document.createElement("div");
      (card.style as ExtendedCSSStyleDeclaration).pageBreakInside = "avoid";
      card.style.border = "1px solid #e5e7eb";
      card.style.borderRadius = "0.5rem";
      const header = document.createElement("div");
      header.style.padding = "0.75rem 1rem";
      header.style.borderBottom = "1px solid #e5e7eb";
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      const titleEl = document.createElement("div");
      titleEl.textContent = humanize(sectionKey);
      titleEl.style.fontWeight = "700";
      const status = document.createElement("div");
      status.textContent = section.isCompleted ? "Completed" : "In Progress";
      status.style.fontSize = "0.75rem";
      status.style.color = "#6b7280";
      header.appendChild(titleEl);
      header.appendChild(status);
      const content = document.createElement("div");
      content.style.padding = "1rem";
      if (section.data) {
        content.appendChild(renderObject(section.data));
      } else {
        const nd = document.createElement("p");
        nd.textContent = "No data";
        nd.style.color = "#6b7280";
        content.appendChild(nd);
      }
      card.appendChild(header);
      card.appendChild(content);
      block.appendChild(card);
      root.appendChild(block);
    });
  }

  return root;
}

/**
 * Utility function to print a PRF by response ID.
 * @param prfResponseId - The PRF response ID to print
 */
export async function printPrfById(prfResponseId: string): Promise<void> {
  try {
    const result = await getFullPrfResponse(prfResponseId);
    const full = await result.match(
      async (data) => data,
      async (err) => {
        console.error("Error fetching full PRF response:", err);
        throw err;
      },
    );

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.id = "__prf_print_container";
    document.body.appendChild(container);

    const printable = buildPrintable(full as PrintablePRF, prfResponseId);
    printable.id = "prf-preview";
    container.appendChild(printable);

    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: [0.5, 0.5] as number[],
      filename: `PRF-${prfResponseId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    // Wait a frame to ensure layout
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    await html2pdf().set(opt).from(printable).save();
    toast.success("PRF printed successfully");
  } catch (error) {
    console.error("Error printing PRF:", error);
    toast.error("Failed to print PRF");
    throw error;
  } finally {
    const container = document.getElementById("__prf_print_container");
    if (container) container.remove();
  }
}

/**
 * Hook for printing PRF with loading state management.
 * @param prfResponseId - The PRF response ID to print
 */
export function usePrintPRF(prfResponseId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (prfResponseId) {
      setIsReady(true);
    }
  }, [prfResponseId]);

  const printPRF = async () => {
    if (!prfResponseId) {
      toast.error("No PRF ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await printPrfById(prfResponseId);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    printPRF,
    isLoading,
    isReady,
  };
}
interface PrintPRFProps {
  prfResponseId: string;
  variant?: "default" | "outline";
}
const RenderValue = ({ value }: { value: unknown }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }
  if (isBase64Image(value)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value as string}
        alt="embedded"
        style={{
          maxWidth: "100%",
          maxHeight: 180,
          pageBreakInside: "avoid" as const,
        }}
      />
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-muted-foreground">—</span>;
    return (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((v, i) => (
          <li key={i}>
            <RenderValue value={v} />
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return <RenderObject obj={value as Record<string, unknown>} />;
  }
  if (typeof value === "boolean") {
    return (
      <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
        {value ? "✓" : "✗"}
      </span>
    );
  }
  return <span>{String(value)}</span>;
};
const RenderObject = ({ obj }: { obj: Record<string, unknown> }) => {
  const entries = Object.entries(obj);
  if (entries.length === 0)
    return <span className="text-muted-foreground">—</span>;
  return (
    <div className="space-y-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex">
          <p className="w-48 shrink-0 pr-3 font-semibold">{humanize(k)}:</p>
          <div className="min-w-0 flex-1">
            <RenderValue value={v} />
          </div>
        </div>
      ))}
    </div>
  );
};
export function PrintPRF({
  prfResponseId,
  variant = "default",
}: PrintPRFProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    data: fullPrf,
    isLoading: isLoadingFullPrf,
    isError: isErrorFullPrf,
  } = useGetFullPrfResponse(prfResponseId);

  const printableId = prfResponseId;
  // const isFullMode = !!fullPrf;

  const handlePrint = async () => {
    const element = document.getElementById("prf-preview");
    if (!element) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: [0.5, 0.5],
        filename: `PRF-${printableId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PRF saved successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isPreviewOpen) {
    return (
      <Button onClick={() => setIsPreviewOpen(true)} variant={variant}>
        Preview & Print PRF
      </Button>
    );
  }

  if (isLoadingFullPrf) {
    return <div className="text-sm text-muted-foreground">Loading PRF…</div>;
  }
  if (isErrorFullPrf) {
    return (
      <div className="text-sm text-muted-foreground">Error loading PRF</div>
    );
  }
  if (!fullPrf) {
    return <div className="text-sm text-muted-foreground">No PRF data</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-[1200px] overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-2xl font-bold">PRF Preview</h2>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>Print PDF</Button>
          </div>
        </div>

        <div className="mx-auto w-[1100px] bg-white p-[50px]" id="prf-preview">
          {/* Header */}
          <Header printableId={printableId} />

          <div className="space-y-6">
            {Object.entries(fullPrf)
              .map(([sectionKey, sectionVal]) => {
                const section = sectionVal as
                  | {
                    isOptional?: boolean;
                    isCompleted?: boolean;
                    data?: Record<string, unknown>;
                  }
                  | null
                  | undefined;

                // Skip null or undefined sections
                if (!section) {
                  return null;
                }

                return (
                  <div key={sectionKey} className="page-break-after">
                    <Card style={{ pageBreakInside: "avoid" }}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{humanize(sectionKey)}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {section.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {section.data ? (
                          <RenderObject obj={section.data} />
                        ) : (
                          <p className="text-muted-foreground">No data</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })
              .filter(Boolean)}
          </div>
        </div>
      </div>
    </div>
  );
}

const Header = ({ printableId }: { printableId: string }) => {
  return (
    <div className="page-break-after mb-8">
      <div className="mb-8 flex flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/urems-erp.png"
            alt="UREMS ERP Logo"
            width={150}
            height={150}
            priority
            className="border"
          />
          <p className="text-2xl font-bold text-primary">
            <span>UREMS</span>
            <span className="text-red-800">ERP</span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm">{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Patient Record Form</h1>
        <p className="text-sm">ID: {printableId}</p>
      </div>
    </div>
  );
};
