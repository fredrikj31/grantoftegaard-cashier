/* eslint-disable react-refresh/only-export-components */
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@shadcn-ui/lib/utils";

const DialogRoot = DialogPrimitive.Root;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;
const DialogClose = DialogPrimitive.Close;

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogBackdrop({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn("fixed inset-0 bg-black/50 z-50", className)}
      {...props}
    />
  );
}

function DialogViewport({ className, ...props }: DialogPrimitive.Viewport.Props) {
  return (
    <DialogPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-50 flex items-end md:items-center justify-center p-4",
        className,
      )}
      {...props}
    />
  );
}

function DialogPopup({ className, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Popup
      className={cn(
        "bg-card rounded-lg shadow-lg w-full max-w-md p-6",
        "max-h-[90dvh] overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

export {
  DialogRoot,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
