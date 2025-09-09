"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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
  pageStatus: { unlocked: boolean };
};

// TODO: unify hasAssignments and hasQuiz
export function ChunkControl({
  userId,
  pageSlug,
  condition,
  hasAssignments,
  hasQuiz,
  pageStatus,
}: Props) {
  const store = useCRIStore();
  const currentChunk = useSelector(store, SelectCurrentChunk);
  const chunks = useChunks();
  const status = useSelector(store, SelectChunkStatus);
  const shouldBlur = useSelector(store, SelectShouldBlur);
  const prevChunkIdx = useRef(0);
  const isInitialized = useRef(false);

  const { portals, addPortal, removePortal, removePortals } = usePortal();

  const portalIds = useRef<PortalIds>({} as PortalIds);

  // Clean up all continue buttons from DOM and portals
  const cleanupAllContinueButtons = () => {
    // Remove all continue button containers from DOM
    const allButtonContainers = document.querySelectorAll(
      ".continue-reading-button-container"
    );
    allButtonContainers.forEach((container) => container.remove());

    // Clear portal reference
    if (portalIds.current.continueReading) {
      removePortal(portalIds.current.continueReading);
      portalIds.current.continueReading = "";
    }
  };

  // Calculate which chunks should be blurred
  const calculateBlurState = () => {
    const blurStates: Record<string, boolean> = {};
    // If page is unlocked, no chunks should be blurred
    if (shouldBlur && !pageStatus.unlocked) {
      const currentIndex = chunks.indexOf(currentChunk);
      chunks.forEach((chunkSlug, chunkIndex) => {
        const isChunkUnvisited =
          currentIndex === -1 || chunkIndex > currentIndex;
        blurStates[chunkSlug] = chunkIndex !== 0 && isChunkUnvisited;
      });
    }
    return blurStates;
  };

  const insertContinueButton = (el: HTMLElement, chunkSlug: string) => {
    // Always clean up ALL continue buttons first
    cleanupAllContinueButtons();

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

  // Synchronous initial blur setup using useLayoutEffect to prevent flash
  useLayoutEffect(() => {
    const blurStates = calculateBlurState();

    chunks.forEach((chunkSlug) => {
      const el = getChunkElement(chunkSlug, "data-chunk-slug");
      if (!el) return;

      // Remove any existing blur classes first to ensure clean state
      el.classList.remove("blurred");

      // Apply blur if needed
      if (blurStates[chunkSlug]) {
        el.classList.add("blurred");
      }
    });

    isInitialized.current = true;

    return () => {
      removePortals();
    };
  }, [chunks, shouldBlur, currentChunk]);

  useEffect(() => {
    const currentChunkElement = getChunkElement(
      currentChunk,
      "data-chunk-slug"
    );
    if (!currentChunkElement) {
      return;
    }
    const isLastChunk = currentChunk === chunks[chunks.length - 1];

    const hasQuestion = status[currentChunk]?.hasQuestion;

    if (isLastChunk) {
      if ((hasAssignments || hasQuiz) && !hasQuestion) {
        insertUnlockAssignmentsButton(currentChunkElement, currentChunk);
      }
    }

    if (shouldBlur) {
      const idx = chunks.indexOf(currentChunk);
      if (idx === -1) return;

      // Unblur chunks up to current
      for (let i = prevChunkIdx.current; i < idx + 1; i++) {
        const chunk = chunks[i];
        const el = getChunkElement(chunk, "data-chunk-slug");
        if (el?.classList.contains("blurred")) {
          el.classList.remove("blurred");
        }
      }

      prevChunkIdx.current = idx;

      // Simple logic: if current chunk has no CRI and there's a next chunk, add continue button
      if (!hasQuestion && idx + 1 < chunks.length) {
        const nextChunkSlug = chunks[idx + 1];
        const nextChunkElement = getChunkElement(
          nextChunkSlug,
          "data-chunk-slug"
        );

        if (nextChunkElement) {
          insertContinueButton(nextChunkElement, currentChunk);
        }
      } else {
        // Current chunk has CRI or is last chunk - remove any continue buttons
        cleanupAllContinueButtons();
      }
    }

    return () => {
      removePortal(portalIds.current.continueReading);
    };
  }, [currentChunk, status]);

  return <PortalContainer portals={portals} />;
}

type PortalIds = {
  scrollBack: string;
  continueReading: string;
  unlockSummary: string;
};
