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
import { appClient } from "@/lib/rpc/app-cli";
import type { InferRequestType } from "hono";
import useSWRMutation from "swr/mutation";
import type { ArticleListItem } from "@/lib/types";
import { toast } from "sonner";

const $patch = appClient.articles[":id"].$patch;

const archiveArticle = async (
  _key: string,
  { arg }: { arg: InferRequestType<typeof $patch> },
) => {
  const response = await $patch(arg);
  if (response.status !== 204) {
    let error;
    try {
      // known error from controller
      const data = await response.json();
      error = data.error;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- response might not be json
    } catch (e) {
      error = "An unknown error occurred.";
    }
    throw new Error(error);
  }
  return response;
};

const ItemAction = ({ id }: { id: number }) => {
  const { trigger, isMutating } = useSWRMutation(
    "/api/articles",
    archiveArticle,
    {
      populateCache: (_data, current: ArticleListItem[] = []) =>
        current.filter((item) => item.id !== id),
      revalidate: false,
      rollbackOnError: true,
    },
  );

  const handleArchive = async () => {
    try {
      await trigger({
        json: {
          isArchived: true,
        },
        param: {
          id: id.toString(),
        },
      });

      toast.success("Article archived successfully.");
    } catch (error) {
      let description;
      if (error instanceof Error) {
        description = error.message;
      }
      toast.error("Failed to archive article.", { description });
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto focus-visible:outline-none opacity-0 group-hover/item:opacity-100 aria-expanded:opacity-100">
          <Ellipsis size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"start"}>
          <DropdownMenuItem disabled={isMutating} onClick={handleArchive}>
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
