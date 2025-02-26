"use client";

import { useEffect, useMemo, useRef } from "react";
import { type BotMessage } from "@itell/core/chat";
import { useSelector } from "@xstate/store/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectStairsMessages } from "@/lib/store/chat-store";
import { scrollToLastChild } from "@/lib/utils";
import { ChatItems } from "./chat-items";
import { StairsReadyButton } from "./stairs-button";

export function ChatMessagesStairs() {
  const store = useChatStore();
  const messages = useSelector(store, SelectStairsMessages);
  const ref = useRef<HTMLDivElement>(null);

  const initialMessage = useMemo<BotMessage>(
    () => ({
      id: crypto.randomUUID(),
      isUser: false,
      text: "initial-message",
      node: (
        <StairsReadyButton
          onClick={() => {
            store.send({ type: "setStairsReady" });
          }}
        />
      ),
    }),
    [store]
  );

  useEffect(() => {
    if (ref.current?.parentElement) {
      scrollToLastChild(ref.current.parentElement);
    }
  }, [messages]);

  return (
    <ChatItems data={messages} initialMessage={initialMessage} ref={ref} />
  );
}
