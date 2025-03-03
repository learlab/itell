"use client";

import { useEffect } from "react";
import { useSelector } from "@xstate/store/react";

import { type Note } from "@/drizzle/schema";
import { noteStore, SelectNotes } from "@/lib/store/note-store";
import { NotePopover } from "./note-popover";

type Props = {
  notes: Note[];
  pageSlug: string;
};

export function NoteList({ notes, pageSlug }: Props) {
  const data = useSelector(noteStore, SelectNotes);

  useEffect(() => {
    noteStore.trigger.initialize({ data: notes });
  }, [notes]);

  if (data.length > 0) {
    return (
      <div className="note-list mx-auto flex max-w-2xl flex-row gap-2">
        <p className="sr-only">list of notes</p>
        {data.map((note) => (
          <NotePopover
            key={note.id}
            local={false}
            {...note}
            pageSlug={pageSlug}
          />
        ))}
      </div>
    );
  }

  return null;
}
