import { Button } from "@/components/ui/button";
import { TransformStateContext } from "@src/App";
import { Download } from "lucide-react";
import React from "react";

interface ExportGifProps {
  onExport: () => void;
}

const ExportGif: React.FC<ExportGifProps> = (props) => {
  const { onExport } = props;
  const [state] = React.useContext(TransformStateContext);

  const exportGif = () => {
    if (!state.gifStat.url) return;
    onExport();
  };

  return (
    <Button onClick={exportGif}>
      <Download className="mr-2 size-4" />
      导出GIF
    </Button>
  );
};

export default ExportGif;
