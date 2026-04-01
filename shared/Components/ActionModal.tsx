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
  action: () => void;
  disabled?: boolean;
};

export default function ActionModal({
  triggerTitle,
  description,
  action,
  disabled,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant={"secondary"}
          className="cursor-pointer w-full"
        >
          {triggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{triggerTitle}</DialogTitle>
          <DialogDescription className="text-destructive text-balance">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={disabled}
            >
              Mégse
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={action}
              disabled={disabled}
            >
              Igen
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
