import { Contact } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import wx from "../../public/wx.png";

interface ContactDrawerProps {}

export const ContactDrawer: React.FC<ContactDrawerProps> = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Contact className="mr-2 size-4" />
          联系作者
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>联系作者</DrawerTitle>
            <DrawerDescription>
              如果您有任何关于产品功能的疑问，请您加我微信，直接跟作者反馈，我会实时看到并回馈您～
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <img src={wx} alt="v2g" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
