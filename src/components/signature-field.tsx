import React, { useRef, useCallback, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type SignatureFieldProps = {
  label: string;
  onSave: (signature: string) => void;
  onCancel: () => void;
};

export const SignatureField: React.FC<SignatureFieldProps> = ({
  label,
  onSave,
  onCancel,
}) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = useCallback(() => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsEmpty(true);
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (sigCanvas.current) {
      setIsEmpty(sigCanvas.current.isEmpty());
    }
  }, []);

  const handleSave = useCallback(() => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL();
      onSave(dataURL);
    }
  }, [onSave]);

  return (
    <div className="flex flex-col space-y-2">
      <Label>{label}</Label>
      <div className="relative rounded-md border p-2">
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={handleEnd}
          canvasProps={{
            className: "signature-canvas",
            width: 400,
            height: 200,
            "aria-label": "Signature field",
          }}
        />
        {!isEmpty && (
          <Button
            type="button"
            variant="outline"
            className="absolute right-2 top-2"
            onClick={handleClear}
            aria-label="Clear signature"
          >
            Clear
          </Button>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isEmpty}>
          Save
        </Button>
      </div>
    </div>
  );
};
