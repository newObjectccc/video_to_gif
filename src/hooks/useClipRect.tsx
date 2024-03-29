import interact from "interactjs";
import React, { useRef, useState } from "react";

interface ClipRectOptIntf {
  width: number;
  height: number;
  x: number;
  y: number;
}

const createClipRect = ({
  width,
  height,
}: Pick<ClipRectOptIntf, "height" | "width">) => {
  const clipDom = document.createElement("div");
  clipDom.style.position = "absolute";
  clipDom.style.width = `${width}px`;
  clipDom.style.height = `${height}px`;
  clipDom.style.left = `0`;
  clipDom.style.top = `0`;
  clipDom.style.backgroundColor = "rgba(0, 0, 0, 0)";
  clipDom.style.boxShadow = "0 0 30px 3px rgba(0, 0, 0, 1)";
  clipDom.style.zIndex = "1";
  return clipDom;
};

export const useClipRect = (target: string) => {
  const clipRef = useRef<HTMLDivElement>();
  const [targetDom, setTargetDom] = useState<any>(null);
  const [clipRect, setClipRect] = React.useState<ClipRectOptIntf | null>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const timer = useRef<number>();

  const removeClipRect = () => {
    clipRef.current && clipRef.current.remove();
    setClipRect(null);
    setTargetDom(null);
  };

  const addClipRect = () => {
    const targetElem: any = document.querySelector(target);
    if (!targetElem) return;
    setClipRect({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    targetElem.style.position = "relative";

    if (clipRef.current) clipRef.current.remove();

    clipRef.current = createClipRect({
      width: 100,
      height: 100,
    });

    clipRef.current.id = "clipRect";
    targetElem.appendChild(clipRef.current);
    bindInteract("#clipRect", (pos) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setClipRect((prev: any) => {
          const newRect = { ...prev, ...pos };
          return newRect;
        });
      }, 300);
    });
    setTargetDom(targetElem);
  };

  return {
    addClipRect,
    clipRect,
    removeClipRect,
    isShowClip: !!targetDom,
  };
};

const bindInteract = (
  target: string,
  cb: (pos: Partial<ClipRectOptIntf>) => void
) => {
  let x = 0,
    y = 0;
  const restrictToParent = interact.modifiers.restrictRect({
    restriction: "parent",
  });

  interact(target)
    .draggable({
      modifiers: [restrictToParent],
      listeners: {
        move(event) {
          x += event.dx;
          y += event.dy;
          event.target.style.transform = `translate(${x}px, ${y}px)`;
          cb({ x, y });
        },
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [
        interact.modifiers.restrictSize({
          max: "parent",
          min: { width: 50, height: 50 },
        }),
      ],
      listeners: {
        move(event) {
          const { x, y } = event.target.dataset;
          const rect = event.rect;
          event.target.style.width = `${rect.width}px`;
          event.target.style.height = `${rect.height}px`;
          event.target.style.transform = `translate(${x}px, ${y}px)`;
          cb({ width: rect.width, height: rect.height });
        },
      },
    });
};
