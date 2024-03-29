import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { TransformStateContext } from "@src/App";
import { fillNoticeTxtToCanvas, getCurTargetElemIdx } from "@src/common/tools";
import ClipRect from "@src/components/ClipRect";
import ExportGift from "@src/components/ExportGif";
import { ImgMenu } from "@src/components/ImgMenu";
import PreviewGif from "@src/components/PreviewGif";
import RenderFramesLine from "@src/components/RenderFramesLine";
import Upload from "@src/components/Upload";
import { useClipRect } from "@src/hooks/useClipRect";
import mediumZoom from "medium-zoom";
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
  const zoomRef = useRef<any>(null);
  const { theme } = useTheme();
  const { addClipRect, removeClipRect, clipRect, isShowClip } =
    useClipRect("#videoWrapper");

  const [state, dispatch] = React.useContext(TransformStateContext);

  const onUploadHandler = (file: File) => {
    if (!videoRef.current!.canPlayType(file.type)) {
      toast({
        title: "文件类型错误",
        description: "你的浏览器不能播放这种格式的视频文件~",
      });
      return;
    }
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
    if (!cacheFrames.current.length) return;
    cacheFrames.current.splice(curImageIdx, 1);
    framesStackElemRef.current?.removeChild(
      framesStackElemRef.current?.children[curImageIdx]
    );
    setTotalFrames((prev) => prev - 1);
  };

  const onImgEdit = () => {};

  const onImgPreview = () => {
    const zoom = mediumZoom(
      framesStackElemRef.current!.querySelectorAll("img")[curImageIdx],
      { background: theme === "light" ? "#F8FAFC" : "#020817" }
    );
    zoom.open();
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
        img.style.zIndex = "2"; // 因为 clipRect 的 z-index 是 1
        img.decoding = "async";
        img.loading = "lazy";
        img.src = canvas.toDataURL();
        framesStackElem.appendChild(img);
        if (progressRef.current) {
          progressRef.current.style.width = `${
            ((idx + 1) / cacheFrames.current.length) * 100
          }%`;
          if (idx + 1 === cacheFrames.current.length) {
            progressRef.current.style.visibility = "hidden";
            setTotalFrames(cacheFrames.current.length);
            zoomRef.current = mediumZoom(
              framesStackElem.querySelectorAll("img"),
              {
                background:
                  theme === "light"
                    ? "rgba(248, 250, 252, 0.85)"
                    : "rgba(2, 8, 23, 0.85)",
              }
            );
          }
          if (idx === 0) progressRef.current.style.visibility = "visible";
        }
      });
    });
  };

  const previewGif = () => {
    if (!cacheFrames.current.length) {
      toast({
        title: "没有缓存帧",
        description: "请检查左侧步骤是否有错误~",
        action: <ToastAction altText="去上传">Undo</ToastAction>,
      });
      return;
    }
    setIsRendering(true);
    const gifWorker = new Worker(
      new URL("../works/generateGif.ts", import.meta.url)
    );
    gifWorker.postMessage({
      imgData: cacheFrames.current,
      delay: state.framesOptions.framesDelay!,
    });
    gifWorker.onmessage = (e) => {
      if (!progressRef.current) return;
      const { type, url, process } = e.data;
      if (type === "process") {
        progressRef.current.style.visibility = "visible";
        progressRef.current.style.width = `${process}%`;
        if (process === 100) {
          progressRef.current.style.visibility = "hidden";
        }
      }
      if (type === "url") {
        dispatch({ type: "gifStat", payload: { url } } as any);
        setIsRendering(false);
      }
    };
  };

  const resetWorkspace = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, state.canvasRect.width!, state.canvasRect.height!);
    cacheFrames.current = [];
    setTotalFrames(0);
    setIsRendering(false);
    framesStackElemRef.current!.innerHTML = "";
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
        text: "关键帧截取预览区域",
        width: state.canvasRect.width!,
        height: state.canvasRect.height!,
        fillStyle: theme === "dark" ? "#F8FAFC" : "#020817",
      });
    }
    zoomRef.current?.update({
      background:
        theme === "light"
          ? "rgba(248, 250, 252, 0.85)"
          : "rgba(2, 8, 23, 0.85)",
    });
  }, [theme]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      willReadFrequently: true,
    });

    if (!video || !ctx) return;

    if (video.played.length) {
      video.load();
      resetWorkspace(ctx);
    } else {
      fillNoticeTxtToCanvas(ctx, {
        text: "关键帧截取预览区域",
        width: state.canvasRect.width!,
        height: state.canvasRect.height!,
        fillStyle: theme === "dark" ? "#F8FAFC" : "#020817",
      });
    }

    const extractFrame = () => {
      resetWorkspace(ctx);
      dispatch({
        type: "videoRect",
        payload: { width: video.videoWidth, height: video.videoHeight },
      } as any);
      const loop = async () => {
        if (video.paused || video.ended) return;
        const videoWidth = video.videoWidth; // 视频的实际宽度
        const videoHeight = video.videoHeight; // 视频的实际高度

        const scaleX = videoWidth / video.offsetWidth; // 计算宽度的缩放因子
        const scaleY = videoHeight / video.offsetHeight; // 计算高度的缩放因子

        if (isShowClip && clipRect) {
          ctx.drawImage(
            video,
            clipRect.x! * scaleX,
            clipRect.y! * scaleY,
            clipRect.width! * scaleX,
            clipRect.height! * scaleY,
            0,
            0,
            state.canvasRect.width!,
            state.canvasRect.height!
          );
        } else {
          ctx.drawImage(
            video,
            0,
            0,
            state.canvasRect.width!,
            state.canvasRect.height!
          );
        }
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
  }, [state.videoStat, state.canvasRect, state.framesOptions, clipRect]);

  return (
    <div className="p-4">
      <div className="flex gap-3 items-center">
        <ClipRect onClip={addClipRect} onReset={removeClipRect}></ClipRect>
        <Upload onUpload={onUploadHandler}></Upload>
        <ExportGift onExport={onExportHandler}></ExportGift>
        <PreviewGif onPreview={previewGif}></PreviewGif>
        <RenderFramesLine onRender={onStackRenderHandler}></RenderFramesLine>
      </div>
      <Separator className="my-6"></Separator>
      <div className="flex flex-row flex-nowrap gap-4">
        <div id="videoWrapper">
          <video
            className="border-2 w-[420px] h-[210px]"
            ref={videoRef}
            width="480"
            height="240"
            controls
            src={state.videoStat.url}
          ></video>
        </div>
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
              "点击预览按钮生成GIF动画~"
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
