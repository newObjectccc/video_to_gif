import { FramesStack } from "@src/components/FramesStack";
import { ImgCarousel } from "@src/components/ImgCarousel";
import { ImgEditCard } from "@src/components/ImgEditCard";
import { ImgEditProvider } from "@src/contexts/ImgEditParamsContext";
import React from "react";

interface OperationViewProps {}
export const OperationView: React.FC<OperationViewProps> = (props) => {
  return (
    <ImgEditProvider>
      <div className="py-1 px-4 w-full flex flex-col flex-nowrap items-center">
        <FramesStack preventNav></FramesStack>
        <div className="flex flex-nowrap items-center w-full">
          <ImgEditCard />
          <ImgCarousel />
        </div>
      </div>
    </ImgEditProvider>
  );
};
