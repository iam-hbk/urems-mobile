"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { FormTemplate } from "@/types/form-template";
import { fetchFormTemplateById } from "@/app/forms/api";

interface BreadcrumbPart {
  name: React.ReactNode;
  path: string;
  isCurrentPage?: boolean;
}

const AppBreadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const formsSegmentIndex = segments.indexOf("forms");
  const formId =
    formsSegmentIndex !== -1 && segments.length > formsSegmentIndex + 1
      ? segments[formsSegmentIndex + 1]
      : null;
  const responseId =
    formsSegmentIndex !== -1 && segments.length > formsSegmentIndex + 2
      ? segments[formsSegmentIndex + 2]
      : null;
  const sectionId =
    formsSegmentIndex !== -1 && segments.length > formsSegmentIndex + 3
      ? segments[formsSegmentIndex + 3]
      : null;

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    error: formTemplateError,
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: async () => {
      if (!formId) return null;
      // console.log(`Fetching form template for ID: ${formId}`);
      try {
        const template = await fetchFormTemplateById(formId);
        // console.log("Fetched template:", template);
        return template;
      } catch (err) {
        // console.error("Error fetching form template:", err);
        return null; // Or throw err if you want react-query to handle it as an error state
      }
    },
    enabled: !!formId && formsSegmentIndex !== -1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  const breadcrumbItems: BreadcrumbPart[] = [];

  // Always add Home
  breadcrumbItems.push({
    name: (
      <Badge className="whitespace-nowrap rounded-md bg-blue-600 hover:bg-blue-700">
        Home
      </Badge>
    ),
    path: "/",
    isCurrentPage: pathname === "/",
  });

  if (formsSegmentIndex !== -1) {
    // Path includes "forms"
    breadcrumbItems.push({
      name: (
        <Badge className="whitespace-nowrap rounded-md bg-sky-600 hover:bg-sky-700">
          Forms List
        </Badge>
      ),
      path: "/forms",
      isCurrentPage: pathname === "/forms",
    });

    if (formId) {
      let formName: React.ReactNode = "Form"; // Default
      if (isLoadingTemplate) {
        formName = "Loading Form...";
      } else if (formTemplateError) {
        formName = "Error";
      } else if (formTemplate) {
        formName = formTemplate.title || `Form ${formId.substring(0,6)}`;
      } else {
        formName = `Form ${formId.substring(0,6)}`;
      }
      if (typeof formName === "string" && formName.length > 25) {
        formName = `${formName.substring(0, 22)}...`;
      }

      breadcrumbItems.push({
        name: (
          <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
            {formName}
          </Badge>
        ),
        path: `/forms/${formId}`,
        isCurrentPage: pathname === `/forms/${formId}`,
      });

      if (responseId) {
        breadcrumbItems.push({
          name: (
            <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
              Response #{responseId.substring(0, 8)}
            </Badge>
          ),
          path: `/forms/${formId}/${responseId}`,
          isCurrentPage: pathname === `/forms/${formId}/${responseId}`,
        });

        if (sectionId) {
          let sectionNameNode: React.ReactNode = "Section";
          if (isLoadingTemplate) {
            sectionNameNode = "Loading Section...";
          } else if (formTemplate && formTemplate.sections) {
            const section = formTemplate.sections.find((s) => s.id === sectionId);
            sectionNameNode = section?.name || `Section ${sectionId.substring(0,6)}`;
          } else {
            sectionNameNode = `Section ${sectionId.substring(0,6)}`;
          }
          if (typeof sectionNameNode === "string" && sectionNameNode.length > 25) {
            sectionNameNode = `${sectionNameNode.substring(0, 22)}...`;
          }
          breadcrumbItems.push({
            name: (
              <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
                {sectionNameNode}
              </Badge>
            ),
            path: `/forms/${formId}/${responseId}/${sectionId}`,
            isCurrentPage: pathname === `/forms/${formId}/${responseId}/${sectionId}`,
          });
        }
      }
    }
  } else if (pathname !== "/") {
    // Generic breadcrumbs for non-form, non-home paths
    let currentBuiltPath = "";
    segments.forEach((segment) => {
      currentBuiltPath += `/${segment}`;
      // Avoid duplicating "Home" if segments is empty or first segment is home (though filter(Boolean) handles empty)
      if (currentBuiltPath === "/") return;

      if (!breadcrumbItems.find(b => b.path === currentBuiltPath)) {
        breadcrumbItems.push({
          name: (
            <Badge className="whitespace-nowrap rounded-md bg-gray-400 capitalize hover:bg-gray-500">
              {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")}
            </Badge>
          ),
          path: currentBuiltPath,
          isCurrentPage: pathname === currentBuiltPath,
        });
      }
    });
  }
  
  // Filter out items that are not part of the current path hierarchy
  // and set isCurrentPage correctly for the *last* relevant item.
  const finalBreadcrumbItems = breadcrumbItems.reduce((acc, item, index, arr) => {
    if (pathname.startsWith(item.path)) {
        // Mark all previous items in accumulator as not current
        acc.forEach(prevItem => prevItem.isCurrentPage = false);
        // Current item is potentially the current page or a parent
        item.isCurrentPage = (pathname === item.path);
        acc.push(item);
    }
    // If this is the last item overall and no item has been marked as current yet,
    // this implies a mismatch or a base path like "/", check if it's the one.
     if (index === arr.length -1 && !acc.find(it => it.isCurrentPage) && acc.length > 0) {
        const lastAccItem = acc[acc.length -1];
        if (pathname === lastAccItem.path) {
            lastAccItem.isCurrentPage = true;
        }
    }
    return acc;
  }, [] as BreadcrumbPart[]);


  // Ensure only the last item that is truly the current page is marked as such.
  let foundCurrentPage = false;
  for (let i = finalBreadcrumbItems.length - 1; i >= 0; i--) {
    if (finalBreadcrumbItems[i].isCurrentPage) {
      if (foundCurrentPage) {
        finalBreadcrumbItems[i].isCurrentPage = false; // Only one true current page (the most specific one)
      }
      foundCurrentPage = true;
    }
  }
  
  // If after all, no item is current (e.g. path is /forms but only Home and Forms List are built and /forms is current)
  // and the pathname matches the last item's path in the filtered list, mark it current.
  if (!foundCurrentPage && finalBreadcrumbItems.length > 0) {
    const lastItem = finalBreadcrumbItems[finalBreadcrumbItems.length - 1];
    if (pathname === lastItem.path) {
      lastItem.isCurrentPage = true;
    }
  }


  if (finalBreadcrumbItems.length === 0 || (finalBreadcrumbItems.length === 1 && finalBreadcrumbItems[0].path === "/" && pathname !== "/")) {
     // If only "Home" is left but we are not on the Home page, or if list is empty, render nothing.
     // Exception: if path is "/" then "Home" should be shown.
     if (pathname === "/") {
        // Keep "Home"
     } else {
        return null;
     }
  }
  
  // If still only home is there, but it's not the current page (e.g. viewing /settings, and only Home breadcrumb was pushed)
  // And we don't want to show "Home" for /settings, this is where we would return null.
  // The above check handles this.
  
  // If after filtering, the only item is "Home" but it's not the current page, don't render.
  if (finalBreadcrumbItems.length === 1 && finalBreadcrumbItems[0].path === "/" && !finalBreadcrumbItems[0].isCurrentPage) {
    return null;
  }


  return (
    <Breadcrumb className="mb-4 hidden md:flex">
      <BreadcrumbList>
        {finalBreadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path + '-' + index}>
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < finalBreadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumbs;
