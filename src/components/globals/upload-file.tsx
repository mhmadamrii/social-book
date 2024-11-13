"use client";

import { Dispatch, SetStateAction, useRef } from "react";
import { useUploadThing } from "~/lib/uploadthing";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";

export function UploadFile({
  setFile,
  setIsUploading,
}: {
  setFile: Dispatch<SetStateAction<any>>;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("success upload", res);
      setFile(res[0]);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
    onUploadError: (e) => {
      alert(JSON.stringify(e));
    },
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(event.target.files);
    if (!file) return;

    if (file) {
      startUpload([file]);
    }
  };

  return (
    <div className="flex h-full items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the input
      />

      <Button variant="ghost" onClick={handleButtonClick}>
        <ImageIcon className="text-primary" size={20} />
      </Button>
    </div>
  );
}
