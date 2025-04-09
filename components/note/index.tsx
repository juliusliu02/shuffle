import React, { FormEvent } from "react";
import {
  ArticleWithNotesAndHighlights,
  NoteWithHighlights as NoteType,
} from "@/lib/models";
import { Button } from "@/components/ui/button";
import { honoClient } from "@/lib/rpc/hono-client";
import { InferRequestType } from "hono";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from "swr";
import { PencilLine, Trash2 } from "lucide-react";

type NotesProps = {
  notes: NoteType[];
};

const $put = honoClient.api.notes[":id"].$put;
const $delete = honoClient.api.notes[":id"].$delete;

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldsToUpdate = Object.fromEntries(new FormData(e.currentTarget));

    try {
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
              (old: ArticleWithNotesAndHighlights | undefined) => {
                if (!old) return old; // first load hasn’t finished yet
                return {
                  ...old,
                  notes: old.notes.map((n) =>
                    n.id === note.id ? { ...n, ...fieldsToUpdate } : n,
                  ),
                };
              },
              false, // don’t revalidate; we already have the right data
            );
          },
        },
      );
      setEdit(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    console.log("here");
    const response = await $delete({
      param: {
        id: note.id.toString(),
      },
    });
    if (response.ok) {
      await globalMutate(
        `/api/articles/${note.articleId}`,
        (old: ArticleWithNotesAndHighlights | undefined) => {
          if (!old) return old;
          return {
            ...old,
            notes: old.notes.filter((n) => n.id !== note.id),
          };
        },
      );
    }
  };

  if (edit) {
    return (
      <form
        className="p-4 sm:rounded-xl flex flex-col border"
        onSubmit={handleSubmit}
      >
        <input
          className="text-xl font-semibold"
          placeholder="Entry"
          name="entry"
          defaultValue={note.entry}
        />
        <input
          className="mt-2"
          name="type"
          defaultValue={note.type ? note.type : undefined}
          placeholder={"Category"}
        />
        <textarea
          className="my-4 w-full resize-none"
          name="note"
          placeholder={"Add your comments here..."}
          defaultValue={note.note ? note.note : undefined}
        />
        <div className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 />
          </Button>
          <div className="self-end flex gap-2">
            <Button variant={"outline"} onClick={() => setEdit(false)}>
              Cancel
            </Button>
            <Button
              className={"bg-amber-800 hover:bg-amber-900"}
              type={"submit"}
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
      className="hover:bg-stone-100 p-4 sm:rounded-xl transition hover:not-focus:cursor-pointer group"
      onClick={() => setEdit(true)}
    >
      <div className="flex justify-between">
        <dt className="text-wrap font-semibold text-xl">{note.entry}</dt>
        <PencilLine className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />
      </div>
      {note.type && (
        <div className="text-muted-foreground my-2">{note.type}</div>
      )}
      {note.note && <dd className="mt-4">{note.note}</dd>}
    </div>
  );
};

const Notes = ({ notes }: NotesProps) => {
  notes.sort(
    (a, b) => a.highlights[0].startOffset - b.highlights[0].startOffset,
  );

  return (
    <div className="-m-4 md:m-0">
      <header className="mb-6 mx-4">
        <h2 className="font-bold text-2xl">My notes</h2>
      </header>
      <dl className="space-y-1">
        {notes.map((note) => (
          <Note note={note} key={note.id} />
        ))}
      </dl>
    </div>
  );
};

export default Notes;
