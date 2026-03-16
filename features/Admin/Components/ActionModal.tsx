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
};

export default function ActionModal({
  triggerTitle,
  description,
  action,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="cursor-pointer">
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
            <Button variant="destructive" className="cursor-pointer">
              Mégse
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={action}
            >
              Igen
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
