"use client";

import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { MoveDownIcon } from "lucide-react";
import { motion } from "motion/react";

import { createEventAction } from "@/actions/event";
import { useCRIStore } from "@/components/provider/page-provider";
import { buttonAnimationProps } from "@/lib/animations";
import { EventType } from "@/lib/constants";
import { SelectChunkStatus } from "@/lib/store/cri-store";
import type { Button } from "@itell/ui/button";

interface Props extends React.ComponentPropsWithRef<typeof Button> {
  chunkSlug: string;
  pageSlug: string;
  condition: string;
}

export function ContinueChunkButton({ chunkSlug, pageSlug, condition }: Props) {
  const store = useCRIStore();
  const status = useSelector(store, SelectChunkStatus);
  const disabled = status[chunkSlug].hasQuestion && !status[chunkSlug].status;

  const onSubmit = async () => {
    store.send({ type: "advanceChunk", chunkSlug });

    await createEventAction({
      type: EventType.CHUNK_REVEAL,
      pageSlug,
      data: {
        chunkSlug,
        condition,
      },
    });
  };

  return (
    <motion.button
      {...buttonAnimationProps}
      className={cn(
        "relative w-56 rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
        buttonVariants({ variant: "default" })
      )}
      data-no-event
      onClick={onSubmit}
      disabled={disabled}
    >
      <span
        className="relative flex h-full w-full items-center justify-center gap-2 uppercase tracking-wide"
        style={{
          maskImage:
            "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
        }}
      >
        <MoveDownIcon className="size-4" />
        Continue Reading
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
      />
    </motion.button>
  );
}
