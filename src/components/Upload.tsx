import React from "react";

interface UploadProps {
  onUpload: (file: File) => void;
  children?: React.ReactNode;
}

const Upload: React.FC<UploadProps> = (props) => {
  const { onUpload } = props;
  const uploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onUpload(files[0]);
    }
  };
  return (
    <div>
      <label htmlFor="upload">upload</label>
      <input id="upload" type="file" onChange={uploadHandler} />
    </div>
  );
};

export default Upload;
