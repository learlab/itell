"use client";

import { Button } from "@itell/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { useSelector } from "@xstate/store/react";
import pluralize from "pluralize";

import { noteStore, SelectNoteCount } from "@/lib/store/note-store";

export function NoteCount() {
  const count = useSelector(noteStore, SelectNoteCount);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size={"sm"} className="px-1.5 text-sm">
          {pluralize("note", count, true)}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={12} className="w-48">
        You can add a note by selecting text and click &quot;Add Note&quot;
      </TooltipContent>
    </Tooltip>
  );
}
