"use client";

import { useEffect, useMemo } from "react";
import { Elements } from "@itell/constants";
import { type Message } from "@itell/core/chat";
import { useSelector } from "@xstate/store/react";

import { useChatStore } from "@/components/provider/page-provider";
import { botMessage, SelectMessages } from "@/lib/store/chat-store";
import { scrollToLastChild } from "@/lib/utils";
import { ChatItems } from "./chat-items";
import type { StoreMessage } from "@/lib/store/chat-store";

type Props = {
  data: Message[];
  updatedAt: Date;
  pageTitle: string;
  className?: string;
};

export function ChatMessages({ data, updatedAt, pageTitle, className }: Props) {
  const store = useChatStore();
  const messages = useSelector(store, SelectMessages);

  const initialMessage = useMemo<StoreMessage>(
    () =>
      botMessage({
        text: "initial-message",
        isStairs: false,
        node: (
          <p>
            Hello, how can I help you with{" "}
            <span className="font-semibold italic">{pageTitle}</span> ?
          </p>
        ),
      }),
    [pageTitle]
  );

  useEffect(() => {
    scrollToLastChild(Elements.CHATBOT_CONTAINER);
  }, [messages]);

  return (
    <ChatItems
      initialMessage={initialMessage}
      data={messages}
      prevData={data}
      updatedAt={updatedAt}
      className={className}
    />
  );
}
