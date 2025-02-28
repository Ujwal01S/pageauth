import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteIcon, X } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import { deleteFood } from "@/libs/api";

export default function DeleteButton({ id }: { id: string }) {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFood"] });
      // need to send success status from backend to reflect onSuccess
      setOpen(false);
    },
  });

  const handleDelete = () => {
    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-6 py-2 w-fit rounded-md bg-red-500">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <span
            className=" flex gap-2 w-fit rounded-sm bg-slate-300 px-2 items-center py-1 cursor-pointer"
            onClick={handleDelete}
          >
            <DeleteIcon className="text-red-600" size={20} />
            Delete
          </span>

          <span
            className=" flex gap-2 w-fit rounded-sm bg-slate-300 px-2 items-center py-1 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X className="text-red-600" size={20} />
            Cancel
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
