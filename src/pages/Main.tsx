import { Separator } from "@/components/ui/separator";
import { TransformStateContext } from "@src/App";
import ExportGift from "@src/components/ExportGif";
import Upload from "@src/components/Upload";
import React, { useEffect, useRef } from "react";
//@ts-ignore
import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { useTheme } from "next-themes";

interface MainProps {}
const Main: React.FC<MainProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isReplay = useRef<boolean>(false);
  const { theme } = useTheme();

  const [state, dispatch] = React.useContext(TransformStateContext);

  const onUploadHandler = (file: File) => {
    let videoUrl = URL.createObjectURL(file);
    const videoObj = { url: videoUrl, type: file.type };
    dispatch({ type: "videoStat", payload: videoObj } as any);
  };

  const onExportHandler = () => {
    if (!state.gifStat.url) return;
    const link = document.createElement("a");
    link.href = state.gifStat.url;
    link.download = "output.gif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      willReadFrequently: true,
    });

    if (!video || !canvas || !ctx) return;

    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    ctx!.fillStyle = theme === "dark" ? "#F8FAFC" : "#020817";
    ctx!.font = "16px Arial";
    ctx!.textBaseline = "middle";
    ctx!.textAlign = "center";
    ctx!.fillText("预览区域", canvas.width / 2, canvas.height / 2);

    if (state.videoStat.url) video?.load();

    const extractFrame = () => {
      let gif = GIFEncoder();
      const loop = () => {
        if (video!.paused || video!.ended) {
          if (video!.paused) isReplay.current = true;
          gif.finish();
          const blob = new Blob([gif.bytes()], { type: "image/gif" });
          const url = URL.createObjectURL(blob);
          dispatch({ type: "gifStat", payload: { url } } as any);
          return;
        }
        if (isReplay.current) {
          dispatch({ type: "gifStat", payload: { url: "" } } as any);
          isReplay.current = false;
        }
        ctx?.drawImage(video!, 0, 0, canvas!.width, canvas!.height);
        const { data, width, height } = ctx!.getImageData(
          0,
          0,
          canvas!.width,
          canvas!.height
        );
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, width, height, { palette });
        setTimeout(loop, 1000 / state.framesOptions.framesPicker!);
      };
      loop();
    };

    video!.addEventListener("play", extractFrame);

    return () => {
      video!.removeEventListener("play", extractFrame);
    };
  }, [state.videoStat, theme]);

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Upload onUpload={onUploadHandler}></Upload>
        <ExportGift onExport={onExportHandler}></ExportGift>
      </div>
      <Separator className="my-6"></Separator>
      <div className="flex flex-row flex-nowrap gap-4">
        <video
          className="border-2 w-[480px] h-[240px]"
          ref={videoRef}
          width="480"
          height="240"
          controls
        >
          <source src={state.videoStat.url} type={state.videoStat.type} />
        </video>
        <canvas
          className="border-2 w-[480px] h-[240px]"
          ref={canvasRef}
          width="480"
          height="240"
        ></canvas>
        {state.gifStat.url ? (
          <img
            className="w-[480px] h-[240px]"
            src={state.gifStat.url}
            alt="loading..."
          />
        ) : (
          <div className="w-[480px] h-[240px] flex justify-center items-center border-2 border-dashed">
            视频暂停或完结后自动抓取
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
