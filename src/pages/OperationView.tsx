import { TransformStateContext } from "@src/App";
import { FramesStack } from "@src/components/FramesStack";
import React, { useContext, useEffect } from "react";

interface OperationViewProps {}
export const OperationView: React.FC<OperationViewProps> = (props) => {
  const [_state, dispatch] = useContext(TransformStateContext);

  useEffect(() => {
    // const transformImgDataList = _state.cacheFrames.map((item, idx) => {
    //   const
    //   return
    // })
    // setImageList();
  }, []);

  return (
    <div className="py-1 px-4 w-full flex flex-col flex-nowrap items-center">
      <FramesStack preventNav></FramesStack>
    </div>

    // <Dialog open={open} defaultOpen={defaultOpen} modal={modal}>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle>自定义帧</DialogTitle>
    //       <DialogDescription>
    //         调试您需要的自定义的参数，然后保存，取消或者重置。
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div className="grid gap-4 py-4">
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label htmlFor="name" className="text-right">
    //           Name
    //         </Label>
    //         <Input
    //           id="name"
    //           defaultValue="Pedro Duarte"
    //           className="col-span-3"
    //         />
    //       </div>
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label htmlFor="username" className="text-right">
    //           Username
    //         </Label>
    //         <Input
    //           id="username"
    //           defaultValue="@peduarte"
    //           className="col-span-3"
    //         />
    //       </div>
    //       <canvas
    //         style={{
    //           maxHeight: "400px",
    //           maxWidth: "400px",
    //         }}
    //         ref={canvasRef}
    //       ></canvas>
    //     </div>
    //     <DialogFooter>
    //       <Button variant="outline" onClick={cancelEdit}>
    //         取消
    //       </Button>
    //       <Button variant="secondary" onClick={resetEdit}>
    //         重置
    //       </Button>
    //       <Button onClick={saveEdit}>保存</Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
};
