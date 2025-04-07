import React from "react";
import { NoteWithHighlights as NoteType } from "@/lib/models";

type NotesProps = {
  notes: NoteType[];
};

const Note = ({ note }: { note: NoteType }) => {
  return (
    <div>
      <dt className="text-wrap font-semibold text-xl">{note.entry}</dt>
      {note.type && (
        <div className="text-muted-foreground mt-2 mb-4">{note.type}</div>
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
    <>
      <header className="mb-10">
        <h2 className="font-bold text-2xl">My notes</h2>
      </header>
      <dl className="space-y-8">
        {notes.map((note) => (
          <Note note={note} key={note.id} />
        ))}
      </dl>
    </>
  );
};

export default Notes;
