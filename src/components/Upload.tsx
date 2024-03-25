import { Button } from "@/components/ui/button";
import { Upload as UploadIcon } from "lucide-react";
import React from "react";

interface UploadProps {
  onUpload: (file: File) => void;
  children?: React.ReactNode;
}

const Upload: React.FC<UploadProps> = (props) => {
  const { onUpload } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onUpload(files[0]);
    }
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={uploadHandler}
      />
      <Button onClick={triggerUpload}>
        <UploadIcon className="mr-2 size-4" />
        上传视频
      </Button>
    </>
  );
};

export default Upload;
