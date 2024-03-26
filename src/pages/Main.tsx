import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { TransformStateContext } from "@src/App";
import {
  fillNoticeTxtToCanvas,
  generateGifByImgData,
  getCurTargetElemIdx,
} from "@src/common/tools";
import ExportGift from "@src/components/ExportGif";
import { ImgMenu } from "@src/components/ImgMenu";
import PreviewGif from "@src/components/PreviewGif";
import RenderFramesLine from "@src/components/RenderFramesLine";
import Upload from "@src/components/Upload";
import { useTheme } from "next-themes";
import React, { MouseEventHandler, useEffect, useRef } from "react";

interface MainProps {}
const Main: React.FC<MainProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheFrames = useRef<any[]>([]);
  const framesStackElemRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = React.useState<boolean>(false);
  const [totalFrames, setTotalFrames] = React.useState<number>(0);
  const [curImageIdx, setCurImageIdx] = React.useState<number>(0);
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

  const onMenuShow = (e: MouseEventHandler<HTMLDivElement>) => {
    const idx = getCurTargetElemIdx(e);
    setCurImageIdx(idx);
  };

  const onImgRemove = () => {
    if (curImageIdx === 0) return;
    cacheFrames.current.splice(curImageIdx, 1);
    onStackRenderHandler();
  };

  const onImgEdit = () => {
    console.log("🚀 ~ onImgEdit ~ curImageIdx:", curImageIdx);
  };

  const onImgPreview = () => {
    console.log("🚀 ~ onImgPreview ~ curImageIdx:", curImageIdx);
  };

  const onStackRenderHandler = () => {
    const framesStackElem = framesStackElemRef.current;
    if (!framesStackElem) return;
    if (framesStackElem?.childElementCount) framesStackElem.innerHTML = "";
    if (cacheFrames.current.length === 0)
      return toast({
        title: "没有缓存帧",
        description: "请检查左侧步骤是否有错误~",
        action: <ToastAction altText="去上传">Undo</ToastAction>,
      });
    // render 瓶颈前都不需要优化，直接全量更新~
    cacheFrames.current.forEach((imageData, idx) => {
      setTimeout(() => {
        const { width, height } = imageData;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.putImageData(imageData, 0, 0);
        const img = document.createElement("img");
        img.width = 120;
        img.height = 60;
        img.src = canvas.toDataURL();
        framesStackElem.appendChild(img);
        if (progressRef.current) {
          progressRef.current.style.width = `${
            ((idx + 1) / cacheFrames.current.length) * 100
          }%`;
          if (idx + 1 === cacheFrames.current.length) {
            progressRef.current.style.visibility = "hidden";
            setTotalFrames(cacheFrames.current.length);
          }
          if (idx === 0) progressRef.current.style.visibility = "visible";
        }
      });
    });
  };

  const previewGif = () => {
    setIsRendering(true);
    setTimeout(() => {
      generateGifByImgData(
        cacheFrames.current,
        state.framesOptions.framesDelay!,
        (p) => {
          if (progressRef.current) {
            progressRef.current.style.visibility = "visible";
            progressRef.current.style.width = `${p}%`;
            if (p === 100) {
              progressRef.current.style.visibility = "hidden";
            }
          }
        }
      ).then((url) => {
        dispatch({ type: "gifStat", payload: { url } } as any);
        setIsRendering(false);
      });
    });
  };

  const resetWorkspace = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, state.canvasRect.width!, state.canvasRect.height!);
    cacheFrames.current = [];
    setTotalFrames(0);
    setIsRendering(false);
    dispatch({ type: "gifStat", payload: { url: "" } } as any);
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });
    const video = videoRef.current;
    if (!ctx || !video) return;
    if (video.paused || video.ended) {
      fillNoticeTxtToCanvas(ctx, {
        text: "预览区域",
        width: state.canvasRect.width!,
        height: state.canvasRect.height!,
        fillStyle: theme === "dark" ? "#F8FAFC" : "#020817",
      });
    }
  }, [theme]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      willReadFrequently: true,
    });

    if (!video || !ctx) return;

    if (video.played.length) video.load();

    ctx.clearRect(0, 0, state.canvasRect.width!, state.canvasRect.height!);

    const extractFrame = () => {
      resetWorkspace(ctx);
      const loop = async () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(
          video,
          0,
          0,
          state.canvasRect.width!,
          state.canvasRect.height!
        );
        const imageData = ctx.getImageData(
          0,
          0,
          state.canvasRect.width!,
          state.canvasRect.height!
        );
        cacheFrames.current.push(imageData);
        setTimeout(loop, 1000 / state.framesOptions.framesPicker!);
      };
      loop();
    };

    video.addEventListener("play", extractFrame);
    return () => {
      video.removeEventListener("play", extractFrame);
    };
  }, [state.videoStat, state.canvasRect, state.framesOptions]);

  return (
    <div className="p-4">
      <div className="flex gap-3 items-center">
        <Upload onUpload={onUploadHandler}></Upload>
        <ExportGift onExport={onExportHandler}></ExportGift>
        <PreviewGif onPreview={previewGif}></PreviewGif>
        <RenderFramesLine onRender={onStackRenderHandler}></RenderFramesLine>
      </div>
      <Separator className="my-6"></Separator>
      <div className="flex flex-row flex-nowrap gap-4">
        <video
          className="border-2 w-[420px] h-[210px]"
          ref={videoRef}
          width="480"
          height="240"
          controls
          src={state.videoStat.url}
        ></video>
        <canvas
          className="border-2 w-[420px] h-[210px]"
          ref={canvasRef}
          width={state.canvasRect.width}
          height={state.canvasRect.height}
        ></canvas>
        {state.gifStat.url ? (
          <img
            className="w-[420px] h-[210px]"
            src={state.gifStat.url}
            alt="loading..."
          />
        ) : (
          <div className="w-[420px] h-[210px] flex justify-center items-center border-2 border-dashed">
            {isRendering ? (
              <Skeleton className="w-[380px] h-[170px] rounded-xl" />
            ) : (
              "视频暂停或完结后自动抓取"
            )}
          </div>
        )}
      </div>
      <div
        ref={progressRef}
        className="h-1 my-4 flex items-center bg-slate-400 w-[1px] invisible"
      ></div>
      <ImgMenu
        onRemove={onImgRemove}
        onEdit={onImgEdit}
        onPreview={onImgPreview}
        className="flex flex-nowrap overflow-x-auto h-[130px] w-[1300px] mb-2 border border-dashed p-2"
      >
        <div
          ref={framesStackElemRef}
          className="flex flex-nowrap h-full gap-2 w-full"
          onContextMenu={onMenuShow as any}
        >
          <div className="w-full flex justify-center items-center h-full">
            帧栈渲染区（如无其他细调操作，无需渲染帧栈，关键帧上右键单击弹出操作菜单）
          </div>
        </div>
      </ImgMenu>
      {totalFrames ? (
        <div className="text-sm">
          共{totalFrames}张关键帧（关键帧上右键单击弹出操作菜单）
        </div>
      ) : null}
    </div>
  );
};

export default Main;
