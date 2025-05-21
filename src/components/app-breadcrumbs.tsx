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
import { fetchFormTemplateById } from "@/app/forms/api"; // Adjusted import path

interface BreadcrumbPart {
  name: React.ReactNode;
  path: string;
  isCurrentPage?: boolean;
}

const AppBreadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbItems: BreadcrumbPart[] = [
    {
      name: (
        <Badge className="whitespace-nowrap rounded-md bg-blue-600 hover:bg-blue-700">
          Home
        </Badge>
      ),
      path: "/",
      isCurrentPage: pathname === "/",
    },
  ];

  const formsSegmentIndex = segments.indexOf("forms");

  if (formsSegmentIndex === -1) {
    return null; // Not a forms path, render nothing
  }

  const formId =
    segments.length > formsSegmentIndex + 1
      ? segments[formsSegmentIndex + 1]
      : null;

  const responseId =
    segments.length > formsSegmentIndex + 2
      ? segments[formsSegmentIndex + 2]
      : null;

  const sectionId =
    segments.length > formsSegmentIndex + 3
      ? segments[formsSegmentIndex + 3]
      : null;

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: async () => {
      if (!formId) return null;
      return fetchFormTemplateById(formId);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Generic breadcrumb generation
  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLastSegment = index === segments.length - 1;

    // Skip "forms" segment itself if formId is present, as "Forms List" will be added
    if (segment.toLowerCase() === "forms" && formId) {
      if (!breadcrumbItems.find((item) => item.path === "/forms")) {
        breadcrumbItems.push({
          name: (
            <Badge className="whitespace-nowrap rounded-md bg-sky-600 hover:bg-sky-700">
              Forms List
            </Badge>
          ),
          path: "/forms",
          isCurrentPage: pathname === "/forms" && !formId, // Only current if exactly on /forms
        });
      }
      return; // Continue to next segment, Forms List badge handles this
    }

    // Logic for Form Title
    if (
      formId &&
      currentPath === `/forms/${formId}` &&
      segments[formsSegmentIndex + 1] === segment
    ) {
      let formName: React.ReactNode = isLoadingTemplate
        ? "Loading..."
        : formTemplate?.title || formId;
      if (typeof formName === "string" && formName.length > 35) {
        formName = `${formName.substring(0, 32)}...`;
      }
      breadcrumbItems.push({
        name: (
          <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
            {formName}
          </Badge>
        ),
        path: `/forms/${formId}`,
        isCurrentPage: pathname === `/forms/${formId}` && !responseId,
      });
      return; // Handled by specific form logic
    }

    // Logic for Response ID
    if (
      formId &&
      responseId &&
      currentPath === `/forms/${formId}/${responseId}` &&
      segments[formsSegmentIndex + 2] === segment
    ) {
      breadcrumbItems.push({
        name: (
          <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
            Response #{responseId.substring(0, 8)}
          </Badge>
        ),
        path: `/forms/${formId}/${responseId}`,
        isCurrentPage: pathname === `/forms/${formId}/${responseId}` && !sectionId,
      });
      return;
    }

    // Logic for Section Name
    if (
      formId &&
      responseId &&
      sectionId &&
      currentPath === `/forms/${formId}/${responseId}/${sectionId}` &&
      segments[formsSegmentIndex + 3] === segment
    ) {
      let sectionNameNode: React.ReactNode = sectionId;
      if (isLoadingTemplate) {
        sectionNameNode = "Loading section...";
      } else if (formTemplate && formTemplate.sections) {
        const section = formTemplate.sections.find((s) => s.id === sectionId);
        sectionNameNode = section?.name || sectionId;
      }
      if (typeof sectionNameNode === "string" && sectionNameNode.length > 35) {
        sectionNameNode = `${sectionNameNode.substring(0, 32)}...`;
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
      return; // Handled by specific section logic
    }

    // Default segment handling (if not home, forms, formId, responseId, or sectionId)
    if (currentPath !== "/") {
      const isFormsPath = formsSegmentIndex !== -1;
      const isPartOfFormsStructure =
        isFormsPath &&
        (currentPath.startsWith("/forms/") || currentPath === "/forms");

      if (
        !isPartOfFormsStructure ||
        (segment.toLowerCase() !== "forms" &&
          segment !== formId &&
          segment !== responseId &&
          segment !== sectionId)
      ) {
        breadcrumbItems.push({
          name: (
            <Badge className="whitespace-nowrap rounded-md bg-gray-400 capitalize hover:bg-gray-500">
              {segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " ")}
            </Badge>
          ),
          path: currentPath,
          isCurrentPage: isLastSegment,
        });
      }
    }
  });

  // Filter out items if path is shorter (e.g. on /forms, only show "Forms List")
  // const finalBreadcrumbItems = breadcrumbItems.filter(item => pathname.startsWith(item.path));
  const finalBreadcrumbItems = [...breadcrumbItems]; // Start with all generated items

  // Ensure current page logic is correct, and remove subsequent items if a parent is current
  let foundCurrent = false;
  for (let i = finalBreadcrumbItems.length - 1; i >= 0; i--) {
    const item = finalBreadcrumbItems[i];
    if (foundCurrent) {
      // If a later item was already marked current (more specific path), this one isn't
      item.isCurrentPage = false;
    } else if (pathname === item.path) {
      item.isCurrentPage = true;
      foundCurrent = true;
    } else if (pathname.startsWith(item.path + "/")) {
      item.isCurrentPage = false; // Parent path, not current
    } else {
      // If path doesn't even start with item.path, it's not relevant unless it's a root like '/'
      if (item.path !== "/" && !pathname.startsWith(item.path)) {
        // This logic might need refinement if there are non-hierarchical paths
      }
      item.isCurrentPage = false;
    }
  }

  // If no item is marked as current (e.g. pathname is just "/"), the last one matching the start of the path becomes current.
  if (
    !finalBreadcrumbItems.some((item) => item.isCurrentPage) &&
    finalBreadcrumbItems.length > 0
  ) {
    let bestMatchIndex = -1;
    for (let i = 0; i < finalBreadcrumbItems.length; i++) {
      if (pathname.startsWith(finalBreadcrumbItems[i].path)) {
        bestMatchIndex = i;
      }
    }
    if (bestMatchIndex !== -1) {
      // Ensure only the *most specific* match is current
      for (let i = 0; i < finalBreadcrumbItems.length; i++) {
        finalBreadcrumbItems[i].isCurrentPage = i === bestMatchIndex;
      }
      // And if this best match is a prefix, remove items after it
      if (
        pathname !== finalBreadcrumbItems[bestMatchIndex].path &&
        finalBreadcrumbItems.length > bestMatchIndex + 1
      ) {
        finalBreadcrumbItems.splice(bestMatchIndex + 1);
      }
    }
  }

  // Remove items that are "after" the current page in a deeper path that doesn't match
  const currentPageIndex = finalBreadcrumbItems.findIndex(
    (item) => item.isCurrentPage,
  );
  if (
    currentPageIndex !== -1 &&
    finalBreadcrumbItems.length > currentPageIndex + 1
  ) {
    finalBreadcrumbItems.splice(currentPageIndex + 1);
  }

  // Special handling for /forms path - ensure only Home and Forms List are shown
  if (pathname === "/forms") {
    const homeCrumb = finalBreadcrumbItems.find((item) => item.path === "/");
    const formsListCrumb = finalBreadcrumbItems.find(
      (item) => item.path === "/forms",
    );
    finalBreadcrumbItems.length = 0; // Clear array
    if (homeCrumb) {
      homeCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(homeCrumb);
    }
    if (formsListCrumb) {
      formsListCrumb.isCurrentPage = true;
      finalBreadcrumbItems.push(formsListCrumb);
    }
  } else if (
    pathname.startsWith("/forms/") &&
    formId &&
    !responseId
  ) {
    // On /forms/formId path
    const homeCrumb = finalBreadcrumbItems.find((item) => item.path === "/");
    const formsListCrumb = finalBreadcrumbItems.find(
      (item) => item.path === "/forms",
    );
    const formCrumb = finalBreadcrumbItems.find(
      (item) => item.path === `/forms/${formId}`,
    );
    finalBreadcrumbItems.length = 0;
    if (homeCrumb) {
      homeCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(homeCrumb);
    }
    if (formsListCrumb) {
      formsListCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(formsListCrumb);
    }
    if (formCrumb) {
      formCrumb.isCurrentPage = true;
      finalBreadcrumbItems.push(formCrumb);
    }
  } else if (
    pathname.startsWith("/forms/") &&
    formId &&
    responseId &&
    !sectionId
  ) {
    // On /forms/formId/responseId path
    const homeCrumb = finalBreadcrumbItems.find((item) => item.path === "/");
    const formsListCrumb = finalBreadcrumbItems.find(
      (item) => item.path === "/forms",
    );
    const formCrumb = finalBreadcrumbItems.find(
      (item) => item.path === `/forms/${formId}`,
    );
    const responseCrumb = finalBreadcrumbItems.find(
      (item) => item.path === `/forms/${formId}/${responseId}`,
    );
    finalBreadcrumbItems.length = 0;
    if (homeCrumb) {
      homeCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(homeCrumb);
    }
    if (formsListCrumb) {
      formsListCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(formsListCrumb);
    }
    if (formCrumb) {
      formCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(formCrumb);
    }
    if (responseCrumb) {
      responseCrumb.isCurrentPage = true;
      finalBreadcrumbItems.push(responseCrumb);
    }
  } else if (
    pathname.startsWith("/forms/") &&
    formId &&
    responseId &&
    sectionId
  ) {
    // On /forms/formId/responseId/sectionId path
    const homeCrumb = finalBreadcrumbItems.find((item) => item.path === "/");
    const formsListCrumb = finalBreadcrumbItems.find(
      (item) => item.path === "/forms",
    );
    const formCrumb = finalBreadcrumbItems.find(
      (item) => item.path === `/forms/${formId}`,
    );
    const responseCrumb = finalBreadcrumbItems.find(
      (item) => item.path === `/forms/${formId}/${responseId}`,
    );
    const sectionCrumb = finalBreadcrumbItems.find(
      (item) => item.path === `/forms/${formId}/${responseId}/${sectionId}`,
    );
    finalBreadcrumbItems.length = 0;
    if (homeCrumb) {
      homeCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(homeCrumb);
    }
    if (formsListCrumb) {
      formsListCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(formsListCrumb);
    }
    if (formCrumb) {
      formCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(formCrumb);
    }
    if (responseCrumb) {
      responseCrumb.isCurrentPage = false;
      finalBreadcrumbItems.push(responseCrumb);
    }
    if (sectionCrumb) {
      sectionCrumb.isCurrentPage = true;
      finalBreadcrumbItems.push(sectionCrumb);
    }
  }

  // If only "Home" exists and current path is not "/", it means no other specific breadcrumbs were generated.
  // This can happen for top-level paths that aren't "forms". We should add the current segment.
  if (
    finalBreadcrumbItems.length === 1 &&
    finalBreadcrumbItems[0].path === "/" &&
    pathname !== "/"
  ) {
    segments.forEach((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      // Avoid adding if it's already there (e.g. Home)
      if (!finalBreadcrumbItems.find((b) => b.path === path)) {
        finalBreadcrumbItems.push({
          name: (
            <Badge className="whitespace-nowrap rounded-md bg-gray-400 capitalize hover:bg-gray-500">
              {segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " ")}
            </Badge>
          ),
          path: path,
          isCurrentPage: path === pathname,
        });
      }
    });
    // Recalculate current page for these new items
    finalBreadcrumbItems.forEach(
      (item) => (item.isCurrentPage = item.path === pathname),
    );
  }

  if (finalBreadcrumbItems.length === 0 && pathname === "/") {
    // Special case for root path if somehow everything else was cleared
    finalBreadcrumbItems.push({
      name: (
        <Badge className="whitespace-nowrap rounded-md bg-blue-600 hover:bg-blue-700">
          Home
        </Badge>
      ),
      path: "/",
      isCurrentPage: true,
    });
  } else if (
    finalBreadcrumbItems.length > 0 &&
    finalBreadcrumbItems[0].path === "/" &&
    pathname === "/"
  ) {
    finalBreadcrumbItems[0].isCurrentPage = true;
  } else if (
    finalBreadcrumbItems.length > 1 &&
    finalBreadcrumbItems[0].path === "/" &&
    pathname !== "/"
  ) {
    finalBreadcrumbItems[0].isCurrentPage = false; // Home is not current if there are other segments
  }

  if (finalBreadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {finalBreadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path + index}>
            {index > 0 && (
              <BreadcrumbSeparator className="mx-1 text-gray-300">
                |
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumbs;
