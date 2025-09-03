import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type SignaturePreviewProps = {
  label: string;
  value: string | undefined;
  onEdit: (event: React.MouseEvent) => void;
};

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  label,
  value,
  onEdit,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </div>
      {value && value.trim() !== "" ? (
        <div className="rounded-md border p-2">
          <Image src={value} alt={label} width={400} height={200} />
        </div>
      ) : (
        <div className="rounded-md border p-2 text-center text-gray-500">
          No signature
        </div>
      )}
    </div>
  );
};
