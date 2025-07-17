"use client";

import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionQuery } from "@/hooks/auth/useSession";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import {
  useFormTemplate,
  useCreateFormResponse,
} from "@/hooks/dynamic-forms/use-dynamic-forms";
import UserResponsesForTemplate from "./components/UserResponsesForTemplate";

type Params = Promise<{ formId: string }>;

export default function FormPage(props: { params: Params }) {
  const { formId } = use(props.params);
  const router = useRouter();

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useFormTemplate(formId);

  const {
    data: session,
    isLoading: authLoading,
  } = useSessionQuery();
  const userId = session?.user?.id;

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
    }
  }, [authLoading, session, router]);

  const createResponseMutation = useCreateFormResponse({
    formTemplateId: formId,
    sections: formTemplate?.sections,
  });

  const handleCreateNewResponse = () => {
    if (!userId) return;
    createResponseMutation.mutate({
      employeeId: userId,
      patientId: 0,
      vehicleId: 0,
      crewId: 0,
    });
  };

  if (isLoadingTemplate || authLoading) {
    return (
      <div className="container mx-auto p-4">
        Loading form template and user session...
      </div>
    );
  }

  // Don't render anything if redirecting to login
  if (!session) {
    return null;
  }

  if (templateError) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error Loading Form Template</h1>
        <p>Could not load the form template with ID: {formId}.</p>
        <p>Details: {templateError.detail}</p>
      </div>
    );
  }

  if (!formTemplate) {
    return (
      <div className="container mx-auto p-4">
        <h1>Form Template Not Found</h1>
        <p>Could not load the form template with ID: {formId}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 border-b pb-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-bold">{formTemplate.title}</h1>
          <Button
            variant="outline"
            onClick={handleCreateNewResponse}
            disabled={
              createResponseMutation.isPending || !userId || !formTemplate
            }
            className="flex items-center"
          >
            {createResponseMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusIcon className="mr-2 h-4 w-4" />
            )}
            Create New {`${formTemplate.title} Response`}
          </Button>
        </div>
        <p className="mt-1 text-gray-600">{formTemplate.description}</p>
        <p className="mt-1 text-xs text-gray-400">
          Template ID: {formTemplate.id}
        </p>
      </header>

      {userId && (
        <UserResponsesForTemplate
          templateId={formTemplate.id}
          userId={userId}
        />
      )}
    </div>
  );
}
