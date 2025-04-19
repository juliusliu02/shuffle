"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

const ItemAction = ({ id }: { id: number }) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto focus-visible:outline-none opacity-0 group-hover/item:opacity-100 aria-expanded:opacity-100">
          <Ellipsis size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"start"}>
          <DropdownMenuItem
            onClick={() => {
              // placeholder
              console.log(id);
            }}
          >
            Archive
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Delete</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemAction;
