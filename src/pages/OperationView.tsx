import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/use-toast";
import {
  exportImgByUrl,
  generateGifByImgData,
  generateImgDataByImg,
  getCurTargetElemIdx,
  imgDataToUrl,
} from "@src/common/tools";
import { FramesStack } from "@src/components/FramesStack";
import { ImgEditCard } from "@src/components/ImgEditCard";
import PreviewGif from "@src/components/PreviewGif";
import RenderFramesLine from "@src/components/RenderFramesLine";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import { DialogComponent } from "@src/hooks/useDialog";
import Konva from "konva";
import { ReplaceAll } from "lucide-react";
import React, { useEffect } from "react";

const defaultImgEditState = {
  hue: 0,
  saturation: 0,
  luminance: 0,
  noise: 0,
  pixelate: 1,
  blurRadius: 0,
  grayscale: false,
};

type FilterType =
  | "hue"
  | "saturation"
  | "luminance"
  | "grayscale"
  | "noise"
  | "blurRadius"
  | "pixelate";
type ImgState = { cacheImg: Konva.Image | null } & Pick<
  typeof defaultImgEditState,
  FilterType
>;

interface OperationViewProps {}
export const OperationView: React.FC<OperationViewProps> = () => {
  const [currentIdx, setCurrentIdx] = React.useState<number>(0);
  const [imgEditState, setImgEditState] = React.useState(defaultImgEditState);
  const [open, setOpen] = React.useState<boolean>(false);
  const [gifUrl, setGifUrl] = React.useState<string>("");
  const [transformState, transformStateDispatch] = React.useContext(
    TransformStateContext
  );
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const layerRef = React.useRef<Konva.Layer | null>(null);
  const modifiedFramesStack = React.useRef<ImgState[]>([]);
  const modifiedFramesStackElemRef = React.useRef<HTMLDivElement>(null);
  const renderedFrames = React.useRef<HTMLImageElement[]>([]);

  const frameClick = (evt: any) => {
    const idx = getCurTargetElemIdx(evt);
    setCurrentIdx(idx);
    let mergedState = defaultImgEditState;
    const editedImage = modifiedFramesStack.current[idx];

    // 被编辑过
    if (editedImage) {
      mergedState = {
        ...mergedState,
        hue: editedImage.hue,
        saturation: editedImage.saturation,
        luminance: editedImage.luminance,
        grayscale: editedImage.grayscale,
        noise: editedImage.noise,
        pixelate: editedImage.pixelate,
        blurRadius: editedImage.blurRadius,
      };
    }
    setImgEditState(mergedState);
  };

  const onChangeHandler = (field: FilterType, value: any) => {
    setImgEditState((state) => ({ ...state, [field]: value }));
    const img = modifiedFramesStack.current[currentIdx];
    (img as any)[field] = value;
  };

  const drawText = (textInfo: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fill: string;
  }) => {
    const { text, fontSize, fontFamily, fill } = textInfo;
    const simpleText = new Konva.Text({
      x: 0,
      y: 0,
      text,
      fontSize,
      fontFamily,
      fill,
      draggable: true,
    });
    layerRef.current!.add(simpleText);
    simpleText.moveToTop();
    stageRef.current!.add(layerRef.current!);
  };

  const drawCurrentImageData = () => {
    const src = imgDataToUrl(transformState.cacheFrames[currentIdx]);
    if (!src) return;
    let img = modifiedFramesStack.current[currentIdx];
    if (img) return;
    img = {
      hue: imgEditState.hue,
      saturation: imgEditState.saturation,
      luminance: imgEditState.luminance,
      grayscale: imgEditState.grayscale,
      noise: imgEditState.noise,
      pixelate: imgEditState.pixelate,
      blurRadius: imgEditState.blurRadius,
      cacheImg: null,
    };
    const imageObj = new Image();
    imageObj.src = src;
    imageObj.onload = function () {
      img.cacheImg = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
      });
      modifiedFramesStack.current[currentIdx] = img;
      setEditStateToImg(img);
      layerRef.current!.add(img.cacheImg);
      stageRef.current!.add(layerRef.current!);
    };
  };

  const setEditStateToImg = (imgState: ImgState) => {
    let {
      cacheImg,
      hue,
      saturation,
      luminance,
      grayscale,
      noise,
      pixelate,
      blurRadius,
    } = imgState;
    const filers = [
      Konva.Filters.HSL,
      Konva.Filters.Noise,
      Konva.Filters.Pixelate,
      Konva.Filters.Blur,
    ];
    if (grayscale) filers.push(Konva.Filters.Grayscale);
    cacheImg?.cache();
    cacheImg?.filters(filers);
    cacheImg?.hue(hue);
    cacheImg?.saturation(saturation);
    cacheImg?.luminance(luminance);
    cacheImg?.noise(noise);
    cacheImg?.pixelSize(pixelate);
    cacheImg?.blurRadius(blurRadius);
    cacheImg?.moveToTop();
  };

  const renderModifiedFrame = async () => {
    if (!modifiedFramesStack.current) return;
    const src = stageRef.current?.toDataURL();
    const img = document.createElement("img");
    img.width = 120;
    img.height = 60;
    img.loading = "lazy";
    img.src = src!;
    modifiedFramesStackElemRef.current?.appendChild(img);
    renderedFrames.current.push(img);
  };

  useEffect(() => {
    if (!modifiedFramesStack.current[currentIdx]) return;
    setEditStateToImg(modifiedFramesStack.current[currentIdx]);
  }, [imgEditState]);

  useEffect(() => {
    if (!containerRef.current) return;
    let width = transformState.cacheFrames[currentIdx]?.width;
    let height = transformState.cacheFrames[currentIdx]?.height;
    const scaleRatio = (window.innerWidth - 960) / width;
    width = width * scaleRatio;
    height = height * scaleRatio;
    stageRef.current = new Konva.Stage({
      container: containerRef.current,
      width,
      height,
      scale: { x: scaleRatio, y: scaleRatio },
    });
    layerRef.current = new Konva.Layer();
    stageRef.current.add(layerRef.current);
  }, []);

  useEffect(() => {
    drawCurrentImageData();
  }, [currentIdx]);

  const previewGif = async () => {
    const imgDataList = renderedFrames.current.map(
      (img) => generateImgDataByImg(img, transformState.canvasRect)!
    );
    const url = await generateGifByImgData(imgDataList);
    if (!url)
      return toast({
        title: "生成GIF失败",
        description: "请点击渲染编辑帧按钮，生成对应帧再重试！",
      });
    setGifUrl(url);
    setOpen(true);
  };
  const applyToAll = () => {
    toast({
      title: "该功能还在开发中",
      description: "去给作者点个star或者留下issue，催促新功能~",
    });
  };

  const onCancel = () => {
    setOpen(false);
  };
  const onSave = () => {
    exportImgByUrl(gifUrl);
    setOpen(false);
  };

  const onModifiedFrameClick = (evt: any) => {
    const idx = getCurTargetElemIdx(evt);
  };

  return (
    <div className="py-1 px-4 w-full flex flex-col flex-nowrap items-center">
      <div className="flex gap-2 mb-2 justify-start w-full">
        <PreviewGif onPreview={previewGif}></PreviewGif>
        <RenderFramesLine onRender={renderModifiedFrame}>
          渲染编辑帧
        </RenderFramesLine>
        <Button onClick={applyToAll}>
          <ReplaceAll className="mr-2 size-4" />
          应用当前修改到所有帧
        </Button>
      </div>
      <FramesStack
        preventNav
        preventMenu
        onFrameClick={frameClick}
      ></FramesStack>

      <ContextMenu>
        <ContextMenuTrigger className="w-full">
          <div
            className="flex flex-nowrap h-full gap-2 w-full p-2 border border-dashed mb-4 overflow-x-auto"
            ref={modifiedFramesStackElemRef}
            onClick={onModifiedFrameClick}
          ></div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onSelect={onModifiedFrameClick}>
            删除
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <div className="flex flex-nowrap items-center w-full">
        <ImgEditCard imgEditState={imgEditState} onChange={onChangeHandler} />
        <div
          className="ml-4 border border-gray-200 rounded-md shadow-md"
          ref={containerRef}
        ></div>
      </div>

      <DialogComponent
        title="预览GIF"
        description="预览生成的GIF图片，点击保存按钮保存到本地。"
        open={open}
        onCancel={onCancel}
        onSave={onSave}
        onOpenChange={setOpen}
      >
        <img src={gifUrl} alt="gif" />
      </DialogComponent>
    </div>
  );
};
