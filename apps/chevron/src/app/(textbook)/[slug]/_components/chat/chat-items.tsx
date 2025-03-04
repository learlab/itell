"use client";

import React, { Ref, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type Message } from "@itell/core/chat";
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
import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { Button } from "@itell/ui/button";
import { cn, getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import htmr from "htmr";
import { CopyIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { deleteChatsAction } from "@/actions/chat";
import { AdminButton } from "@/components/admin-button";
import { useChatStore, useSession } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { routes } from "@/lib/navigation";
import { SelectActiveMessageId } from "@/lib/store/chat-store";
import { scrollToElement } from "@/lib/utils";
import { ChatFeedback } from "./chat-feedback";

type Props = {
  data: Message[];
  initialMessage?: Message;
  /**
   * Can be used to delete chat history, should not be provided for stairs
   */
  pageSlug?: string;
  ref?: Ref<HTMLDivElement>;
  updatedAt?: Date;
  prevData?: Message[];
  className?: string;
};

export function ChatItems({
  data,
  initialMessage,
  pageSlug,
  ref,
  prevData,
  updatedAt,
  className,
}: Props) {
  const store = useChatStore();
  const { user } = useSession();
  const activeId = useSelector(store, SelectActiveMessageId);
  return (
    <div
      ref={ref}
      className={cn(
        `scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter
        scrollbar-w-2 scrolling-touch flex flex-1 flex-col-reverse gap-3 overflow-y-auto
        px-2 py-3`,
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-3" role="status">
        {prevData && prevData.length > 0 && (
          <>
            {prevData.map((message) => {
              return <MessageItemMemo key={message.id} message={message} />;
            })}
            <div
              className="text-muted-foreground my-4 flex items-center justify-center gap-2 text-center
                text-sm"
            >
              <div className="bg-muted h-1 w-16" />
              {updatedAt
                ? `Last visited at ${updatedAt.toLocaleTimeString()}`
                : null}
              <div className="bg-muted h-1 w-16" />
            </div>
            {user?.isAdmin && pageSlug && (
              <div>
                <DeleteChat pageSlug={pageSlug} />
              </div>
            )}
          </>
        )}
        {initialMessage && <MessageItemMemo message={initialMessage} />}

        {data.map((message) => {
          return (
            <MessageItemMemo
              key={message.id}
              message={message}
              isPending={message.id === activeId}
            />
          );
        })}
      </div>
    </div>
  );
}

function DeleteChat({ pageSlug }: { pageSlug: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton size={"sm"}>Delete Chat History</AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chat history?</AlertDialogTitle>
          This will delete your chat messages for the current page.
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={pending}
            pending={pending}
            onClick={() => {
              startTransition(async () => {
                await deleteChatsAction({ pageSlug });
                router.refresh();
              });
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Blockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote className="border-primary bg-accent mt-2 border-l-4 pl-4 italic">
      {children}
    </blockquote>
  );
}

const components = {
  blockquote: Blockquote,
};

const MessageItemMemo = React.memo(MessageItem);

function MessageItem({
  message,
  isPending = false,
}: {
  message: Message;
  isPending?: boolean;
}) {
  const { user } = useSession();

  return (
    <div
      className="group relative"
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
        {message.text !== "" && (
          <div
            className={cn("flex-1 rounded-lg p-2", {
              "bg-primary-foreground border-2": !message.isUser,
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

      <AnimatePresence>
        {!message.isUser && (
          <footer
            className="bg-accent absolute bottom-0 right-0 z-10 mt-2 translate-y-1/2 rounded-lg border
              px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChatAction message={message} />
          </footer>
        )}
      </AnimatePresence>
      {isPending ? <Spinner className="mt-2 size-5" /> : null}
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
              scrollToElement(element, { offset: -120 });
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
        className="group/item px-1"
        aria-label="Copy message"
        onClick={async () => {
          await navigator.clipboard.writeText(message.text);
          toast.success("Message copied");
        }}
      >
        <CopyIcon className={"group-hover/item:stroke-info size-3"} />
      </button>
      <ChatFeedback isPositive message={message} />
      <ChatFeedback isPositive={false} message={message} />
    </div>
  );
}
