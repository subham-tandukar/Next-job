import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function ConfirmModal({
  actionBtn,
  title,
  btnText,
  isLoading = false,
}) {
  return (
    <>
      <DialogContent className="sm:max-w-[425px] pb-3 pr-3">
        <DialogHeader>
          <DialogTitle className="mb-2 capitalize">{title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to {title}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className={"mt-8 border-t pt-3"}>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="capitalize"
            onClick={actionBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Please Wait
              </>
            ) : (
              btnText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
