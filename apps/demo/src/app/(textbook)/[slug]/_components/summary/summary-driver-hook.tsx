import { JSX, RefObject, useEffect, useRef } from 'react';
import { scrollToElement } from "@/lib/utils";
import { ChatStairs } from "@textbook/chat-stairs";
import { removeInert, setInertBackground } from "@itell/driver.js";
import { Elements } from '@itell/constants';
import { Driver } from '@itell/driver.js';
import {
  SummaryFeedbackDetails,
} from "./summary-feedback";
import { Condition, EventType } from '@/lib/constants';
import { StairsQuestion } from '@/lib/store/summary-store';
import { SummaryResponse } from '@itell/core/summary';


const useDriverConfig = ({ 
  driverObj,
  pageSlug, 
  randomChunkSlug, 
  addPortal,
  removePortals,
  stairsDataRef, 
  summaryResponseRef, 
  stairsAnsweredRef, 
  createEventAction,
  FinishReadingButton
}: {
  driverObj: Driver,
  pageSlug: string,
  randomChunkSlug: string | null,
  addPortal: (children: React.ReactNode, container: Element) => string,
  removePortals: () => void,
  stairsDataRef: RefObject<StairsQuestion | null>,
  summaryResponseRef: RefObject<SummaryResponse | null>,
  stairsAnsweredRef: RefObject<boolean | null>,
  createEventAction: ({type, pageSlug, data}: {
    type: string,
    pageSlug: string,
    data: { chunkSlug: string, time: number } | { stairs: StairsQuestion | null, time: number }
    }) => void,
  FinishReadingButton: ({ onClick }: { onClick: (time: number) => void }) => JSX.Element,
}) => {
  const portalId = useRef<string | null>(null);
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
        if (randomChunkSlug) {
          setInertBackground(randomChunkSlug);
        }
        if (stairsDataRef?.current?.chunk) {
          setInertBackground(stairsDataRef.current.chunk);
        }

        const chunk = document.getElementById(Elements.STAIRS_HIGHLIGHTED_CHUNK);
        if (summaryResponseRef.current && chunk) {
          const node = document.createElement("div");
          node.id = Elements.STAIRS_FEEDBACK_CONTAINER;
          addPortal(<SummaryFeedbackDetails response={summaryResponseRef.current} />, node);
          chunk.prepend(node);
        }
      },
      onPopoverRender: (popover) => {
        if (randomChunkSlug) {
          portalId.current = addPortal(
            <FinishReadingButton
              onClick={(time) => {
                driverObj.destroy();
                createEventAction({
                  type: EventType.RANDOM_REREAD,
                  pageSlug,
                  data: { chunkSlug: randomChunkSlug, time },
                });
              }}
            />,
            popover.wrapper
          );
        } else {
          addPortal(
            <ChatStairs
              id={Elements.STAIRS_CONTAINER}
              pageSlug={pageSlug}
              footer={
                <FinishReadingButton
                  onClick={(time) => {
                    if (!stairsAnsweredRef.current) {
                      stairsAnsweredRef.current = true;
                      createEventAction({
                        type: Condition.STAIRS,
                        pageSlug,
                        data: {
                          stairs: stairsDataRef.current,
                          time,
                        },
                      });
                    }
                    driverObj.destroy();
                  }}
                />
              }
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

        const assignments = document.getElementById(Elements.PAGE_ASSIGNMENTS);
        if (assignments) {
          setTimeout(() => {
            scrollToElement(assignments);
          }, 100);
        }

        document.getElementById(Elements.SUMMARY_INPUT)?.focus();
      },
    });
  }, [addPortal, pageSlug, randomChunkSlug, removePortals, stairsDataRef, summaryResponseRef, stairsAnsweredRef, createEventAction, FinishReadingButton, driverObj]);
};

export default useDriverConfig;
