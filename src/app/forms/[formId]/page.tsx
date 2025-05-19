"use client";

import {
  FormTemplate,
  FormTemplateWithResponses,
  FormResponseSummary as UserFormResponseSummary,
  DetailedFormResponse,
} from "@/types/form-template";
import FormSectionRenderer from "@/components/dynamic-form/FormSectionRenderer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { use } from "react";
import {
  fetchFormTemplateById,
  fetchFormTemplateWithResponses,
  createFormResponse,
} from "../api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Params = Promise<{ formId: string }>;

interface UserResponsesForTemplateProps {
  templateId: string;
  userId: number | undefined;
}

const UserResponsesForTemplate: React.FC<UserResponsesForTemplateProps> = ({
  templateId,
  userId,
}) => {
  const {
    data: templateWithResponses,
    isLoading: isLoadingResponses,
    error: responsesError,
  } = useQuery<FormTemplateWithResponses | null, Error>({
    queryKey: ["formTemplateWithResponses", templateId],
    queryFn: () => fetchFormTemplateWithResponses(templateId),
    enabled: !!templateId,
    staleTime: 1000 * 60 * 5,
  });

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
        Error loading responses: {responsesError.message}
      </div>
    );
  }

  // TODO: This check will be done on the server side.
  // const userResponses =
  //   templateWithResponses?.formResponses.filter(
  //     (resp) => resp.employeeId === userId,
  //   ) || [];

  const userResponses = templateWithResponses?.formResponses || [];

  if (userResponses.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-600">
        You have not created any responses for this form yet.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">Your Previous Responses</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Response ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userResponses.map((response) => (
            <TableRow key={response.id} className="text-sm hover:bg-slate-50">
              <TableCell>
                <Link
                  href={`/forms/responses/${response.id}`}
                  className="text-blue-600 hover:underline"
                >
                  #{response.id.substring(0, 8)}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(response.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {response.isCompleted ? (
                  <Badge
                    variant="default"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    variant="default"
                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    In Progress
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/forms/responses/${response.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function DynamicFormPage(props: { params: Params }) {
  const { formId } = use(props.params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: formTemplate,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useQuery<FormTemplate | null, Error>({
    queryKey: ["formTemplate", formId],
    queryFn: () => fetchFormTemplateById(formId),
    enabled: !!formId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: session, loading: authLoading } = authClient.useSession();
  const userId = session?.user?.employeeNumber
    ? Number(session.user.employeeNumber)
    : undefined;

  const createResponseMutation = useMutation<DetailedFormResponse, Error, void>(
    {
      mutationFn: async () => {
        if (!formTemplate || !userId) {
          throw new Error("Form template or user ID is not available.");
        }
        return createFormResponse({
          formTemplateId: formTemplate.id,
          employeeId: userId,
          patientId: 0,
          vehicleId: 0,
          crewId: 0,
        });
      },
      onSuccess: (newResponseData) => {
        toast.success("New form response created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["formTemplateWithResponses", formTemplate?.id],
        });

        const firstSectionId = formTemplate?.sections?.[0]?.id;
        if (firstSectionId) {
          router.push(
            `/forms/${formTemplate!.id}/section/${firstSectionId}?responseId=${newResponseData.id}`,
          );
        } else {
          toast.info("Form has no sections. Staying on current page.");
          router.push(
            `/forms/${formTemplate!.id}?newResponseId=${newResponseData.id}`,
          );
        }
      },
      onError: (error) => {
        toast.error(`Failed to create response: ${error.message}`);
      },
    },
  );

  const handleCreateNewResponse = () => {
    createResponseMutation.mutate();
  };

  if (isLoadingTemplate || authLoading) {
    return (
      <div className="container mx-auto p-4">
        Loading form template and user session...
      </div>
    );
  }

  if (templateError) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error Loading Form Template</h1>
        <p>Could not load the form template with ID: {formId}.</p>
        <p>Details: {templateError.message}</p>
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
            Create New Response
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
