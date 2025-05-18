"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { darkColors, lightColors } from "@itell/constants";
import { usePortal } from "@itell/core/hooks";
import {
  createNoteElements,
  deserializeRange,
  removeNotes,
} from "@itell/core/note";
import { PortalContainer } from "@itell/core/portal-container";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import { cn, getChunkElement } from "@itell/utils";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import {
  CheckIcon,
  NotepadTextIcon,
  PaletteIcon,
  TrashIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/actions/note";
import { noteStore } from "@/lib/store/note-store";
import type { NoteData } from "@/lib/store/note-store";

interface Props extends NoteData {
  pageSlug: string;
}

// eslint-disable-next-line react/display-name
export const NotePopover = memo(
  ({
    id,
    highlightedText,
    noteText,
    pageSlug,
    chunkSlug,
    updatedAt,
    range,
    color,
    local = false,
  }: Props) => {
    const elements = useRef<HTMLElement[]>(undefined);
    const [positionFailed, setPositionFailed] = useState(
      local ? false : undefined
    );
    const [noteColor, setNoteColor] = useState(color);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // used to compare the user input with the current note text
    const [text, setText] = useState(noteText);

    const getInput = useCallback(
      () => textareaRef.current?.value.trim() ?? "",
      []
    );

    // this state is only used for focusing the textarea and does not control the popover state
    const [recordId, setRecordId] = useState<number | null>(local ? null : id);
    const [pending, setPending] = useState(false);
    const shouldUpdate = Boolean(recordId);
    const popoverId = `note-${String(id)}-popover`;

    const handleDelete = async () => {
      setPending(true);
      popoverRef.current?.hidePopover();
      removeNotes(id);

      // eslint-disable-next-line drizzle/enforce-delete-with-where
      noteStore.trigger.delete({ id });
      if (recordId) {
        // delete note in database
        await deleteNoteAction({ id: recordId });
        setPending(false);
      } else {
        setPending(false);
      }
    };

    const handleColorChange = useCallback(
      (value: string) => {
        setNoteColor(value);

        if (recordId) {
          updateNoteAction({
            id: recordId,
            data: { color: value },
          });
        }
      },
      [recordId]
    );

    const handleUpsert = async () => {
      setPending(true);

      const noteText = getInput();
      if (shouldUpdate) {
        if (recordId) {
          noteStore.trigger.update({
            id,
            data: {
              noteText,
              color: noteColor,
            },
          });
          const [_, err] = await updateNoteAction({
            id: recordId,
            data: {
              noteText,
              color: noteColor,
            },
          });
          if (err) {
            return toast.error("Failed to update note");
          }
        }
      } else {
        const [data, err] = await createNoteAction({
          noteText,
          highlightedText,
          pageSlug,
          color: noteColor,
          chunkSlug,
          range,
        });
        if (err) {
          return toast.error("Failed to create note");
        }
        setRecordId(data.id);
      }
      popoverRef.current?.hidePopover();
      setText(noteText);
      setPending(false);
    };

    useEffect(() => {
      const setup = async () => {
        try {
          const els = await createNoteElements({
            id,
            range: deserializeRange(
              range,
              getChunkElement(chunkSlug, "data-chunk-slug") ?? undefined
            ),
            color,
          });
          elements.current = els;

          setAnchor(els[els.length - 1]);
          setPositionFailed(false);
        } catch (err) {
          console.log("note creation error", err);
          if (!chunkSlug) {
            setPositionFailed(true);
          } else {
            const chunk = getChunkElement(chunkSlug, "data-chunk-slug");
            if (chunk) {
              setAnchor(chunk);
            } else {
              setPositionFailed(true);
            }
          }
        }
      };

      const timeout = setTimeout(() => {
        setup();
      }, 100);

      return () => clearTimeout(timeout);
    }, [chunkSlug, color, id, range]);

    useEffect(() => {
      if (elements.current) {
        elements.current.forEach((element) => {
          element.style.backgroundColor = noteColor;
        });
      }
    }, [noteColor]);

    if (positionFailed === undefined) {
      return null;
    }

    return (
      <div className="note-popover-container">
        {anchor && (
          <NoteTrigger anchor={anchor} popoverTarget={popoverId} open={local} />
        )}
        <div
          id={popoverId}
          ref={popoverRef}
          popover="auto"
          role="tooltip"
          className="h-[200px] w-[400px] rounded-md border p-4 pb-2 shadow-md hover:shadow-lg md:w-80"
        >
          <form
            className="flex h-full w-full flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const color = String(formData.get("color"));
              handleColorChange(color);
            }}
          >
            <Label className="flex-1">
              <span className="sr-only">note text</span>
              <textarea
                name="input"
                defaultValue={noteText}
                placeholder="Add Note"
                ref={textareaRef}
                className="h-full resize-none rounded-md bg-transparent text-sm outline-hidden"
              />
            </Label>

            <footer className="flex items-center justify-between gap-1 border-t px-2 pt-2">
              {!recordId ? (
                <p className="text-muted-foreground text-sm">unsaved</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  last updated at{" "}
                  <time>
                    {(updatedAt ? updatedAt : new Date()).toLocaleString()}
                  </time>
                </p>
              )}
              {positionFailed ? (
                <p className="text-muted-foreground text-sm">
                  Can&apos;t find reference text for this note
                </p>
              ) : null}

              <div className="flex items-center gap-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="group p-2"
                      aria-label="delete note"
                      onClick={() => popoverRef.current?.hidePopover()}
                    >
                      <TrashIcon className="group-hover:stroke-info size-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this note?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="mt-0">
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        disabled={pending}
                        onClick={handleDelete}
                        pending={pending}
                      >
                        Continue
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <ColorPicker
                  id={id}
                  color={noteColor}
                  onChange={handleColorChange}
                />
                <button
                  type="button"
                  className="group p-2"
                  aria-label="save note"
                  onClick={handleUpsert}
                >
                  <CheckIcon className="group-hover:stroke-info size-4" />
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    );
  }
);
function NoteTrigger({
  anchor,
  popoverTarget,
  open,
}: {
  anchor: HTMLElement;
  popoverTarget: string;
  open: boolean;
}) {
  const { addPortal, portals, removePortals } = usePortal();

  useEffect(() => {
    addPortal(
      <NoteTriggerInner open={open} popoverTarget={popoverTarget} />,
      anchor
    );

    return () => removePortals();
  }, [anchor, addPortal, removePortals, open, popoverTarget]);

  return <PortalContainer portals={portals} />;
}

