"use client";

import React from "react";
import { cn } from "@itell/utils";
import { motion } from "motion/react";

import { Spinner } from "@/components/spinner";
import { type StageItem } from "@/lib/hooks/use-summary-stage";
import type { ComponentProps } from "react";

type Props = {
  items: StageItem[];
};

export function SummaryProgress({ items }: Props) {
  return (
    <div className="my-4 flex h-full items-center justify-center rounded">
      {items.map((item, index) => (
        <div
          className="flex w-[calc((100%-2.5rem)/4)] flex-col justify-center gap-1"
          key={item.name}
        >
          <div className="flex items-center">
            <motion.div animate={item.status} className="relative">
              {item.status === "active" && (
                <div className="absolute -right-1 top-3.5 z-20">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500" />
                  </span>
                </div>
              )}

              <motion.div
                variants={{
                  active: {
                    scale: 1,
                    transition: {
                      delay: 0,
                      duration: 0.2,
                    },
                  },
                  complete: {
                    scale: 1.1,
                  },
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  type: "tween",
                  ease: "circOut",
                }}
                className="absolute inset-0 rounded-full bg-blue-200"
              />

              <motion.div
                initial={false}
                variants={{
                  inactive: {
                    backgroundColor: "#fff", // neutral
                    borderColor: "#e5e5e5", // neutral-200
                    color: "#a3a3a3", // neutral-400
                  },
                  active: {
                    backgroundColor: "#fff",
                    borderColor: "#3b82f6",
                    color: "#3b82f6", // blue-500
                  },
                  complete: {
                    backgroundColor: "#3b82f6", // blue-500
                    borderColor: "#3b82f6", // blue-500
                    color: "#3b82f6", // blue-500
                  },
                }}
                transition={{ duration: 0.2 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold"
              >
                <div className={cn("flex items-center justify-center", {})}>
                  {item.status === "complete" ? (
                    <CheckIcon className={cn("size-6 text-white")} />
                  ) : (
                    <div className="relative">{index + 1}</div>
                  )}
                </div>
              </motion.div>

              {/* Conditionally render line after item except for the last one */}
            </motion.div>
            {index < items.length - 1 && (
              <div className="w-full bg-gray-300">
                <motion.div
                  className="h-0.5 w-full bg-gray-300"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: "100%",
                    opacity: 1,
                    backgroundColor:
                      item.status === "complete"
                        ? "#3b82f6"
                        : item.status === "active"
                          ? "#e5e5e5"
                          : "transparent",
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
          {item.status !== "inactive" && (
            <div className="flex items-center gap-2 text-sm font-light leading-tight duration-500 animate-in fade-in">
              {item.name}
              {item.status === "active" && <Spinner className="size-4" />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <title>checkbox</title>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
