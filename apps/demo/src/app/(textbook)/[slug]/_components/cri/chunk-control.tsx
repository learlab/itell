"use client";

import { useEffect, useRef } from "react";
import { usePortal } from "@itell/core/hooks";
import { PortalContainer } from "@itell/core/portal-container";
import { getChunkElement } from "@itell/utils";
import { LoginButton } from "@auth/auth-form";
import { useSelector } from "@xstate/store/react";

import { useChunks, useCRIStore } from "@/components/provider/page-provider";
import {
  SelectChunkStatus,
  SelectCurrentChunk,
  SelectShouldBlur,
} from "@/lib/store/cri-store";
import { ContinueChunkButton } from "./continue-chunk-button";
import { UnlockAssignmentsButton } from "./unlock-assignments-button";

type Props = {
  userId: string | null;
  pageSlug: string;
  condition: string;
  hasAssignments: boolean;
  hasQuiz: boolean;
};

// TODO: unify hasAssignments and hasQuiz
export function ChunkControl({
  userId,
  pageSlug,
  condition,
  hasAssignments,
  hasQuiz,
}: Props) {
  const store = useCRIStore();
  const currentChunk = useSelector(store, SelectCurrentChunk);
  const chunks = useChunks();
  const status = useSelector(store, SelectChunkStatus);
  const shouldBlur = useSelector(store, SelectShouldBlur);
  const prevChunkIdx = useRef(0);

  const { portals, addPortal, removePortal, removePortals } = usePortal();

  const portalIds = useRef<PortalIds>({} as PortalIds);

  const insertContinueButton = (el: HTMLElement, chunkSlug: string) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "continue-reading-button-container";
    if (!userId) {
      addPortal(<LoginButton />, buttonContainer);
      el.prepend(buttonContainer);
      return;
    }

    portalIds.current.continueReading = addPortal(
      <ContinueChunkButton
        chunkSlug={chunkSlug}
        pageSlug={pageSlug}
        condition={condition}
      />,
      buttonContainer
    );
    el.prepend(buttonContainer);
  };

  const insertUnlockAssignmentsButton = (
    el: HTMLElement,
    chunkSlug: string
  ) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "unlock-summary-button-container";
    portalIds.current.unlockSummary = addPortal(
      <UnlockAssignmentsButton
        pageSlug={pageSlug}
        chunkSlug={chunkSlug}
        condition={condition}
      />,
      buttonContainer
    );
    el.appendChild(buttonContainer);
  };

  // initial blur
  useEffect(() => {
    chunks.forEach((chunkSlug, chunkIndex) => {
      const el = getChunkElement(chunkSlug, "data-chunk-slug");
      if (!el) {
        return;
      }

      // blur chunks
      if (shouldBlur) {
        const currentIndex = chunks.indexOf(currentChunk);
        const isChunkUnvisited =
          currentIndex === -1 || chunkIndex > currentIndex;

        if (chunkIndex !== 0 && isChunkUnvisited) {
          el.classList.add("blurred");
        }
      }
    });

    // if (shouldBlur) {
    //   const lastChunk = chunks[chunks.length - 1];
    //   const lastChunkElement = getChunkElement(lastChunk, "data-chunk-slug");
    //   if (lastChunkElement) {
    //     insertScrollBackButton(lastChunkElement);
    //   }
    // }

    return () => {
      removePortals();
    };
  }, [chunks]);

  useEffect(() => {
    const currentChunkElement = getChunkElement(
      currentChunk,
      "data-chunk-slug"
    );
    if (!currentChunkElement) {
      return;
    }
    const isLastChunk = currentChunk === chunks[chunks.length - 1];

    const hasQuestion = status[currentChunk].hasQuestion;

    if (isLastChunk) {
      // removePortal(portalIds.current.scrollBack);
      if ((hasAssignments || hasQuiz) && !hasQuestion) {
        insertUnlockAssignmentsButton(currentChunkElement, currentChunk);
      }
    }

    if (shouldBlur) {
      const idx = chunks.indexOf(currentChunk);
      if (idx === -1) return;

      for (let i = prevChunkIdx.current; i < idx + 1; i++) {
        const chunk = chunks[i];
        const el = getChunkElement(chunk, "data-chunk-slug");
        if (el?.classList.contains("blurred")) {
          el.classList.remove("blurred");
        }
      }

      prevChunkIdx.current = idx;

      if (!hasQuestion) {
        const nextChunkSlug = chunks[idx + 1];
        const nextChunkElement = getChunkElement(
          nextChunkSlug,
          "data-chunk-slug"
        );
        console.log("next chunk slug");
        console.log("next chunk element");
        if (nextChunkElement) {
          insertContinueButton(nextChunkElement, currentChunk);
        }
      }
    }

    return () => {
      removePortal(portalIds.current.continueReading);
    };
  }, [currentChunk]);

  return <PortalContainer portals={portals} />;
}

type PortalIds = {
  scrollBack: string;
  continueReading: string;
  unlockSummary: string;
};