function NoteTriggerInner({
  popoverTarget,
  open,
}: {
  popoverTarget: string;
  open: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [popover] = useState(() => document.getElementById(popoverTarget));

  useEffect(() => {
    if (ref.current && popover) {
      computePosition(ref.current, popover, {
        placement: "bottom-end",
        strategy: "fixed",
        middleware: [flip(), shift({ padding: 5 }), offset(3)],
      }).then(({ x, y }) => {
        popover.style.left = `${String(x)}px`;
        popover.style.top = `${String(y)}px`;
      });
    }
  }, [popoverTarget]);

  useEffect(() => {
    if (open) {
      popover?.showPopover();

      const textarea = popover?.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }
  }, [open]);

  return (
    <button
      ref={ref}
      className="mx-1"
      role="tooltip"
      aria-label="Show note"
      onMouseEnter={() => popover?.showPopover()}
      // @ts-expect-error allow prop
      popovertarget={popoverTarget}
    >
      <NotepadTextIcon className="size-5" />
    </button>
  );
}

type ColorPickerProps = {
  id: number;
  color: string;
  onChange: (color: string) => void;
};
function ColorPicker({ id, color, onChange }: ColorPickerProps) {
  const popoverId = `color-picker-${String(id)}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const colors =
    theme === "light" ? lightColors.slice(0, 8) : darkColors.slice(0, 8);
  const [customBg, setCustomBg] = useState<string>(colors[0]);

  return (
    <div>
      <button
        type="button"
        className="group p-2"
        aria-label="change note color"
        // @ts-expect-error popoverTarget is not typed
        popovertarget={popoverId}
        ref={triggerRef}
      >
        <PaletteIcon className="group-hover:stroke-info size-4" />
      </button>
      <div
        id={popoverId}
        popover="auto"
        role="tooltip"
        className="rounded-md"
        ref={popoverRef}
      >
        <div className="grid grid-cols-6 gap-2 p-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              style={{ background: c }}
              className={cn(
                "size-8 rounded-md",
                c === color ? "border-primary border-2" : ""
              )}
              onClick={() => {
                onChange(c);
              }}
            />
          ))}
          <button
            type="button"
            className="text-foreground col-span-1 inline-flex size-8 items-center justify-center
              rounded-md"
            style={{
              background: customBg,
            }}
            onClick={() => {
              onChange(customBg);
            }}
          >
            #
          </button>
          <Input
            className="col-span-3 h-8 w-28"
            name="color"
            value={customBg || ""}
            onChange={(e) => {
              if (e.target.value.length <= 7) {
                setCustomBg(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

// unused anchor position style
/*
<style>
{`
	#${triggerId} {
		anchor-name: --${anchorName};
	}

	#${popoverId} {
		position-anchor: --${anchorName};
		inset: auto;
		inset-area: left span-bottom;
		position-try: flip-block;
	}
`}
</style>
*/
