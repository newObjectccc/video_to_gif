import { getCurTargetElemIdx, imgDataToUrl } from "@src/common/tools";
import { FramesStack } from "@src/components/FramesStack";
import { ImgEditCard } from "@src/components/ImgEditCard";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import Konva from "konva";
import React, { useEffect } from "react";

const defaultImgEditState = {
  brightness: 50,
  grayscale: false,
};

type ImgState = { cacheImg: Konva.Image | null } & Pick<
  typeof defaultImgEditState,
  "brightness" | "grayscale"
>;

interface OperationViewProps {}
export const OperationView: React.FC<OperationViewProps> = (props) => {
  const [currentIdx, setCurrentIdx] = React.useState<number>(0);
  const [transformState, transformStateDispatch] = React.useContext(
    TransformStateContext
  );
  const [imgEditState, setImgEditState] = React.useState(defaultImgEditState);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const layerRef = React.useRef<Konva.Layer | null>(null);
  const currentImgRef = React.useRef<ImgState[]>([]);

  const frameClick = (evt: any) => {
    const idx = getCurTargetElemIdx(evt);
    setCurrentIdx(idx);
    let mergedState = defaultImgEditState;
    const editedImage = currentImgRef.current[idx];

    // 被编辑过
    if (editedImage) {
      mergedState = {
        ...mergedState,
        brightness: editedImage.brightness,
        grayscale: editedImage.grayscale,
      };
    }
    setImgEditState(mergedState);
  };

  const onChangeHandler = (field: string, value: any) => {
    setImgEditState((state) => ({ ...state, [field]: value }));
    const img = currentImgRef.current[currentIdx];
    if (field === "grayscale") {
      img.grayscale = value;
    }
    if (field === "brightness") {
      img.brightness = value;
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
    layerRef.current!.add(simpleText);
    simpleText.moveToTop();
    stageRef.current!.add(layerRef.current!);
  };

  const drawCurrentImageData = () => {
    const src = imgDataToUrl(transformState.cacheFrames[currentIdx]);
    if (!src) return;
    let img = currentImgRef.current[currentIdx];
    if (img) return;
    img = {
      brightness: imgEditState.brightness,
      grayscale: imgEditState.grayscale,
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
      currentImgRef.current[currentIdx] = img;
      setEditStateToImg(img);
      layerRef.current!.add(img.cacheImg);
      stageRef.current!.add(layerRef.current!);
    };
  };

  const setEditStateToImg = (imgState: ImgState) => {
    let { cacheImg, brightness, grayscale } = imgState;
    const filers = [Konva.Filters.Brighten];
    if (grayscale) filers.push(Konva.Filters.Grayscale);
    cacheImg?.cache();
    cacheImg?.filters(filers);
    brightness = brightness > 50 ? brightness - 50 : -1 * (50 - brightness);
    cacheImg?.brightness((brightness * 2) / 100);
    cacheImg?.moveToTop();
    putImageDataToStackFrames();
  };

  const putImageDataToStackFrames = () => {
    const img = currentImgRef.current[currentIdx];
    if (!img) return;
    const imageData = img.cacheImg?.image();
    if (!imageData) return;
    console.log("🚀 ~ putImageDataToStackFrames ~ imageData:", imageData);
    // const ctx = transformState.cacheFrames[currentIdx]
    // ctx?.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (!currentImgRef.current[currentIdx]) return;
    console.log("🚀 ~ useEffect ~ currentIdx:", currentIdx);
    setEditStateToImg(currentImgRef.current[currentIdx]);
  }, [imgEditState]);

  useEffect(() => {
    if (!containerRef.current) return;
    let width = transformState.cacheFrames[currentIdx]?.width;
    let height = transformState.cacheFrames[currentIdx]?.height;
    const scaleRatio = (window.innerWidth - 480) / width;
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
