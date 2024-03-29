import { Button } from "@/components/ui/button";
import { BoxSelect } from "lucide-react";
import React from "react";

interface ClipRectProps {
  onClip: () => void;
  onReset: () => void;
}

const ClipRect: React.FC<ClipRectProps> = (props) => {
  const { onClip, onReset, ...restProps } = props;
  const [isShowClip, setIsShowClip] = React.useState(false);

  const clickHandler = () => {
    if (isShowClip) {
      onReset();
    } else {
      onClip();
    }
    setIsShowClip((prev) => !prev);
  };

  return (
    <Button
      {...restProps}
      variant={isShowClip ? "secondary" : "default"}
      onClick={clickHandler}
    >
      <BoxSelect className="mr-2 size-4" />
      {!isShowClip ? "截取区域" : "取消截取"}
    </Button>
  );
};

export default ClipRect;
