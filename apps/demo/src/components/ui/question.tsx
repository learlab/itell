"use client";

import { CRIReread } from "@textbook/cri/cri-reread";
import { CRISimple } from "@textbook/cri/cri-simple";
import { CRIStairs } from "@textbook/cri/cri-stairs";
import { useSelector } from "@xstate/store/react";

import { Condition } from "@/lib/constants";
import { useCondition, useCRIStore } from "../provider/page-provider";

type Props = {
  question: string;
  answer: string;
  chunkSlug: string;
  pageSlug: string;
};

export function Question({ question, answer, chunkSlug, pageSlug }: Props) {
  const store = useCRIStore();
  const condition = useCondition();
  const chunkStatus = useSelector(
    store,
    (store) => store.context.chunkStatus[chunkSlug]
  );

  if (!chunkStatus.hasQuestion) return null;

  return (
    <div className="question-container my-6">
      {condition === Condition.STAIRS && (
        <CRIStairs
          question={question}
          answer={answer}
          chunkSlug={chunkSlug}
          pageSlug={pageSlug}
        />
      )}
      {condition === Condition.RANDOM_REREAD && (
        <CRIReread
          question={question}
          answer={answer}
          chunkSlug={chunkSlug}
          pageSlug={pageSlug}
        />
      )}
      {condition === Condition.SIMPLE && (
        <CRISimple
          question={question}
          answer={answer}
          chunkSlug={chunkSlug}
          pageSlug={pageSlug}
        />
      )}
    </div>
  );
}
