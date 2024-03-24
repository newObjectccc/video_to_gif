import Upload from "@src/components/Upload";
import React, { useEffect, useRef } from "react";
//@ts-ignore
import { GIFEncoder, applyPalette, quantize } from "gifenc";

interface VideoObjProps {
  url: string;
  type: string;
}
interface MainProps {}
const Main: React.FC<MainProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [framePicker, setFramePicker] = React.useState<number>(1);
  const [gifUrl, setGifUrl] = React.useState<string>("");
  const [videoSrc, setVideoSrc] = React.useState<VideoObjProps>({
    url: "",
    type: "",
  });

  const onUploadHandler = (file: File) => {
    let videoUrl = URL.createObjectURL(file);
    const videoObj = { url: videoUrl, type: file.type };
    setVideoSrc(videoObj);
  };

  const gifRender = () => {};

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    video?.load();

    const extractFrame = () => {
      let gif = GIFEncoder();
      const loop = () => {
        if (video!.paused || video!.ended) {
          gif.finish();
          const blob = new Blob([gif.bytes()], { type: "image/gif" });
          const url = URL.createObjectURL(blob);
          setGifUrl(url);
          return;
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
        setTimeout(loop, 1000 / framePicker);
      };
      loop();
    };

    video!.addEventListener("play", extractFrame);

    return () => {
      video!.removeEventListener("play", extractFrame);
    };
  }, [videoSrc, framePicker]);

  return (
    <div>
      <Upload onUpload={onUploadHandler}></Upload>
      <video ref={videoRef} width="640" height="480" controls>
        <source src={videoSrc.url} type={videoSrc.type} />
      </video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
      <button onClick={gifRender}>gif</button>
      {gifUrl ? <img src={gifUrl} alt="" /> : null}
    </div>
  );
};

export default Main;
