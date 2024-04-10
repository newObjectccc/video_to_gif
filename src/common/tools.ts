//@ts-ignore
import { GIFEncoder, applyPalette, quantize } from "gifenc";

export function getCurTargetElemIdx(event: any) {
  const parent = event.target.parentNode;
  const childrenArray = Array.from(parent.children);
  const index = childrenArray.indexOf(event.target);
  return index;
}

export function generateImgDataByImg(
  img: HTMLImageElement,
  rect: { width?: number; height?: number }
) {
  const { width, height } = rect;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = width ?? img.width;
  canvas.height = height ?? img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function exportImgByUrl(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = "output.gif";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function generateGifByImgData(
  imgData: ImageData | ImageData[],
  delay: number = 100
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const imgDataArr = Array.isArray(imgData) ? imgData : [imgData];
      if (!imgDataArr) return;
      // TODO 优化：支持多worker并行处理
      let gif = GIFEncoder();
      imgDataArr.forEach((imgData, idx) => {
        const { data, width, height } = imgData;
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, width, height, {
          palette,
          delay,
        });
        postMessage({
          type: "process",
          process: Math.floor(((idx + 1) / imgDataArr.length) * 100),
        });
      });
      gif.finish();
      const blob = new Blob([gif.bytes()], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      resolve(url);
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
  const fontSize = width * 0.04;
  const coverFont = font || `${fontSize}px Arial`;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = fillStyle;
  ctx.font = coverFont;
  ctx.textBaseline = textBaseline;
  ctx.textAlign = textAlign;
  ctx.fillText(text, width / 2, height / 2);
}

export function imgDataToUrl(data: ImageData) {
  if (!data) return;
  const canvas = document.createElement("canvas");
  canvas.width = data.width;
  canvas.height = data.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL();
}

export function imgToCanvasImageSource(
  img: CanvasImageSource & { width: number; height: number }
) {
  if (!img.width || !img.height) return;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
