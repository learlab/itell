"use client";

import { HTMLAttributes, useRef, useState } from "react";
import { Elements } from "@itell/constants";
import { Button } from "@itell/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { cn, parseEventStream } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { ArrowUpIcon } from "lucide-react";
import TextArea from "react-textarea-autosize";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { createChatsAction } from "@/actions/chat";
import { InternalError } from "@/components/internal-error";
import {
  useChatStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { apiClient } from "@/lib/api-client";
import { isProduction } from "@/lib/constants";
import {
  botMessage,
  SelectStairsAnswered,
  SelectStairsMessages,
  SelectStairsQuestion,
  SelectStairsTimestamp,
  userMessage,
} from "@/lib/store/chat-store";
import { SelectInput } from "@/lib/store/summary-store";
import { reportSentry } from "@/lib/utils";
import type { ChatHistory } from "@itell/core/chat";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  pageSlug: string;
}

export function ChatInputStairs({ className, pageSlug }: ChatInputProps) {
  const summaryStore = useSummaryStore();
  const summary = useSelector(summaryStore, SelectInput);

  const chatStore = useChatStore();
  const { addMessage, updateMessage, setActive, setStairsAnswered } =
    chatStore.trigger;
  const messages = useSelector(chatStore, SelectStairsMessages);
  const stairsQuestion = useSelector(chatStore, SelectStairsQuestion);
  const stairsAnswered = useSelector(chatStore, SelectStairsAnswered);
  const stairsTimestamp = useSelector(chatStore, SelectStairsTimestamp);

  const [pending, setPending] = useState(false);

  const { isError, execute } = useServerAction(createChatsAction);
  const overMessageLimit = messages.length > 6;
  const answered = useRef(false);
  const history = useRef<ChatHistory>([
    {
      agent: "bot",
      text: String(stairsQuestion?.text),
    },
  ]);

  const onMessage = async (text: string) => {
    setPending(true);
    const userTimestamp = Date.now();

    // append the stairs question to normal chat as well
    addMessage({
      data: botMessage({
        text: stairsQuestion?.text ?? "",
        isStairs: false,
      }),
    });

    // add user message to stairs array
    addMessage({
      data: userMessage({
        text,
        isStairs: true,
      }),
    });

    addMessage({
      data: userMessage({
        text,
        isStairs: false,
      }),
    });

    if (!stairsAnswered) {
      setStairsAnswered({
        value: true,
      });
    }

    // init response message
    const botMessageId = crypto.randomUUID();
    addMessage({
      data: botMessage({
        id: botMessageId,
        text: "",
        isStairs: true,
      }),
      setActive: true,
    });

    try {
      const response = await apiClient.api.chat.stairs.$post({
        json: {
          page_slug: pageSlug,
          message: text,
          history: history.current,
          current_chunk: stairsQuestion?.chunk ?? "",
          summary,
        },
      });
      setActive({ id: null });

      let data = {} as { text: string; context?: string[] };
      if (response.ok && response.body) {
        await parseEventStream(response.body, (d, done) => {
          if (!done) {
            try {
              data = JSON.parse(d) as typeof data;
              updateMessage({
                id: botMessageId,
                text: data.text,
                isStairs: true,
              });
            } catch (err) {
              console.log("invalid json", data);
            }
          }
        });

        const context = data.context;
        updateMessage({
          id: botMessageId,
          isStairs: true,
          text: data.text,
          context,
        });

        const botTimestamp = Date.now();
        // also add the final bot message to the normal chat
        addMessage({
          data: botMessage({
            text: data.text,
            isStairs: false,
            context,
          }),
        });
        history.current.push(
          {
            agent: "user",
            text,
          },
          {
            agent: "bot",
            text: data.text,
          }
        );

        if (history.current.length === 3) {
          const el = document.getElementById(Elements.STAIRS_RETURN_BUTTON);
          if (el) {
            el.focus();
          }
        }

        if (!answered.current) {
          execute({
            pageSlug,
            messages: [
              {
                text: String(stairsQuestion?.text),
                is_user: false,
                timestamp: Number(stairsTimestamp),
                is_stairs: true,
                stairs_data: {
                  chunk: String(stairsQuestion?.chunk),
                  question_type: String(stairsQuestion?.question_type),
                },
              },
              {
                text,
                is_user: true,
                timestamp: userTimestamp,
                is_stairs: true,
              },
              {
                text: data.text,
                is_user: false,
                timestamp: botTimestamp,
                is_stairs: true,
                context,
              },
            ],
          });
        } else {
          answered.current = true;
          execute({
            pageSlug,
            messages: [
              {
                text,
                is_user: true,
                timestamp: userTimestamp,
                is_stairs: true,
              },
              {
                text: data.text,
                is_user: false,
                timestamp: botTimestamp,
                is_stairs: true,
                context,
              },
            ],
          });
        }
      } else {
        console.log("invalid response", response);
        throw new Error("invalid response");
      }
    } catch (err) {
      reportSentry("eval chat stairs", {
        error: err,
        input: text,
        pageSlug,
      });
      updateMessage({
        id: botMessageId,
        text: "Sorry, I'm having trouble connecting to ITELL AI, please try again later.",
        isStairs: false,
      });
    }

    setPending(false);
  };

  return (
    <div className={cn("grid gap-2 px-2", className)}>
      <form
        className="border-input bg-background focus-within:ring-ring/10 relative flex items-center
          rounded-lg border px-3 py-1.5 pr-8 text-sm focus-within:ring-2
          focus-within:ring-offset-0 focus-within:outline-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          if (!e.currentTarget.input.value) return;

          onMessage(e.currentTarget.input.value);
          e.currentTarget.input.value = "";
        }}
      >
        {overMessageLimit ? (
          <p>Please return to the summary</p>
        ) : (
          <>
            <TextArea
              name="input"
              rows={2}
              maxRows={4}
              disabled={pending || overMessageLimit}
              placeholder={
                overMessageLimit
                  ? "Please return to the summary"
                  : "Answer the question"
              }
              className="placeholder:text-muted-foreground flex-1 resize-none bg-transparent
                focus:outline-hidden"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!e.currentTarget.value) return;
                  onMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              onPaste={(e) => {
                if (isProduction) {
                  e.preventDefault();
                  toast.warning("Copy & Paste is not allowed");
                }
              }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size="sm"
                  className="absolute right-1 bottom-1 size-6 rounded-full"
                >
                  <ArrowUpIcon size={16} className="shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={12}>Submit</TooltipContent>
            </Tooltip>
          </>
        )}
      </form>
      {isError ? (
        <InternalError className="px-2">
          <p>Failed to save chat</p>
        </InternalError>
      ) : null}
    </div>
  );
}
