"use client";

import { Button } from "@itell/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { ArrowUpIcon } from "lucide-react";
import TextArea from "react-textarea-autosize";
import { toast } from "sonner";

import { InternalError } from "@/components/internal-error";
import { isProduction } from "@/lib/constants";
import { useAddChat } from "@/lib/hooks/use-add-chat";
import type { HTMLAttributes } from "react";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  pageSlug: string;
}

export function ChatInput({ className, pageSlug, ...props }: ChatInputProps) {
  const { action, pending, isError } = useAddChat();

  return (
    <div {...props} className={cn("grid gap-2", className)}>
      <form
        className="relative flex items-center rounded-lg border border-input bg-background px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/10 focus-within:ring-offset-0"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.input.value.trim();
          if (input === "") return;
          action({ text: input, pageSlug });
          e.currentTarget.input.value = "";
        }}
      >
        <TextArea
          name="input"
          autoFocus
          disabled={pending}
          placeholder="Enter a message"
          className="flex-1 resize-none bg-transparent placeholder:text-muted-foreground focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const input = e.currentTarget.value.trim();
              action({ text: input, pageSlug });
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
              className="absolute bottom-1 right-1 size-6 rounded-full"
            >
              <ArrowUpIcon size={16} className="shrink-0" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>Submit</TooltipContent>
        </Tooltip>
      </form>
      {isError ? <InternalError>Failed to save chat</InternalError> : null}
    </div>
  );
}
