import { Frame, PencilRuler, Ruler, Scan } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ImgEditParamsContext } from "@src/contexts/ImgEditParamsContext";
import React from "react";

interface CardProps {
  className?: string;
}

export const ImgEditCard: React.FC<CardProps> = (props) => {
  const { className } = props;
  const [imgEditState, imgEditDispatch] =
    React.useContext(ImgEditParamsContext);

  return (
    <Card className={cn("w-[420px]", className)} {...props}>
      <CardHeader>
        <CardTitle className="mb-3">编辑合成面板</CardTitle>
        <CardDescription>
          通过配置蒙版来合成最终每一帧或指定帧的图片
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <Scan className="size-4" />
          <div className="">
            <p className="text-sm font-medium leading-none">应用所有</p>
          </div>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.isApplyAll ? "是" : "否"}
            </span>
            <Switch
              disabled
              checked={imgEditState.isApplyAll}
              onCheckedChange={(val) => {
                imgEditDispatch({
                  type: "isApplyAll",
                  payload: val,
                } as any);
              }}
            ></Switch>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <Frame className="size-4" />
          <p className="text-sm font-medium leading-none">文字编辑</p>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <Ruler className="size-4" />
          <p className="text-sm font-medium leading-none">蒙层特效</p>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <PencilRuler className="size-4" />
          <p className="text-sm font-medium leading-none">亮度调节</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.brightness}%
            </span>
            <Slider
              value={[imgEditState.brightness]}
              max={100}
              min={0}
              step={1}
              onValueChange={(val) => {
                imgEditDispatch({
                  type: "brightness",
                  payload: val[0],
                } as any);
              }}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
