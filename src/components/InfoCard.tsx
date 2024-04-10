import { Frame, PencilRuler, Ruler, Scan, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import React, { useEffect } from "react";

const notifications = [
  {
    title: "上传视频",
    description: "mp4,webm...",
  },
  {
    title: "调试参数",
    description:
      "每秒采样率越高，越连贯，gif宽度高度越大越清晰，具体请参考素材",
  },
  {
    title: "播放并预览",
    description: "在预览区域预览gif的效果，预览之后才能导出",
  },
  {
    title: "导出gif",
    description: "清先确认效果，然后点击导出按钮导出gif到本地",
  },
];

type NotifyStateType = [boolean, boolean, boolean, boolean];
type CardProps = React.ComponentProps<typeof Card>;

export function InfoCard({ className, ...props }: CardProps) {
  const [state, dispatch] = React.useContext(TransformStateContext);
  const [notifyState, setNotifyState] = React.useState<NotifyStateType>([
    false,
    false,
    false,
    false,
  ]);
  useEffect(() => {
    const checkStepStat = (prev: NotifyStateType) => {
      prev[0] = !!state.videoStat.url;
      prev[1] = prev[0];
      prev[2] = !!state.gifStat.url;
      prev[3] = prev[2];
      return prev.concat() as NotifyStateType;
    };
    setNotifyState((prev) => checkStepStat(prev));
  }, [state.framesOptions, state.videoStat, state.gifStat]);
  return (
    <Card className={cn("w-[420px]", className)} {...props}>
      <CardHeader>
        <CardTitle className="mb-3">定制面板</CardTitle>
        <CardDescription>
          视频播放时同步采样，结束或暂停都会停止采样，请直接拉动进度条到你想要的开始点或直接从头开始，渲染帧栈后右键单击可编辑，删除等操作。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <Scan className="size-4" />
          <div className="">
            <p className="text-sm font-medium leading-none">帧采样率</p>
          </div>
          <div className="flex items-center flex-1 justify-end">
            {state.framesOptions.framesPicker}%
            <Slider
              value={[state.framesOptions.framesPicker!]}
              max={100}
              min={1}
              step={1}
              trackCls={
                state.framesOptions.framesPicker! > 30 ? "bg-red-500" : ""
              }
              onValueChange={(value) =>
                dispatch({
                  type: "framesOptions",
                  payload: { framesPicker: value[0] },
                } as any)
              }
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <Frame className="size-4" />
          <div className="">
            <p className="text-sm font-medium leading-none">帧延迟(毫秒)</p>
          </div>
          <div className="flex items-center flex-1 justify-end">
            {state.framesOptions.framesDelay}
            <Slider
              value={[state.framesOptions.framesDelay!]}
              max={1000}
              min={100}
              step={100}
              onValueChange={(value) =>
                dispatch({
                  type: "framesOptions",
                  payload: { framesDelay: value[0] },
                } as any)
              }
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <Ruler className="size-4" />
          <div className="">
            <p className="text-sm font-medium leading-none">gif宽度</p>
          </div>
          <div className="flex items-center flex-1 justify-end">
            {state.canvasRect.width}px
            <Slider
              value={[state.canvasRect.width!]}
              max={2560}
              min={640}
              step={10}
              onValueChange={(value) =>
                dispatch({
                  type: "canvasRect",
                  payload: { width: value[0] },
                } as any)
              }
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <PencilRuler className="size-4" />
          <div>
            <p className="text-sm font-medium leading-none">gif高度</p>
          </div>
          <div className="flex items-center flex-1 justify-end">
            {state.canvasRect.height}px
            <Slider
              value={[state.canvasRect.height!]}
              max={1440}
              min={320}
              step={10}
              onValueChange={(value) =>
                dispatch({
                  type: "canvasRect",
                  payload: { height: value[0] },
                } as any)
              }
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="mt-6">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span
                className={`flex h-2 w-2 translate-y-1 rounded-full ${
                  !notifyState[index] ? "bg-yellow-500" : "bg-green-500"
                }`}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                  {notifyState[index] ? (
                    " ✅ "
                  ) : (
                    <span className="inline-block animate-spin-slow"> ⏳ </span>
                  )}
                  {index === 0 && notifyState[index] && (
                    <span className="text-xs text-muted-foreground">{`源尺寸：${state.videoRect.width}x${state.videoRect.height}`}</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() =>
            window.open(
              "https://github.com/newObjectccc/video_to_gif",
              "_blank"
            )
          }
        >
          <Star className="mr-2 h-4 w-4" />
          Star this Repo
        </Button>
      </CardFooter>
    </Card>
  );
}
