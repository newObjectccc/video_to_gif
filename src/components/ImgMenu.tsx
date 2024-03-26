import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/use-toast";
import React from "react";

interface ImgMenuProps {
  onPreview?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  children?: React.ReactNode;
  className?: string;
}
export const ImgMenu: React.FC<ImgMenuProps> = (props) => {
  const { onPreview, onEdit, onRemove, children, className } = props;
  const [checkedState, setCheckedState] = React.useState<any>({
    checkOne: true,
    checkTwo: false,
  });
  const [radioVal, setRadioVal] = React.useState<string>("pedro");

  const onCheckedHandler = (checked: boolean, field: string) => {
    setCheckedState((state: any) => ({ ...state, [field]: checked }));
    toast({
      title: "该功能还在开发中",
      description: "去给作者点个star或者留下issue，催促新功能~",
    });
  };

  const onRadioChange = (value: string) => {
    setRadioVal(value);
    toast({
      title: "该功能还在开发中",
      description: "去给作者点个star或者留下issue，催促新功能~",
    });
  };

  const onSelectHandler = (evt: Event, value?: string) => {
    switch (value) {
      case "preview":
        onPreview?.();
        break;
      case "edit":
        onEdit?.();
        toast({
          title: "该功能还在开发中",
          description: "去给作者点个star或者留下issue，催促新功能~",
        });
        break;
      case "remove":
        onRemove?.();
        break;
      default:
        toast({
          title: "该功能还在开发中",
          description: "去给作者点个star或者留下issue，催促新功能~",
        });
        break;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          inset
          onSelect={(evt: Event) => onSelectHandler(evt, "preview")}
        >
          预览
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onSelect={(evt: Event) => onSelectHandler(evt, "edit")}
        >
          编辑
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onSelect={(evt: Event) => onSelectHandler(evt, "remove")}
        >
          删除
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={onSelectHandler}>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={onSelectHandler}>
              Create Shortcut...
            </ContextMenuItem>
            <ContextMenuItem onSelect={onSelectHandler}>
              Name Window...
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={onSelectHandler}>
              Help Center
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={checkedState.checkOne}
          onCheckedChange={(val: boolean) => onCheckedHandler(val, "checkOne")}
        >
          Show Bookmarks Bar
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={checkedState.checkTwo}
          onCheckedChange={(val: boolean) => onCheckedHandler(val, "checkTwo")}
        >
          Show Full URLs
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={radioVal} onValueChange={onRadioChange}>
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
