"use client";
import React, { type FormEvent, useCallback } from "react";

import { type InferRequestType } from "hono";
import { PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { appClient } from "@/lib/rpc/app-cli";
import {
  type ArticleWithNotesAndHighlights,
  type NoteWithHighlights as NoteType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type NotesProps = {
  notes: NoteType[];
};

const $put = appClient.notes[":id"].$put;
const $delete = appClient.notes[":id"].$delete;

const fetcher = async (
  _url: string,
  { arg }: { arg: InferRequestType<typeof $put> },
) => {
  return await $put(arg);
};

const Note = ({ note }: { note: NoteType }) => {
  const url = `/api/notes/${note.id}`;
  const [edit, setEdit] = React.useState<boolean>(false);
  const { trigger, isMutating } = useSWRMutation(url, fetcher);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fieldsToUpdate = Object.fromEntries(new FormData(e.currentTarget));

      await trigger(
        {
          param: { id: note.id.toString() },
          json: fieldsToUpdate,
        },
        {
          // update based on current content to avoid extra get.
          onSuccess: () => {
            globalMutate(
              `/api/articles/${note.articleId}`,
              (
                old: ArticleWithNotesAndHighlights | undefined,
              ): ArticleWithNotesAndHighlights | undefined => {
                if (!old) return old; // first load hasn’t finished yet
                return {
                  ...old,
                  notes: old.notes.map(
                    (n: NoteType): NoteType =>
                      n.id === note.id ? { ...n, ...fieldsToUpdate } : n,
                  ),
                };
              },
              false, // don’t revalidate; we already have the right data
            );
          },
          onError: (error: unknown) => {
            if (error instanceof Error) {
              toast.error(error.message);
              return;
            }
            toast.error("An error occurred while saving your note.");
          },
        },
      );
      setEdit(false);
    },
    [note.articleId, note.id, trigger],
  );

  const handleDelete = useCallback(async () => {
    const response = await $delete({
      param: {
        id: note.id.toString(),
      },
    });
    if (response.ok) {
      await globalMutate(
        `/api/articles/${note.articleId}`,
        (
          old: ArticleWithNotesAndHighlights | undefined,
        ): ArticleWithNotesAndHighlights | undefined => {
          if (!old) return old;
          return {
            ...old,
            notes: old.notes.filter((n: NoteType) => n.id !== note.id),
          };
        },
      );
      toast.success("Note deleted successfully.");
    }
  }, [note.articleId, note.id]);

  if (edit) {
    return (
      <form
        className="p-4 sm:rounded-xl flex flex-col border"
        onSubmit={handleSubmit}
      >
        <input
          className="text-lg font-medium -mx-2 px-2 py-1 -my-1 rounded-sm outline-none focus-visible:bg-stone-200/50 dark:focus-visible:bg-stone-700/50 transition"
          placeholder="Entry"
          name="entry"
          defaultValue={note.entry}
        />
        <input
          className="text-sm text-muted-foreground -mx-2 px-2 py-1 mt-0.5 rounded-sm outline-none focus-visible:bg-stone-200/50 dark:focus-visible:bg-stone-700/50 transition"
          name="type"
          defaultValue={note.type ? note.type : undefined}
          placeholder={"Category"}
        />
        <textarea
          className="mt-1 mb-2 resize-none -mx-2 px-2 py-1 rounded-sm outline-none focus-visible:bg-stone-200/50 dark:focus-visible:bg-stone-700/50 transition"
          name="note"
          placeholder={"Add your comments here..."}
          defaultValue={note.note ? note.note : undefined}
          onKeyDown={(e) => {
            // For save with ctrl + enter
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type={"button"}
                variant={"destructive"}
                className="text-amber-50"
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your notes. Do you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(buttonVariants({ variant: "destructive" }))}
                  onClick={handleDelete}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="self-end flex gap-2">
            <Button
              type={"button"}
              variant={"outline"}
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
            <Button
              className={"bg-amber-300 hover:bg-amber-400 text-slate-800"}
              type="submit"
              disabled={isMutating}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className="hover:bg-stone-100 dark:hover:bg-stone-700 p-4 sm:rounded-xl transition hover:not-focus:cursor-pointer group"
      onClick={() => setEdit(true)}
    >
      <div className="flex justify-between items-center">
        <dt className="text-lg text-wrap font-medium">{note.entry}</dt>
        <PencilLine className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />
      </div>
      {note.type && (
        <div className="text-muted-foreground text-sm mt-0.5">{note.type}</div>
      )}
      {note.note && <dd className="mt-2">{note.note}</dd>}
    </div>
  );
};

const Notes = ({ notes }: NotesProps) => {
  notes.sort(
    (a, b) => a.highlights[0].startOffset - b.highlights[0].startOffset,
  );

  return (
    <>
      <header className="mb-4">
        <h2 className="font-semibold text-xl">My notes</h2>
      </header>
      <dl className="space-y-1 -mx-4">
        {notes.map((note) => (
          <Note note={note} key={note.id} />
        ))}
      </dl>
    </>
  );
};

export default Notes;
