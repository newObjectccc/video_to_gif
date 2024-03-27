import { generateGifByImgData } from "@src/common/tools";

onmessage = function (e: MessageEvent) {
  const { imgData, delay } = e.data;
  generateGifByImgData(imgData, delay).then((url) => {
    postMessage({ type: "url", url });
  });
};
