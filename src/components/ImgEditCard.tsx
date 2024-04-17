import {
  Aperture,
  AudioLines,
  CircleDashed,
  CirclePower,
  Radiation,
  SunMedium,
  SwatchBook,
} from "lucide-react";

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
    hue: number;
    saturation: number;
    luminance: number;
    noise: number;
    pixelate: number;
    blurRadius: number;
    grayscale: boolean;
  };
  onChange: (field: keyof CardProps["imgEditState"], value: any) => void;
}

export const ImgEditCard: React.FC<CardProps> = (props) => {
  const { className, imgEditState, onChange } = props;

  return (
    <Card className={cn("w-[420px]", className)}>
      <CardHeader>
        <CardTitle className="mb-3">编辑合成面板</CardTitle>
        <CardDescription>
          您可以在这里编辑每一帧或指定帧，修改参数后点击渲染编辑帧按钮渲染帧到gif栈中，右键单击可以删除渲染帧，编辑完，先预览，才能导出。（gif由所有编辑帧组成）
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <CirclePower className="size-4" />
          <p className="text-sm font-medium leading-none">开启灰度图像</p>
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
          <SwatchBook className="size-4" />
          <p className="text-sm font-medium leading-none">色调</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.hue}
            </span>
            <Slider
              value={[imgEditState.hue]}
              max={259}
              min={0}
              step={1}
              onValueChange={(val) => onChange("hue", val[0])}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <CircleDashed className="size-4" />
          <p className="text-sm font-medium leading-none">饱和度</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.saturation}
            </span>
            <Slider
              value={[imgEditState.saturation]}
              max={10}
              min={-2}
              step={0.5}
              onValueChange={(val) => onChange("saturation", val[0])}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <SunMedium className="size-4" />
          <p className="text-sm font-medium leading-none">亮度</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.luminance}
            </span>
            <Slider
              value={[imgEditState.luminance]}
              max={2}
              min={-2}
              step={0.1}
              onValueChange={(val) => onChange("luminance", val[0])}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <AudioLines className="size-4" />
          <p className="text-sm font-medium leading-none">噪点</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.noise}
            </span>
            <Slider
              value={[imgEditState.noise]}
              max={4}
              min={0}
              step={0.1}
              onValueChange={(val) => onChange("noise", val[0])}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <Aperture className="size-4" />
          <p className="text-sm font-medium leading-none">像素大小</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.pixelate}
            </span>
            <Slider
              value={[imgEditState.pixelate]}
              max={20}
              min={1}
              step={1}
              onValueChange={(val) => onChange("pixelate", val[0])}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border px-2 h-10">
          <Radiation className="size-4" />
          <p className="text-sm font-medium leading-none">模糊半径</p>
          <div className="flex items-center flex-1 justify-end">
            <span className="text-sm font-medium leading-none mr-1">
              {imgEditState.blurRadius}
            </span>
            <Slider
              value={[imgEditState.blurRadius]}
              max={40}
              min={0}
              step={0.05}
              onValueChange={(val) => onChange("blurRadius", val[0])}
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        {/* <Button className="text-sm font-medium leading-none">
          <Frame className="mr-2" size={16} />
          文字编辑
        </Button>
        <Button className="text-sm font-medium leading-none">
          <Ruler className="mr-2" size={16} />
          蒙层特效
        </Button> */}
      </CardContent>
    </Card>
  );
};
