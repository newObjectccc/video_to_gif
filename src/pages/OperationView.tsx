import { getCurTargetElemIdx, imgDataToUrl } from "@src/common/tools";
import { FramesStack } from "@src/components/FramesStack";
import { ImgEditCard } from "@src/components/ImgEditCard";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import Konva from "konva";
import React, { useEffect } from "react";

interface OperationViewProps {}
export const OperationView: React.FC<OperationViewProps> = (props) => {
  const [currentIdx, setCurrentIdx] = React.useState<number>(0);
  const [transformState, transformStateDispatch] = React.useContext(
    TransformStateContext
  );
  const [imgEditState, setImgEditState] = React.useState({
    isApplyAll: true,
    brightness: [50],
    grayscale: false,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const layerRef = React.useRef<Konva.Layer | null>(null);
  const currentImgRef = React.useRef<Konva.Image | null>(null);

  const frameClick = (evt: any) => {
    const idx = getCurTargetElemIdx(evt);
    setCurrentIdx(idx);
  };

  const onChangeHandler = (field: string, value: any) => {
    setImgEditState((state) => ({ ...state, [field]: value }));
    if (field === "grayscale") {
      if (value) {
        currentImgRef.current?.cache();
        currentImgRef.current?.filters([
          Konva.Filters.Grayscale,
          Konva.Filters.Brighten,
        ]);
      } else {
        currentImgRef.current?.cache();
        currentImgRef.current?.filters([Konva.Filters.Brighten]);
      }
    }
    if (field === "brightness") {
      let brightness = value[0];
      brightness = brightness > 50 ? brightness - 50 : -1 * (50 - brightness);
      currentImgRef.current?.brightness((brightness * 2) / 100);
    }
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
    layerRef.current?.add(simpleText);
    simpleText.moveToTop();
    stageRef.current?.add(layerRef.current!);
  };

  const drawCurrentImageData: () => Promise<Konva.Image> = () => {
    return new Promise((resolve) => {
      const src = imgDataToUrl(transformState.cacheFrames[currentIdx]);
      if (!src) return;
      const imageObj = new Image();
      imageObj.src = src;
      imageObj.onload = function () {
        const img = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
        });
        img.cache();
        img.filters([Konva.Filters.Brighten]);
        layerRef.current?.add(img);
        img.moveToBottom();
        stageRef.current?.add(layerRef.current!);
        currentImgRef.current = img;
        resolve(img);
      };
    });
  };

  useEffect(() => {
    let width = transformState.cacheFrames[currentIdx]?.width ?? 0;
    let height = transformState.cacheFrames[currentIdx]?.height ?? 0;
    width = width > 640 ? 640 : width;
    height = height > 480 ? 480 : height;
    stageRef.current = new Konva.Stage({
      container: containerRef.current!,
      width,
      height,
    });
    layerRef.current = new Konva.Layer();
    stageRef.current.add(layerRef.current);
    drawText({
      text: "Hello, World!",
      fontSize: 20,
      fontFamily: "Calibri",
      fill: "green",
    });
  }, []);

  useEffect(() => {
    drawCurrentImageData();
  }, [currentIdx]);

  return (
    <div className="py-1 px-4 w-full flex flex-col flex-nowrap items-center">
      <FramesStack
        preventNav
        preventMenu
        onFrameClick={frameClick}
      ></FramesStack>
      <div className="flex flex-nowrap items-center w-full">
        <ImgEditCard imgEditState={imgEditState} onChange={onChangeHandler} />
        <div
          className="ml-4 border border-gray-200 rounded-md shadow-md"
          ref={containerRef}
        ></div>
      </div>
    </div>
  );
};
