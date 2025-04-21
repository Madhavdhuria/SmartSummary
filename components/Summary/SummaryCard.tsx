"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteSummary } from "@/actions/summary-actions";
import { toast } from "sonner";

type Props = {
  id: string;
  title: string;
  createdAt: string;
};

export const SummaryCard = ({ id, title, createdAt }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteSummary(id);
      if (res?.success) {
        setOpen(false);
        toast.success("Summary deleted successfully.");
      } else {
        setOpen(false);
        toast.error("Error deleting summary. Please try again.");
      }
    });
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{createdAt}</p>
      </div>
      <div className="flex gap-2">
        <Link href={`/summary/${id}`}>
          <Button>Open</Button>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" onClick={(e) => e.stopPropagation()}>
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the summary.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
