"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Elements } from "@itell/constants";
import { type Message } from "@itell/core/chat";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { MessageCircleIcon } from "lucide-react";
import { motion } from "motion/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectOpen } from "@/lib/store/chat-store";
import { scrollToLastChild } from "@/lib/utils";
import { ChatBody } from "./chat-body";
import { ChatWrapper } from "./chat-wrapper";

type Props = {
  pageSlug: string;
  updatedAt: Date;
  messages: Message[];
};

export function ChatPopover({ pageSlug, updatedAt, messages }: Props) {
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
      scrollToLastChild(Elements.CHATBOT_CONTAINER);
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
      className="bg-background text-foreground fixed right-8 bottom-12 z-20 rounded-md"
    >
      {isOpen ? (
        <ChatWrapper hasPrev={messages.length > 0}>
          <ChatBody
            updatedAt={updatedAt}
            messages={messages}
            pageSlug={pageSlug}
          />
        </ChatWrapper>
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
            store.trigger.setOpen({ value: true });
          }}
        >
          <MessageCircleIcon className="size-6" />
          {!isCompact && <span>Ask AI</span>}
        </motion.button>
      )}
    </motion.div>
  );
}
