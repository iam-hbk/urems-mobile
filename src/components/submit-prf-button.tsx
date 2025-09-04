"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, Loader2, UploadCloudIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useGetPRFResponseSectionStatus,
  useUpdatePrfResponseMetadata,
} from "@/hooks/prf/usePrfForms";
import { useAuthedUser } from "@/hooks/auth/useSession";
import { toast } from "sonner";
import { PrintPRF } from "./PrintPRF";

interface SubmitPrfButtonProps {
  className?: string;
  responseStatus: "completed" | "draft";
}

export function SubmitPrfButton({
  className,
  responseStatus,
}: SubmitPrfButtonProps) {
  const pathname = usePathname();
  const prfID = pathname.split("/")[2]; // Extract prfID from /edit-prf/[prfID]/...
  const user = useAuthedUser();
  const router = useRouter();
  // Get section status to check completion
  const {
    data: statusData,
    isLoading: statusLoading,
    error: statusError,
  } = useGetPRFResponseSectionStatus(prfID);

  // Get metadata update mutation
  const updateMetadataMutation = useUpdatePrfResponseMetadata(prfID);

  // Check if all required sections are completed
  const allRequiredSectionsCompleted = React.useMemo(() => {
    if (!statusData) return false;

    const requiredSections = statusData.sections.filter(
      (section) => section.isRequired,
    );
    return requiredSections.every((section) => section.isCompleted);
  }, [statusData]);

  // Handle submission
  const handleSubmit = () => {
    if (!allRequiredSectionsCompleted || !user) return;

    // Update PRF to mark as completed
    updateMetadataMutation.mutate(
      {
        responseId: prfID,
        isCompleted: true,
        employeeId: user.id,
        updatedAt: new Date(),
      },
      {
        onSuccess: () => {
          toast.success("PRF response saved successfully!");
          router.push(`/forms`);
        },
        onError: (error: Error) => {
          toast.error(`Failed to save PRF response: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss();
        },
      },
    );
  };

  // Show loading state while checking status
  if (statusLoading) {
    return (
      <Button disabled className={className}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking status...
      </Button>
    );
  }

  // Show error state
  if (statusError) {
    return (
      <Button disabled className={className}>
        <UploadCloudIcon className="mr-2 h-4 w-4" />
        Error checking status
      </Button>
    );
  }

  const isSubmitting = updateMetadataMutation.isPending;
  const isDisabled = !allRequiredSectionsCompleted || isSubmitting || !user;

  if (responseStatus === "completed") {
    return (
      <div className="flex items-center gap-2">
        <PrintPRF prfResponseId={prfID} />
        <div className="flex items-center gap-2 rounded-md border border-green-700 px-2 py-1 text-green-700">
          <CheckCircleIcon className="mr-2 h-4 w-4" />
          PRF Saved
        </div>
      </div>
    );
  }

  return (
    <Button disabled={isDisabled} onClick={handleSubmit} className={className}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving the PRF
        </>
      ) : !user ? (
        <>
          <UploadCloudIcon className="mr-2 h-4 w-4" />
          Authentication required
        </>
      ) : !allRequiredSectionsCompleted ? (
        <>
          <UploadCloudIcon className="mr-2 h-4 w-4" />
          Submit PRF (Complete required sections first)
        </>
      ) : (
        <>
          <UploadCloudIcon className="mr-2 h-4 w-4" />
          Submit PRF
        </>
      )}
    </Button>
  );
}
