import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import React from "react";

interface RenderFramesLineProps {
  onRender: () => void;
}

const RenderFramesLine: React.FC<RenderFramesLineProps> = (props) => {
  const { onRender } = props;

  return (
    <Button onClick={onRender}>
      <Layers className="mr-2 size-4" />
      渲染采样帧栈
    </Button>
  );
};

export default RenderFramesLine;
