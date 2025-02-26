"use client";

import { useEffect } from "react";
import { Elements } from "@itell/constants";
import { type Message } from "@itell/core/chat";
import { Card, CardHeader, CardTitle } from "@itell/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@itell/ui/carousel";
import { ScrollArea } from "@itell/ui/scroll-area";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence } from "motion/react";

import { useChatStore, usePage } from "@/components/provider/page-provider";
import { useAddChat } from "@/lib/hooks/use-add-chat";
import { SelectMessages } from "@/lib/store/chat-store";
import { scrollToLastChild } from "@/lib/utils";
import { ChatInput } from "./chat-input";
import { ChatItems } from "./chat-items";

type Props = {
  messages: Message[];
  updatedAt: Date;
  pageSlug: string;
};

export function ChatBody({ messages, updatedAt, pageSlug }: Props) {
  const store = useChatStore();
  const newMessages = useSelector(store, SelectMessages);

  useEffect(() => {
    scrollToLastChild(Elements.CHATBOT_CONTAINER);
  }, [newMessages]);

  const fresh = messages.length === 0 && newMessages.length == 0;

  return (
    <>
      <AnimatePresence initial={false}>
        {fresh ? (
          <div className="mb-4 space-y-2 px-4">
            <h3 className="text-center text-lg font-medium tracking-tight xl:text-xl">
              How can I help you today?
            </h3>
            <p className="text-sm text-muted-foreground">
              ITELL AI is a chatbot that can answer your questions regarding the
              textbook content.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-3 py-1">
            {/* NOTE: need the CHATBOT_CONTAINER wrapper so we can programatically scroll chat */}
            <div className="h-full" id={Elements.CHATBOT_CONTAINER}>
              <ChatItems
                data={newMessages}
                prevData={messages}
                updatedAt={updatedAt}
                pageSlug={pageSlug}
              />
            </div>
          </ScrollArea>
        )}
      </AnimatePresence>
      <ChatInput
        pageSlug={pageSlug}
        textareaProps={fresh ? { minRows: 3 } : {}}
      />
      {fresh && <ChunksCarousel />}
    </>
  );
}

function ChunksCarousel() {
  const { chunks, slug } = usePage();
  const { action: addChat } = useAddChat();
  return (
    <div className="mt-4 space-y-3 px-4">
      <p className="text-sm text-muted-foreground">💡 I am confused about</p>
      {chunks.length > 0 && (
        <Carousel>
          <CarouselContent className="-ml-2 md:-ml-4">
            {chunks.map((c) => (
              <CarouselItem
                key={c.slug}
                className="group pl-2 md:pl-4 lg:basis-1/2"
              >
                <button
                  className="block h-full w-full"
                  onClick={() => {
                    const text = `I am confused about the following chunk: <strong>${c.title}</strong>`;
                    addChat({
                      text,
                      pageSlug: slug,
                      transform: true,
                      currentChunk: c.slug,
                    });
                  }}
                >
                  <Card className="flex h-full items-center text-accent-foreground transition group-hover:bg-accent">
                    <CardHeader className="p-3">
                      <CardTitle className="lg:text-normal line-clamp-2 text-sm font-semibold">
                        {c.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
