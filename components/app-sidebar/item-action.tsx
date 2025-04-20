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
import { Archive, Ellipsis, Trash2 } from "lucide-react";
import { appClient } from "@/lib/rpc/app-cli";
import type { InferRequestType } from "hono";
import useSWRMutation from "swr/mutation";
import type { ArticleListItem } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

const $delete = appClient.articles[":id"].$delete;

const deleteArticle = async (
  _key: string,
  { arg }: { arg: InferRequestType<typeof $delete> },
) => {
  const response = await $delete(arg);
  if (response.status !== 204) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response;
};

const ItemAction = ({ id }: { id: number }) => {
  const router = useRouter();
  const { trigger: archiveTrigger, isMutating: archiveMutating } =
    useSWRMutation("/api/articles", archiveArticle, {
      populateCache: (_data, current: ArticleListItem[] = []) =>
        current.filter((item) => item.id !== id),
      revalidate: false,
      rollbackOnError: true,
    });

  const handleArchive = async () => {
    try {
      await archiveTrigger({
        json: {
          isArchived: true,
        },
        param: {
          id: id.toString(),
        },
      });

      toast.success("Article archived successfully.");
      router.push("/");
    } catch (error) {
      let description;
      if (error instanceof Error) {
        description = error.message;
      }
      toast.error("Failed to archive article.", { description });
    }
  };

  const { trigger: deleteTrigger } = useSWRMutation(
    "/api/articles",
    deleteArticle,
    {
      populateCache: (_data, current: ArticleListItem[] = []) =>
        current.filter((item) => item.id !== id),
      revalidate: false,
      rollbackOnError: true,
    },
  );

  const handleDelete = async () => {
    try {
      await deleteTrigger({
        param: {
          id: id.toString(),
        },
      });
      toast.success("Article deleted successfully.");
      router.push("/");
    } catch (error) {
      let description;
      if (error instanceof Error) {
        description = error.message;
      }
      toast.error("Failed to delete article. Please try again later.", {
        description,
      });
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto focus-visible:outline-none opacity-0 group-hover/item:opacity-100 aria-expanded:opacity-100">
          <Ellipsis size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"start"}>
          <DropdownMenuItem disabled={archiveMutating} onClick={handleArchive}>
            <Archive />
            <span className="ml-1">Archive</span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Trash2 />
              <span className="ml-1">Delete</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this article?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemAction;
