import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FormModal({
  dialogOpen,
  setDialogOpen,
  formError,
  title,
  width,
  children,
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
        className={`max-h-[90vh] overflow-auto sm:max-w-[${width}px] pb-0`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {formError && <p className="text-destructive">{formError}</p>}

        {children}
      </DialogContent>
    </Dialog>
  );
}
