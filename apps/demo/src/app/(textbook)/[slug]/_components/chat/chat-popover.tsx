"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Elements } from "@itell/constants";
import { type Message } from "@itell/core/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { ScrollArea } from "@itell/ui/scroll-area";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { MessageCircleIcon } from "lucide-react";
import { motion } from "motion/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectOpen } from "@/lib/store/chat-store";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
  pageTitle: string;
  pageSlug: string;
  updatedAt: Date;
  data: Message[];
};

export function ChatPopover({ pageSlug, pageTitle, updatedAt, data }: Props) {
  const store = useChatStore();
  const isOpen = useSelector(store, SelectOpen);
  const [isCompact, setIsCompact] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const assignmentsRef = useRef<HTMLElement | null>(null);
  const expandedRectRef = useRef<DOMRect | null>(null);

  const checkOverlap = useCallback(() => {
    if (!triggerRef.current || !assignmentsRef.current || isOpen) return;

    if (!expandedRectRef.current && !isCompact) {
      expandedRectRef.current = triggerRef.current.getBoundingClientRect();
      return;
    }

    const rectA = assignmentsRef.current.getBoundingClientRect();
    const rectB =
      expandedRectRef.current ?? triggerRef.current.getBoundingClientRect();

    const hasOverlap = !(
      rectA.right < rectB.left ||
      rectA.left > rectB.right ||
      rectA.bottom < rectB.top ||
      rectA.top > rectB.bottom
    );

    setIsCompact(hasOverlap);
  }, [isCompact, isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollChat();
    }
  }, [isOpen]);

  useEffect(() => {
    const anchor = document.getElementById(Elements.PAGE_ASSIGNMENTS);
    if (anchor) {
      assignmentsRef.current = anchor;
      checkOverlap();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          checkOverlap();
          window.addEventListener("resize", checkOverlap);
          window.addEventListener("scroll", checkOverlap);
        } else {
          window.removeEventListener("resize", checkOverlap);
          window.removeEventListener("scroll", checkOverlap);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (anchor) {
      observer.observe(anchor);
    }

    return () => {
      window.removeEventListener("resize", checkOverlap);
      window.removeEventListener("scroll", checkOverlap);
      observer.disconnect();
    };
  }, [checkOverlap]);

  return (
    <motion.div
      layout
      className="fixed bottom-12 right-8 z-20 rounded-md bg-background text-foreground"
    >
      {isOpen ? (
        <div
          className="w-96 rounded-md border"
          id="chat-popover"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="itell-ai-description"
        >
          <ScrollArea
            className="flex flex-col px-3 py-4"
            style={{
              height: "clamp(300px, 55vh, 900px)",
            }}
          >
            <div className="h-full" id={Elements.CHATBOT_CONTAINER}>
              <ChatHeader />
              <ChatMessages
                className="px-2"
                updatedAt={updatedAt}
                data={data}
                pageTitle={pageTitle}
              />
            </div>
          </ScrollArea>
          <ChatInput pageSlug={pageSlug} className="px-2" />
          <footer className="mt-4 px-4 pb-2 text-xs text-muted-foreground">
            <p>This content has been AI-generated and may contain errors.</p>
          </footer>
        </div>
      ) : (
        <motion.button
          ref={triggerRef}
          aria-controls="chat-popover"
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={cn(
            "flex items-center justify-center gap-2 border-2",
            isCompact ? "rounded-full p-4" : "rounded-lg px-6 py-4"
          )}
          onClick={() => {
            store.send({ type: "setOpen", value: true });
          }}
        >
          <MessageCircleIcon className="size-6" />
          {!isCompact && <span>Ask AI</span>}
        </motion.button>
      )}
    </motion.div>
  );
}

function ChatHeader() {
  const store = useChatStore();
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-1.5 bg-background px-2 pb-3"
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
          store.send({ type: "setOpen", value: false });
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

export const scrollChat = (smooth: boolean = true) => {
  const el = document.getElementById(Elements.CHATBOT_CONTAINER);
  if (el) {
    const lastEl = el.lastChild as HTMLElement | undefined;
    if (!lastEl) {
      return el.scrollIntoView(false);
    }

    lastEl.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
      inline: "nearest",
    });
  }
};
