import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import React from "react";

interface PreviewGifProps {
  onPreview: () => void;
  imgSrc?: string;
  children?: React.ReactNode;
}

const PreviewGif: React.FC<PreviewGifProps> = (props) => {
  const { onPreview, imgSrc } = props;
  // preview inside when imgSrc is not empty
  return (
    <Button onClick={onPreview}>
      <ScanSearch className="mr-2 size-4" />
      预览GIF
    </Button>
  );
};

export default PreviewGif;
