"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { useSelector } from "@xstate/store/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectHasMessages } from "@/lib/store/chat-store";

export function ChatWrapper({
  children,
  hasPrev,
}: {
  children: React.ReactNode;
  hasPrev: boolean;
}) {
  const store = useChatStore();
  const hasNew = useSelector(store, SelectHasMessages);
  const fresh = !hasNew && !hasPrev;
  return (
    <div
      className={"flex w-96 flex-col rounded-md border"}
      style={{
        height: "clamp(350px, 65vh, 960px)",
        justifyContent: fresh ? "flex-start" : "space-between",
      }}
      id="chat-popover"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="itell-ai-description"
    >
      <ChatHeader />
      {children}
      {!fresh && <ChatFooter />}
    </div>
  );
}

function ChatFooter() {
  return (
    <footer className="mt-auto px-4 py-2 text-xs text-muted-foreground">
      <p>This content has been AI-generated and may contain errors.</p>
    </footer>
  );
}

function ChatHeader() {
  const store = useChatStore();
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-1.5 bg-background px-3 py-4"
      aria-describedby="itell-ai-description"
    >
      <p id="itell-ai-description" className="sr-only">
        ITELL AI is a chatbot that can answer your questions regarding the
        textbook content.
      </p>
      <Avatar className="h-8 w-8 rounded-none">
        <AvatarImage src="/images/itell-ai.svg" alt="itell ai says" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <h3 className="font-medium tracking-tight">iTELL AI</h3>
      <button
        aria-label="Close chat"
        onClick={() => {
          store.trigger.setOpen({ value: false });
        }}
        className="ml-auto"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4 stroke-foreground"
        >
          <g>
            <path d="M12 11.59L3.96 3.54 2.54 4.96 12 14.41l9.46-9.45-1.42-1.42L12 11.59zm0 7l-8.04-8.05-1.42 1.42L12 21.41l9.46-9.45-1.42-1.42L12 18.59z"></path>
          </g>
        </svg>
      </button>
    </header>
  );
}
