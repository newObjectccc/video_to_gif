import { Scan, Star } from "lucide-react";

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
import { TransformStateContext } from "@src/App";
import React from "react";

const notifications = [
  {
    title: "上传视频",
    description: "mp4,webm...",
  },
  {
    title: "播放并预览",
    description: "在预览区域预览gif的效果",
  },
  {
    title: "导出gif",
    description: "清先确认效果，然后导出gif到本地",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function InfoCard({ className, ...props }: CardProps) {
  const [state, dispatch] = React.useContext(TransformStateContext);
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle className="mb-3">定制面板</CardTitle>
        <CardDescription>在这里可以定制你的gif，采样率，等等。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Scan />
          <div className="">
            <p className="text-sm font-medium leading-none">帧采样率</p>
          </div>
          <div className="flex items-center flex-1 justify-end">
            {state.framesOptions.framesPicker}
            <Slider
              value={[state.framesOptions.framesPicker!]}
              max={100}
              min={1}
              step={1}
              onValueChange={(value) =>
                dispatch({
                  type: "framesOptions",
                  payload: { framesPicker: value },
                } as any)
              }
              className={cn("w-[60%]", "ml-2")}
            />
          </div>
        </div>
        <div className="mt-12">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
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