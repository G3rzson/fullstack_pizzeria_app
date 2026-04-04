"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  triggerTitle: string;
  description: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
};

export default function ActionModal({
  triggerTitle,
  description,
  action,
  disabled,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleAction() {
    await action();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className="cursor-pointer w-full"
        >
          {triggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{triggerTitle}</DialogTitle>
          <DialogDescription className="text-destructive text-balance mt-4 mb-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-2">
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={disabled}
            >
              Mégse
            </Button>
          </DialogClose>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleAction}
            disabled={disabled}
          >
            Igen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
