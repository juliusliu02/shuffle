"use client";
import React from "react";

import type { InferRequestType } from "hono";
import { Archive, Download, Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appClient } from "@/lib/rpc/app-cli";
import type { ArticleListItem } from "@/lib/types";

const $patch = appClient.articles[":id"].$patch;

const archiveArticle = async (
  _key: [string, boolean],
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
  _key: [string, boolean],
  { arg }: { arg: InferRequestType<typeof $delete> },
) => {
  const response = await $delete(arg);
  if (response.status !== 204) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response;
};

const $cardPost = appClient.articles[":id"].flashcards.$post;

const generateCards = async (
  key: string,
  { arg }: { arg: InferRequestType<typeof $cardPost> },
) => {
  const response = await $cardPost(arg);
  if (response.status !== 200) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response;
};

type ItemActionProps = {
  id: number;
  isArchived: boolean;
};

const ItemAction = ({ id, isArchived }: ItemActionProps) => {
  const router = useRouter();
  const { trigger: archiveTrigger, isMutating: archiveMutating } =
    useSWRMutation(["/api/articles", isArchived], archiveArticle, {
      populateCache: (_data, current: ArticleListItem[] = []) =>
        current.filter((item) => item.id !== id),
      revalidate: false,
      rollbackOnError: true,
    });

  const handleArchive = async () => {
    try {
      await archiveTrigger({
        json: {
          isArchived: !isArchived,
        },
        param: {
          id: id.toString(),
        },
      });

      toast.success("Article toggled successfully.");
      router.push("/");
    } catch (error) {
      let description;
      if (error instanceof Error) {
        description = error.message;
      }
      toast.error("Failed to toggle archive for the article.", { description });
    }
  };

  const { trigger: deleteTrigger } = useSWRMutation(
    ["/api/articles", isArchived],
    deleteArticle,
    {
      populateCache: (_data, current: ArticleListItem[] = []) =>
        current.filter((item) => item.id !== id),
      revalidate: false,
      rollbackOnError: true,
    },
  );

  // for dialog
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteTrigger({
        param: {
          id: id.toString(),
        },
      });
      toast.success("Article deleted successfully.");
      setOpen(false);
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

  const { trigger: genCardTrigger, isMutating: genCardIsMutating } =
    useSWRMutation("/api/articles/cards", generateCards);

  const handleCreateCard = async () => {
    try {
      await genCardTrigger({
        param: {
          id: id.toString(),
        },
      });
      toast.success("Cards generated successfully.");
    } catch (error) {
      let description = "Failed to create cards. Please try again later.";
      if (error instanceof Error) {
        description = error.message;
      }
      toast.error(description);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto focus-visible:outline-none opacity-0 group-hover/item:opacity-100 aria-expanded:opacity-100">
          <Ellipsis size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align={"start"}
        >
          <DropdownMenuItem asChild>
            <Link href={`/api/articles/${id}/flashcards`}>
              <Download />
              <span className="ml-1">Export</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={genCardIsMutating}
            onClick={handleCreateCard}
          >
            <FilePenLine />
            <span className="ml-1">Create cards</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={archiveMutating} onClick={handleArchive}>
            <Archive />
            <span className="ml-1">
              {isArchived ? "Set active" : "Archive"}
            </span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Trash2 />
              <span className="ml-1">Delete</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent onClick={(e) => e.stopPropagation()}>
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
