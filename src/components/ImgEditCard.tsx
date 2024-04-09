import { Frame, PencilRuler, Ruler, Scan } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import React from "react";

interface CardProps {
  className?: string;
  imgEditState: {
    isApplyAll: boolean;
    brightness: number[];
    grayscale: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export const ImgEditCard: React.FC<CardProps> = (props) => {
  const { className, imgEditState, onChange } = props;

  return (
    <Card className={cn("w-[420px]", className)}>
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
              onCheckedChange={(val) => onChange("isApplyAll", val)}
            ></Switch>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <PencilRuler className="size-4" />
          <p className="text-sm font-medium leading-none">是否开启灰度</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.grayscale ? "是" : "否"}
            </span>
            <Switch
              checked={imgEditState.grayscale}
              onCheckedChange={(val) => onChange("grayscale", val)}
            ></Switch>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <PencilRuler className="size-4" />
          <p className="text-sm font-medium leading-none">亮度调节</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.brightness[0]}%
            </span>
            <Slider
              value={imgEditState.brightness}
              max={100}
              min={0}
              step={1}
              onValueChange={(val) => onChange("brightness", val)}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <Button className="text-sm font-medium leading-none">
          <Frame className="mr-2" size={16} />
          文字编辑
        </Button>
        <Button className="text-sm font-medium leading-none">
          <Ruler className="mr-2" size={16} />
          蒙层特效
        </Button>
      </CardContent>
    </Card>
  );
};
