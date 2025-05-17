"use client";

import { useState } from "react";
import { Message } from "@itell/core/chat";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@itell/ui/dialog";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import { SendHorizontalIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { createChatFeedbackAction } from "@/actions/feedback";
import { useChatStore } from "@/components/provider/page-provider";
import { getHistory } from "@/lib/store/chat-store";
import { reportSentry } from "@/lib/utils";

export function ChatFeedback({
  isPositive,
  message,
}: {
  isPositive: boolean;
  message: Message;
}) {
  const store = useChatStore();
  const [open, setOpen] = useState(false);
  const { error, execute } = useServerAction(createChatFeedbackAction);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label={isPositive ? "Like" : "Dislike"}
        className="group/item"
      >
        {isPositive ? (
          <ThumbsUpIcon className={"group-hover/item:stroke-info size-3"} />
        ) : (
          <ThumbsDownIcon className={"group-hover/item:stroke-info size-3"} />
        )}
      </DialogTrigger>

      {/* HACK: make chat feedback dialog clickable when stairs is activated */}
      <DialogContent id="chat-action-dialog" className="driver-active-element">
        <DialogHeader>
          <DialogTitle>Share your experience with iTELL AI</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const text = String(formData.get("text"));

            const history = getHistory(store, { messageId: message.id });
            const href = window.location.href.split("/");
            // NOTE: a workaround so we don't need to pass down pageSlug
            const pageSlug = href[href.length - 1];
            const [, err] = await execute({
              isPositive,
              text,
              pageSlug,
              message,
              history,
            });
            if (!err) {
              setOpen(false);
              toast.success("Feedback received. Thank you!");
            } else {
              reportSentry("create chat feedback", { err });
            }
          }}
        >
          {error && (
            <Errorbox title="Failed to save your feedback, please try again later." />
          )}
          <Label>
            <span className="sr-only">Your feedback</span>
            <TextArea
              name="text"
              rows={4}
              placeholder={
                isPositive
                  ? "We are glad that you like iTELL AI, can you tell us how it helped you?"
                  : "We are sorry you don't like iTELL AI,  can you let us know what can be improved?"
              }
              className="border-none font-normal md:text-base xl:text-lg"
            />
          </Label>
          <footer className="mt-2">
            <ChatFeedbackSubmit />
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ChatFeedbackSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} pending={pending} className="w-36">
      <span className="inline-flex items-center gap-2">
        <SendHorizontalIcon className="size-3" />
        Submit
      </span>
    </Button>
  );
}
