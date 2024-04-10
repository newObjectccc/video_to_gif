import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DialogComponent({
  title,
  description,
  onSave,
  onCancel,
  saveText = "保存",
  cancelText = "取消",
  footer,
  content,
  open,
  onOpenChange,
  children,
}: DialogOptions) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{content ? content : children}</div>
        <DialogFooter>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          {onSave && <Button onClick={onSave}>{saveText}</Button>}
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DialogOptions {
  title?: string;
  description?: string;
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  content?: React.ReactNode;
  open: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

const useDialog = () => {
  //..
};
