import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { imgDataToUrl } from "@src/common/tools";
import { ImgEditParamsContext } from "@src/contexts/ImgEditParamsContext";
import { TransformStateContext } from "@src/contexts/TransformProvider";
import { useContext } from "react";

interface ImgCarouselProps {}
export const ImgCarousel: React.FC<ImgCarouselProps> = (props) => {
  const [transformState, transformStateDispatch] = useContext(
    TransformStateContext
  );
  const [imgEditState, imgEditDispatch] = useContext(ImgEditParamsContext);

  return (
    <div className="w-full flex">
      <Carousel className="w-full ml-20 md:max-w-md lg:max-w-lg xl:max-w-xl flex items-center border border-gray-200 shadow-lg">
        <CarouselContent>
          {transformState.cacheFrames.map((img, idx) => {
            let imgSrc = img as unknown as string;
            if (typeof img !== "string") {
              imgSrc = imgDataToUrl(img);
            }
            return (
              <CarouselItem key={idx}>
                <img src={imgSrc} alt="img-frame" />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
