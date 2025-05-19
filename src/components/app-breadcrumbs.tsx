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

  const formsSegmentIndex = segments.indexOf("forms");

  if (formsSegmentIndex === -1) {
    return null; // Not a forms path, render nothing
  }

  const formId =
    segments.length > formsSegmentIndex + 1
      ? segments[formsSegmentIndex + 1]
      : null;

  const isSectionPath =
    formId &&
    segments.length > formsSegmentIndex + 2 &&
    segments[formsSegmentIndex + 2] === "section";

  const sectionId =
    isSectionPath && segments.length > formsSegmentIndex + 3
      ? segments[formsSegmentIndex + 3]
      : null;

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    // error: templateError, // Can be used for error display
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: () => (formId ? fetchFormTemplateById(formId) : Promise.resolve(null)),
    enabled: !!formId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const breadcrumbItems: BreadcrumbPart[] = [];

  // 1. Forms List
  breadcrumbItems.push({
    name: (
      <Badge className="whitespace-nowrap rounded-md bg-sky-600 hover:bg-sky-700">
        Forms List
      </Badge>
    ),
    path: "/forms",
    isCurrentPage: pathname === "/forms",
  });

  // 2. Form Title
  if (formId) {
    let formName: React.ReactNode = isLoadingTemplate
      ? "Loading..."
      : formTemplate?.title || formId;
    if (typeof formName === 'string' && formName.length > 35) {
        formName = `${formName.substring(0, 32)}...`;
    }
    breadcrumbItems.push({
      name: (
        <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
          {formName}
        </Badge>
      ),
      path: `/forms/${formId}`,
      isCurrentPage: pathname === `/forms/${formId}` && !isSectionPath,
    });
  }

  // 3. Section Name
  if (formId && isSectionPath && sectionId) {
    let sectionNameNode: React.ReactNode = sectionId;
    if (isLoadingTemplate) {
      sectionNameNode = "Loading section...";
    } else if (formTemplate && formTemplate.sections) {
      const section = formTemplate.sections.find((s) => s.id === sectionId);
      sectionNameNode = section?.name || sectionId;
    }
     if (typeof sectionNameNode === 'string' && sectionNameNode.length > 35) {
        sectionNameNode = `${sectionNameNode.substring(0, 32)}...`;
    }
    breadcrumbItems.push({
      name: (
        <Badge className="whitespace-nowrap rounded-md bg-slate-500 capitalize hover:bg-slate-600">
          {sectionNameNode}
        </Badge>
      ),
      path: `/forms/${formId}/section/${sectionId}`,
      isCurrentPage: pathname === `/forms/${formId}/section/${sectionId}`,
    });
  }
  
  // Filter out items if path is shorter (e.g. on /forms, only show "Forms List")
  const finalBreadcrumbItems = breadcrumbItems.filter(item => pathname.startsWith(item.path));

  // Ensure current page logic is correct
  finalBreadcrumbItems.forEach((item, index, arr) => {
    item.isCurrentPage = item.path === pathname;
    // If on /forms/formId, and section breadcrumb exists, formId is not current
    if(item.path === `/forms/${formId}` && pathname.includes(`/section/`)){
        item.isCurrentPage = false;
    }
  });
  
  // If we are on /forms, only "Forms List" should be shown.
  if (pathname === "/forms" && finalBreadcrumbItems.length > 1) {
    const formsListCrumb = finalBreadcrumbItems.find(item => item.path === "/forms");
    finalBreadcrumbItems.length = 0; // Clear array
    if (formsListCrumb) {
        formsListCrumb.isCurrentPage = true;
        finalBreadcrumbItems.push(formsListCrumb);
    }
  }


  if (finalBreadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {finalBreadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path + index}>
            {index > 0 && <BreadcrumbSeparator />}
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