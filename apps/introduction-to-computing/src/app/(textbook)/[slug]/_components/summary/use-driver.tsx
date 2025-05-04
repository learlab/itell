"use client";

import { JSX, RefObject, useCallback, useEffect, useMemo } from "react";
import { Elements } from "@itell/constants";
import { usePortal } from "@itell/core/hooks";
import { SummaryResponse } from "@itell/core/summary";
import { driver, removeInert, setInertBackground } from "@itell/driver.js";
import { ChatStairs } from "@textbook/chat-stairs";

import { createEventAction } from "@/actions/event";
import { Condition, EventType } from "@/lib/constants";
import { StairsQuestion } from "@/lib/store/summary-store";
import { scrollToElement } from "@/lib/utils";
import { SummaryFeedbackDetails } from "./summary-feedback";

type BaseConfig = {
  pageSlug: string;
  exitButton: ({ onClick }: { onClick: (time: number) => void }) => JSX.Element;
};

type StairsConfig = BaseConfig & {
  condition: typeof Condition.STAIRS;
  summaryResponse: RefObject<SummaryResponse | null>;
  stairsData: RefObject<StairsQuestion | null>;
  stairsAnswered: RefObject<boolean>;
};

type RandomRereadConfig = BaseConfig & {
  condition: typeof Condition.RANDOM_REREAD;
  randomChunkSlug: string;
};
type Config = StairsConfig | RandomRereadConfig;

function isStairs(config: Config): config is StairsConfig {
  return config.condition === Condition.STAIRS;
}

const useDriver = (config: Config) => {
  const driverObj = useMemo(() => driver(), []);
  const { addPortal, removePortals, portals } = usePortal();
  const isStairsConfig = isStairs(config);

  const highlight = useCallback(
    (element: HTMLElement) => {
      driverObj.highlight({
        element,
        popover: {
          description: "",
          side: "right",
          align: "start",
        },
      });
      setTimeout(() => {
        scrollToElement(element, { offset: -120 });
      }, 100);
    },
    [driverObj]
  );

  useEffect(() => {
    driverObj.setConfig({
      animate: false,
      smoothScroll: false,
      allowClose: false,
      onHighlightStarted: (element) => {
        if (element) {
          element.setAttribute("tabIndex", "0");
          element.setAttribute("id", Elements.STAIRS_HIGHLIGHTED_CHUNK);

          const link = document.createElement("a");
          link.href = `#${Elements.STAIRS_RETURN_BUTTON}`;
          link.textContent = "go to the finish reading button";
          link.className = "sr-only";
          link.id = Elements.STAIRS_ANSWER_LINK;
          element.insertAdjacentElement("afterend", link);
        }
      },
      onHighlighted: () => {
        if (isStairsConfig) {
          if (config.stairsData.current?.chunk) {
            setInertBackground(config.stairsData.current.chunk);
          }
        } else {
          setInertBackground(config.randomChunkSlug);
        }

        const chunk = document.getElementById(
          Elements.STAIRS_HIGHLIGHTED_CHUNK
        );
        if (isStairsConfig && chunk && config.summaryResponse.current) {
          // const reactElements = htmr(chunk.innerHTML);
          // createRoot(chunk).render(
          //   <AnimatedText
          //     wpm={STAIRS_TEXT_ANIMATION_WPM}
          //     start_delay={STAIRS_TEXT_ANIMATION_DELAY}
          //   >
          //     {reactElements}
          //   </AnimatedText>
          // );

          const feedback = document.createElement("div");
          feedback.id = Elements.STAIRS_FEEDBACK_CONTAINER;
          addPortal(
            <SummaryFeedbackDetails
              response={config.summaryResponse.current}
            />,
            feedback
          );
          chunk.prepend(feedback);
        }
      },
      onPopoverRender: (popover) => {
        if (isStairsConfig) {
          addPortal(
            <ChatStairs
              id={Elements.STAIRS_CONTAINER}
              pageSlug={config.pageSlug}
              footer={
                <config.exitButton
                  onClick={(time) => {
                    if (!config.stairsAnswered.current) {
                      config.stairsAnswered.current = true;
                      driverObj.destroy();
                      createEventAction({
                        type: Condition.STAIRS,
                        pageSlug: config.pageSlug,
                        data: {
                          stairs: config.stairsData.current,
                          time,
                        },
                      });
                    }
                  }}
                />
              }
            />,
            popover.wrapper
          );
        } else {
          addPortal(
            <config.exitButton
              onClick={(time) => {
                driverObj.destroy();
                createEventAction({
                  type: EventType.RANDOM_REREAD,
                  pageSlug: config.pageSlug,
                  data: { chunkSlug: config.randomChunkSlug, time },
                });
              }}
            />,
            popover.wrapper
          );
        }

        setTimeout(() => {
          document.getElementById(Elements.STAIRS_CONTAINER)?.focus();
        }, 100);
      },
      onDestroyed: (element) => {
        removeInert();
        removePortals();
        document.getElementById(Elements.STAIRS_FEEDBACK_CONTAINER)?.remove();

        if (element) {
          element.removeAttribute("tabIndex");
          element.removeAttribute("id");
          document.getElementById(Elements.STAIRS_ANSWER_LINK)?.remove();
        }

        // reserve some time for rendering
        setTimeout(() => {
          scrollToElement(Elements.PAGE_ASSIGNMENTS);
        }, 100);

        document.getElementById(Elements.SUMMARY_INPUT)?.focus();
      },
    });
  }, [addPortal, config, isStairsConfig, removePortals, driverObj]);

  return { portals, highlight };
};

export default useDriver;
