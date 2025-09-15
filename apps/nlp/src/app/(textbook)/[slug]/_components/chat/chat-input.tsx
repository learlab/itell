"use client";

import { Button } from "@itell/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { ArrowUpIcon } from "lucide-react";
import { motion } from "motion/react";
import TextArea from "react-textarea-autosize";
import { toast } from "sonner";

import { InternalError } from "@/components/internal-error";
import { isProduction } from "@/lib/constants";
import { useAddChat } from "@/lib/hooks/use-add-chat";

interface ChatInputProps {
  pageSlug: string;
  className?: string;
  textareaProps?: React.ComponentPropsWithRef<typeof TextArea>;
}

export function ChatInput({
  className,
  pageSlug,
  textareaProps,
}: ChatInputProps) {
  const { action, pending, isError } = useAddChat();

  function createMessage(input: string) {
    if (input === "") return toast.warning("Please enter a message");
    action({ text: input, pageSlug });
  }

  return (
    <motion.div
      layout
      className={cn("grid gap-2 px-2", className)}
      transition={{
        type: "spring",
        visualDuration: 0.2,
        bounce: 0.2,
      }}
    >
      <form
        className="border-input bg-background focus-within:ring-ring/10 relative flex items-center
          rounded-lg border px-3 py-1.5 pr-8 text-sm focus-within:ring-2
          focus-within:ring-offset-0 focus-within:outline-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.input.value.trim();
          createMessage(input);
          e.currentTarget.input.value = "";
        }}
      >
        <TextArea
          name="input"
          required
          autoFocus
          disabled={pending}
          placeholder="Enter a message"
          className="placeholder:text-muted-foreground flex-1 resize-none bg-transparent
            focus:outline-hidden"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const input = e.currentTarget.value.trim();
              createMessage(input);
              e.currentTarget.value = "";
            }
          }}
          onPaste={(e) => {
            if (isProduction) {
              e.preventDefault();
              toast.warning("Copy & Paste is not allowed");
            }
          }}
          {...textareaProps}
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
      </form>
      {isError ? <InternalError>Failed to save chat</InternalError> : null}
    </motion.div>
  );
}
