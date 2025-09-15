"use client";

import { Elements } from "@itell/constants";
import { ScrollArea } from "@itell/ui/scroll-area";
import { useSelector } from "@xstate/store/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectStairsReady } from "@/lib/store/chat-store";
import { ChatInputStairs } from "./chat/chat-input-stairs";
import { ChatMessagesStairs } from "./chat/chat-messages-stairs";

interface Props {
  pageSlug: string;
  footer: React.ReactNode;
  id?: string;
}

export function ChatStairs({ pageSlug, footer, id }: Props) {
  const store = useChatStore();
  const stairsReady = useSelector(store, SelectStairsReady);

  return (
    <div
      id={id}
      className="bg-background text-foreground z-30 space-y-3"
      role="alert"
      tabIndex={-1}
      aria-relevant="additions"
    >
      <a className="sr-only" href={`#${Elements.STAIRS_HIGHLIGHTED_CHUNK}`}>
        go to the relevant section
      </a>

      <ScrollArea className="h-[350px]">
        <div className="h-full">
          <p className="text-sm leading-relaxed">
            Before continuing, you will be presented a question for the section
            that is highlighted on the left side.{" "}
            <span className="font-semibold">
              Reread the section on the left side
            </span>{" "}
            and when you are ready for the question, click the button below
          </p>
          <ChatMessagesStairs />
        </div>
      </ScrollArea>
      {stairsReady && <ChatInputStairs pageSlug={pageSlug} />}
      {footer}
      <footer className="text-muted-foreground px-4 py-2 text-xs">
        This content has been AI-generated and may contain errors.{" "}
      </footer>
    </div>
  );
}
