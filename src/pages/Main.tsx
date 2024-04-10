import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { exportImgByUrl, fillNoticeTxtToCanvas } from "@src/common/tools";
import ClipRect from "@src/components/ClipRect";
import { ContactDrawer } from "@src/components/ContactDrawer";
import ExportGift from "@src/components/ExportGif";
import { FramesStack } from "@src/components/FramesStack";
import PreviewGif from "@src/components/PreviewGif";
import RenderFramesLine from "@src/components/RenderFramesLine";
import Upload from "@src/components/Upload";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import { useClipRect } from "@src/hooks/useClipRect";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

interface MainProps {}
const Main: React.FC<MainProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = React.useState<boolean>(false);
  const framesStackRef = useRef<any>(null);
  const [previewRect, setPreviewRect] = React.useState<any>({});
  const { theme } = useTheme();
  const [state, dispatch] = React.useContext(TransformStateContext);
  const { addClipRect, removeClipRect, clipRect, isShowClip } =
    useClipRect("#videoWrapper");

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
    exportImgByUrl(state.gifStat.url);
  };

  const onStackRenderHandler = () => {
    framesStackRef.current?.renderStack();
  };

  const previewGif = () => {
    if (!state.cacheFrames.length) {
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
      imgData: state.cacheFrames,
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
    dispatch({ type: "cacheFrames", payload: [] } as any);
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
        text: "关键帧截取预览区域",
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
      const cacheImgDataArr: ImageData[] = [];
      const loop = async () => {
        if (video.paused || video.ended) {
          dispatch({ type: "cacheFrames", payload: cacheImgDataArr } as any);
          return;
        }
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
        cacheImgDataArr.push(imageData);
        setTimeout(loop, 1000 / state.framesOptions.framesPicker!);
      };
      loop();
    };

    video.addEventListener("play", extractFrame);
    return () => {
      video.removeEventListener("play", extractFrame);
    };
  }, [
    state.videoStat,
    state.canvasRect,
    state.framesOptions.framesPicker,
    clipRect,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const previewElem = document.getElementById("preview");
      const videoWrapper = document.getElementById("videoWrapper");
      if (
        !canvasRef.current ||
        !previewElem ||
        !videoWrapper ||
        !videoRef.current
      )
        return;
      canvasRef.current.style.width = `${previewElem.offsetWidth}px`;
      canvasRef.current.style.height = `${previewElem.offsetHeight}px`;
      videoWrapper.style.width = `${previewElem.offsetWidth}px`;
      videoWrapper.style.height = `${previewElem.offsetHeight}px`;
      videoRef.current.style.width = `${previewElem.offsetWidth}px`;
      videoRef.current.style.height = `${previewElem.offsetHeight}px`;
      setPreviewRect({
        width: previewElem.offsetWidth,
        height: previewElem.offsetHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const noUrlPreviewRender = () => {
    return isRendering ? (
      <Skeleton className="w-full h-full rounded-xl" />
    ) : (
      "点击预览按钮生成GIF动画~"
    );
  };

  return (
    <div className="py-1 px-4 w-full">
      <div className="flex gap-3 items-center">
        <ClipRect onClip={addClipRect} onReset={removeClipRect}></ClipRect>
        <Upload onUpload={onUploadHandler}></Upload>
        <ExportGift onExport={onExportHandler}></ExportGift>
        <PreviewGif onPreview={previewGif}></PreviewGif>
        <RenderFramesLine onRender={onStackRenderHandler}></RenderFramesLine>
        <ContactDrawer></ContactDrawer>
      </div>
      <Separator className="my-6"></Separator>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div id="videoWrapper">
          <video
            className="object-fill"
            ref={videoRef}
            controls
            src={state.videoStat.url}
          ></video>
        </div>
        <canvas
          className="border"
          width={state.canvasRect.width}
          height={state.canvasRect.height}
          ref={canvasRef}
        ></canvas>
        <div
          id="preview"
          className="flex justify-center aspect-video items-center border border-dashed"
        >
          {state.gifStat.url ? (
            <img
              style={{
                width: previewRect.width - 2,
                height: previewRect.height - 2,
              }}
              src={state.gifStat.url}
              className="object-contain"
              alt="loading..."
            />
          ) : (
            noUrlPreviewRender()
          )}
        </div>
      </div>
      <div
        ref={progressRef}
        className="h-1 my-4 flex items-center bg-slate-400 w-[1px] invisible"
      ></div>
      <FramesStack ref={framesStackRef} />
    </div>
  );
};

export default Main;
