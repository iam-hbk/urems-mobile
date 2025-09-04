"use client";
import React from "react";
import { FormResponsesTable } from "@/components/form-responses-table/FormResponsesTable";
import { useFormTemplateWithResponses } from "@/hooks/dynamic-forms/use-dynamic-forms";

interface UserResponsesForTemplateProps {
  templateId: string;
  userId: string | undefined;
}

const UserResponsesForTemplate: React.FC<UserResponsesForTemplateProps> = ({
  templateId,
  userId,
}) => {
  const {
    data: templateWithResponses,
    isLoading: isLoadingResponses,
    error: responsesError,
  } = useFormTemplateWithResponses(templateId, userId);

  if (!userId) {
    return (
      <div className="px-1 py-2 text-sm italic text-gray-500">
        User session not available.
      </div>
    );
  }
  if (isLoadingResponses) {
    return (
      <div className="px-1 py-2 text-sm italic text-gray-500">
        Loading your responses...
      </div>
    );
  }
  if (responsesError) {
    return (
      <div className="px-1 py-2 text-sm italic text-red-500">
        Error loading responses: {responsesError.detail}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">Your Previous Responses</h2>
      <FormResponsesTable
        templateId={templateId}
        initialResponses={templateWithResponses?.formResponses || []}
        isLoadingInitialResponses={isLoadingResponses}
      />
    </div>
  );
};

export default UserResponsesForTemplate; 