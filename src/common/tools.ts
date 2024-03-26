//@ts-ignore
import { GIFEncoder, applyPalette, quantize } from "gifenc";

export function getCurTargetElemIdx(event: any) {
  const parent = event.target.parentNode;
  const childrenArray = Array.from(parent.children);
  const index = childrenArray.indexOf(event.target);
  return index;
}

export async function generateGifByImgData(
  imgData: ImageData | ImageData[],
  delay: number = 100,
  process: (p: number) => void
) {
  return new Promise((resolve) => {
    try {
      const imgDataArr = Array.isArray(imgData) ? imgData : [imgData];
      if (!imgDataArr) return;
      // TODO 优化：支持多worker并行处理
      let gif = GIFEncoder();
      imgDataArr.forEach((imgData, idx) => {
        setTimeout(() => {
          process?.(Math.floor(((idx + 1) / imgDataArr.length) * 100));
          const { data, width, height } = imgData;
          const palette = quantize(data, 256);
          const index = applyPalette(data, palette);
          gif.writeFrame(index, width, height, {
            palette,
            delay,
          });
          if (idx === imgDataArr.length - 1) {
            gif.finish();
            const blob = new Blob([gif.bytes()], { type: "image/gif" });
            const url = URL.createObjectURL(blob);
            resolve(url);
          }
        });
      });
    } catch (error) {
      console.error("generate gif image url error: ", error);
    }
  });
}

export function fillNoticeTxtToCanvas(
  ctx: CanvasRenderingContext2D,
  options: {
    font?: string;
    fillStyle?: string;
    textBaseline?: CanvasTextBaseline;
    textAlign?: CanvasTextAlign;
    text?: string;
    width: number;
    height: number;
  }
) {
  const {
    font,
    fillStyle = "#F8FAFC",
    textBaseline = "middle",
    textAlign = "center",
    text = "预览区域",
    width = 0,
    height = 0,
  } = options;
  if (!height || !width || !text) return;
  const fontSize = width * 0.044;
  const coverFont = font || `${fontSize}px Arial`;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = fillStyle;
  ctx.font = coverFont;
  ctx.textBaseline = textBaseline;
  ctx.textAlign = textAlign;
  ctx.fillText(text, width / 2, height / 2);
}
