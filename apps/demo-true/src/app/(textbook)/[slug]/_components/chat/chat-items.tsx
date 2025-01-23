"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { type Message } from "@itell/core/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { Button } from "@itell/ui/button";
import { cn, getChunkElement } from "@itell/utils";
import htmr from "htmr";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import { scrollToElement } from "@/lib/utils";

type Props = {
  initialMessage: Message;
  updatedAt?: Date;
  prevData?: Message[];
  data: Message[];
};

export function ChatItems({
  initialMessage,
  data,
  prevData,
  updatedAt,
}: Props) {
  return (
    <div
      className={cn(
        "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-1 flex-col-reverse gap-3 overflow-y-auto px-2 py-3"
      )}
    >
      <div className="flex-1 flex-grow space-y-2" role="status">
        {prevData?.map((message) => {
          return <MessageItemMemo key={message.id} message={message} />;
        })}
        {prevData && prevData.length > 0 ? (
          <div className="my-4 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <div className="h-1 w-16 bg-muted" />
            {updatedAt
              ? `Last visited at ${updatedAt.toLocaleTimeString()}`
              : null}
            <div className="h-1 w-16 bg-muted" />
          </div>
        ) : null}
        <MessageItemMemo message={initialMessage} />
        {data.map((message) => {
          return <MessageItemMemo key={message.id} message={message} />;
        })}
      </div>
    </div>
  );
}

function Blockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote className="mt-2 border-l-4 border-primary bg-accent pl-4 italic">
      {children}
    </blockquote>
  );
}

const components = {
  blockquote: Blockquote,
};

const MessageItemMemo = React.memo(MessageItem);

function MessageItem({ message }: { message: Message }) {
  const isPending = message.text === "";

  return (
    <div
      className={cn("chat-message flex items-end", {
        "justify-end": message.isUser,
      })}
      // only announce the message if it's not from the user
      role={message.isUser ? "" : "status"}
    >
      <div
        className={cn(
          "mx-2 flex max-w-xs flex-row items-start gap-1 overflow-x-hidden text-sm",
          message.isUser ? "justify-end" : "justify-start"
        )}
      >
        {message.isUser ? (
          <Avatar className="order-last h-8 w-8 rounded-none">
            <AvatarImage src="/images/user.svg" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8 rounded-none">
            <AvatarImage src="/images/itell-ai.svg" alt="itell ai says" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}

        {isPending ? (
          <Spinner className="size-4" />
        ) : (
          <div
            className={cn("rounded-lg px-4 py-2", {
              "border-2 bg-primary-foreground": !message.isUser,
              "bg-accent": message.isUser,
            })}
          >
            <MessageRenderer
              text={message.text}
              node={message.node}
              context={message.context}
              transform={message.transform}
            />
          </div>
        )}
      </div>
    </div>
  );
}

type DisplayMessage = Pick<Message, "text" | "context" | "node" | "transform">;

function MessageRenderer({ text, context, node, transform }: DisplayMessage) {
  const router = useRouter();

  if (node) {
    return node;
  }

  if (context !== undefined) {
    const formattedSlug =
      context === "[User Guide]"
        ? "User Guide"
        : context.split("-").slice(0, -1).join(" ");

    return (
      <>
        <p>{text}</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-1"
          onClick={() => {
            if (context === "[User Guide]") {
              router.push("/guide");
              return;
            }
            // find the context element
            const element = getChunkElement(context ?? null, "data-chunk-slug");
            if (element) {
              scrollToElement(element);
              return;
            }

            toast.warning("Source not found");
          }}
        >
          Source:{" "}
          {formattedSlug.length > 25
            ? `${formattedSlug.slice(0, 25)}...`
            : formattedSlug}
        </Button>
      </>
    );
  }

  return transform ? htmr(text, { transform: components }) : <p>{text}</p>;
}
