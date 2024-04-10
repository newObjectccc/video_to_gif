import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { getCurTargetElemIdx, imgDataToUrl } from "@src/common/tools";
import { ImgMenu } from "@src/components/ImgMenu";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import mediumZoom from "medium-zoom";
import { useTheme } from "next-themes";
import React, {
  MouseEventHandler,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

interface FramesStackProps {
  preventNav?: boolean;
  preventMenu?: boolean;
  onFrameClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  ref: any;
}
export const FramesStack: React.FC<React.PropsWithRef<FramesStackProps>> =
  forwardRef((props, ref) => {
    const { preventNav, preventMenu, onFrameClick } = props;
    const [state, dispatch] = React.useContext(TransformStateContext);
    const framesStackElemRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef<boolean>(false);
    const [curImageIdx, setCurImageIdx] = React.useState<number>(0);
    const { theme } = useTheme();
    const zoomRef = useRef<any>(null);
    const navigate = useNavigate();
    const { cacheFrames } = state;

    const onMenuShow = (e: MouseEventHandler<HTMLDivElement>) => {
      const idx = getCurTargetElemIdx(e);
      setCurImageIdx(idx);
    };

    const onImgRemove = () => {
      if (!cacheFrames.length) return;
      cacheFrames.splice(curImageIdx, 1);
      dispatch({ type: "cacheFrames", payload: cacheFrames } as any);
      framesStackElemRef.current?.removeChild(
        framesStackElemRef.current?.children[curImageIdx]
      );
    };

    const onImgEdit = () => {
      if (preventNav) return;
      if (cacheFrames.length === 0)
        return toast({
          title: "没有缓存帧",
          description: "请检查左侧步骤是否有错误~",
          action: <ToastAction altText="去上传">Undo</ToastAction>,
        });
      document.startViewTransition(() => {
        navigate("/edit");
      });
    };

    const onImgPreview = () => {
      const zoom = mediumZoom(
        framesStackElemRef.current!.querySelectorAll("img")[curImageIdx],
        { background: theme === "light" ? "#F8FAFC" : "#020817" }
      );
      zoom.open();
    };

    const transformImgDataToDom = () => {
      const framesStackElem = framesStackElemRef.current;
      if (!framesStackElem) return;
      if (cacheFrames.length === 0)
        return toast({
          title: "没有缓存帧",
          description: "请检查左侧步骤是否有错误~",
          action: <ToastAction altText="去上传">Undo</ToastAction>,
        });
      framesStackElemRef.current.innerHTML = "";
      cacheFrames.forEach((imageData, idx) => {
        setTimeout(() => {
          const img = document.createElement("img");
          img.width = 120;
          img.height = 60;
          img.style.zIndex = "2"; // 因为 clipRect 的 z-index 是 1
          img.loading = "lazy";
          img.src = imgDataToUrl(imageData)!;
          framesStackElem.appendChild(img);
          if (progressRef.current) {
            progressRef.current.style.width = `${
              ((idx + 1) / cacheFrames.length) * 100
            }%`;
            if (idx + 1 === cacheFrames.length) {
              progressRef.current.style.visibility = "hidden";
              if (preventMenu) return;
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

    useEffect(() => {
      if (preventMenu) return;
      zoomRef.current?.update({
        background:
          theme === "light"
            ? "rgba(248, 250, 252, 0.85)"
            : "rgba(2, 8, 23, 0.85)",
      });
    }, [theme]);

    useEffect(() => {
      if (preventNav && !isMounted.current) {
        isMounted.current = true;
        transformImgDataToDom();
        return;
      }
      if (cacheFrames.length === 0 && framesStackElemRef.current)
        framesStackElemRef.current.innerHTML = `<div
              style="
                display:flex;
                align-items:center;
                justify-content:center;
                width:100%;
                height:100%;
              "
            >
              帧栈渲染区（如无其他细调操作，无需渲染帧栈，点击渲染采样帧按钮即可查看帧栈）
            </div>`;
    }, [cacheFrames]);

    useImperativeHandle(ref, () => ({
      renderStack: transformImgDataToDom,
    }));

    return (
      <>
        <ImgMenu
          onRemove={onImgRemove}
          onEdit={onImgEdit}
          onPreview={onImgPreview}
          disabled={preventMenu}
          className="flex flex-nowrap overflow-x-auto h-[130px] w-full mb-2 border border-dashed p-2"
        >
          <div
            ref={framesStackElemRef}
            className="flex flex-nowrap h-full gap-2 w-full"
            onContextMenu={onMenuShow as any}
            onClick={onFrameClick}
          ></div>
        </ImgMenu>
        {cacheFrames.length && !preventMenu ? (
          <div className="text-sm">
            共{cacheFrames.length}张关键帧（关键帧上右键单击弹出操作菜单）
          </div>
        ) : null}
        {!preventMenu && (
          <div
            ref={progressRef}
            className="h-1 my-4 flex items-center bg-slate-400 w-[1px] invisible"
          ></div>
        )}
      </>
    );
  });
