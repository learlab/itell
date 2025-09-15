"use client";

import { useEffect, useState } from "react";
import { parseEventStream } from "@itell/utils";
import { useServerAction } from "zsa-react";

import { createChatsAction } from "@/actions/chat";
import { useChatStore } from "@/components/provider/page-provider";
import { apiClient } from "../api-client";
import { botMessage, getHistory, userMessage } from "../store/chat-store";
import { reportSentry } from "../utils";

export const useAddChat = () => {
  const store = useChatStore();
  const { addMessage, updateMessage, setActive } = store.trigger;
  const [pending, setPending] = useState(false);

  const { execute, isError, error } = useServerAction(createChatsAction);

  const action = async ({
    text,
    pageSlug,
    transform,
    currentChunk,
  }: {
    text: string;
    pageSlug: string;
    transform?: boolean;
    currentChunk?: string | null;
  }) => {
    setPending(true);
    const userTimestamp = Date.now();
    addMessage({
      data: userMessage({ text, transform, isStairs: false }),
    });
    const botMessageId = crypto.randomUUID();

    addMessage({
      data: botMessage({
        id: botMessageId,
        text: "",
        isStairs: false,
      }),
      setActive: true,
    });

    try {
      // init response message
      const response = await apiClient.api.chat.$post({
        json: {
          page_slug: pageSlug,
          message: text,
          history: getHistory(store),
          current_chunk: currentChunk,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat response");
      }
      let data = {} as { text: string; context?: string[] };

      if (response.body) {
        await parseEventStream(response.body, (d, done) => {
          if (!done) {
            try {
              data = JSON.parse(d) as typeof data;
              updateMessage({
                id: botMessageId,
                text: data.text,
                isStairs: false,
              });
            } catch (err) {
              console.log("invalid json", data);
            }
          } else {
            setActive({ id: null });
          }
        });

        updateMessage({
          id: botMessageId,
          isStairs: false,
          text: data.text,
          context: data.context,
        });

        const botTimestamp = Date.now();

        console.log("data is", data);
        execute({
          pageSlug,
          messages: [
            {
              text,
              is_user: true,
              timestamp: userTimestamp,
              is_stairs: false,
              transform,
            },
            {
              text: data.text,
              is_user: false,
              timestamp: botTimestamp,
              is_stairs: false,
              context: data.context,
              transform,
            },
          ],
        });
      } else {
        console.log("invalid response", response);
        throw new Error("invalid response");
      }
    } catch (err) {
      reportSentry("eval chat", { error: err, input: text, pageSlug });
      updateMessage({
        id: botMessageId,
        text: "Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
        isStairs: false,
      });
    }

    setPending(false);
  };

  useEffect(() => {
    if (isError) {
      reportSentry("create chat", { error });
    }
  }, [isError]);

  return { action, pending, isError, error };
};
