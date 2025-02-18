"use client";

import React, { Ref } from "react";
import { useRouter } from "next/navigation";
import { type Message } from "@itell/core/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { Button } from "@itell/ui/button";
import { cn, getChunkElement } from "@itell/utils";
import htmr from "htmr";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { routes } from "@/lib/navigation";
import { scrollToElement } from "@/lib/utils";
import { ChatFeedback } from "./chat-feedback";

type Props = {
  initialMessage: Message;
  data: Message[];
  ref?: Ref<HTMLDivElement>;
  updatedAt?: Date;
  prevData?: Message[];
  className?: string;
};

export function ChatItems({
  initialMessage,
  data,
  ref,
  prevData,
  updatedAt,
  className,
}: Props) {
  return (
    <div
      ref={ref}
      className={cn(
        "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-1 flex-col-reverse gap-3 overflow-y-auto px-2 py-3",
        className
      )}
    >
      <div className="flex-1 flex-grow space-y-3" role="status">
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
  const { user } = useSession();

  return (
    <div
      // only announce the message if it's not from the user
      role={message.isUser ? "" : "status"}
    >
      <div className="flex flex-row items-center gap-1 overflow-x-hidden text-sm">
        {message.isUser &&
          (user?.image ? (
            <Avatar className="size-7 rounded-full">
              <AvatarImage src={user.image} alt={"User profile photo"} />
              <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="size-7 rounded-full">
              <AvatarImage src="/images/user.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ))}
        <div
          className={cn("flex-1 rounded-lg p-2", {
            "border-2 bg-primary-foreground": !message.isUser,
            "bg-accent": message.isUser,
          })}
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <Spinner className="size-5" />
            </div>
          ) : (
            <>
              <MessageRenderer
                text={message.text}
                node={message.node}
                context={message.context}
                transform={message.transform}
              />
              {!message.isUser && (
                <footer className="mt-2">
                  <ChatAction message={message} />
                </footer>
              )}
            </>
          )}
        </div>
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
              router.push(routes.guide());
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

function ChatAction({ message }: { message: Message }) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="group px-1"
        aria-label="Copy message"
        onClick={async () => {
          await navigator.clipboard.writeText(message.text);
          toast.success("Message copied");
        }}
      >
        <CopyIcon className={"size-3 group-hover:stroke-info"} />
      </button>
      <ChatFeedback isPositive message={message} />
      <ChatFeedback isPositive={false} message={message} />
    </div>
  );
}
