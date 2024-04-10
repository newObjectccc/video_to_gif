import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import { Download } from "lucide-react";
import React from "react";

interface ExportGifProps {
  onExport: () => void;
  disabled?: boolean;
}

const ExportGif: React.FC<ExportGifProps> = (props) => {
  const { onExport, ...restProps } = props;
  const { toast } = useToast();
  const [state] = React.useContext(TransformStateContext);

  const exportGif = () => {
    if (!state.gifStat.url) {
      toast({
        title: "请先上传视频",
        description: "请检查左侧步骤是否有错误~",
        action: <ToastAction altText="去上传">Undo</ToastAction>,
      });
      return;
    }
    onExport();
  };

  return (
    <Button {...restProps} onClick={exportGif}>
      <Download className="mr-2 size-4" />
      导出GIF
    </Button>
  );
};

export default ExportGif;
