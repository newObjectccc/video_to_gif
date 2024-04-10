import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import React from "react";

interface RenderFramesLineProps {
  onRender: () => void;
  children?: React.ReactNode;
}

const RenderFramesLine: React.FC<RenderFramesLineProps> = (props) => {
  const { onRender, children = "渲染采样帧栈" } = props;

  return (
    <Button onClick={onRender}>
      <Layers className="mr-2 size-4" />
      {children}
    </Button>
  );
};

export default RenderFramesLine;
