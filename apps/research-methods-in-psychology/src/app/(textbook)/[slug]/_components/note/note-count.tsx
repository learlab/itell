"use client";

import { Button } from "@itell/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import pluralize from "pluralize";

import { noteStore, SelectNoteCount } from "@/lib/store/note-store";
import { useSelector } from "@xstate/store/react";

export function NoteCount() {
  const count = useSelector(noteStore, SelectNoteCount);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="px-0 text-left text-sm">
          {pluralize("note", count, true)}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 text-sm">
        <p>
          You can take note by selecting text and click the "take note" button.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
