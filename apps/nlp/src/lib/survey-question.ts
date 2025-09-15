import { cache } from "react";
import { Survey, surveys } from "#content";
import { z } from "zod";

import { SurveySection } from "@/lib/survey-data";

// Schema definitions
export const questionDataMap = {
  single_choice: z.string(),
  single_select: z.string(),
  number_input: z.union([z.string(), z.number()]),
  text_input: z.string(),
  multiple_choice: z.array(z.string()),
  multiple_select: z.array(z.object({ label: z.string(), value: z.string() })),
  grid: z.record(z.string()),
  lextale: z.record(z.boolean()),
} as const;

//  Object.values(questionDataMap) yields type error
export const SurveyQuestionDataSchema = z.union([
  questionDataMap.single_choice,
  questionDataMap.single_select,
  questionDataMap.number_input,
  questionDataMap.text_input,
  questionDataMap.multiple_choice,
  questionDataMap.multiple_select,
  questionDataMap.grid,
  questionDataMap.lextale,
]);
export type SurveyQuestionData = z.infer<typeof SurveyQuestionDataSchema>;
export type SurveySubmission = Record<string, SurveyQuestionData>;
export type SurveyQuestion = Survey["sections"][0]["questions"][0];

export const getSurvey = cache((surveyId: string) => {
  return surveys.find((survey) => survey.survey_id === surveyId);
});

export const getSurveySection = ({
  surveyId,
  sectionId,
}: {
  surveyId: string;
  sectionId: string;
}) => {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return null;
  }

  const section = survey.sections.find((section) => section.id === sectionId);
  return section;
};

export const getNextSectionId = ({
  sections,
  submission,
}: {
  // unfinished sections
  sections: SurveySection[];
  submission: SurveySubmission;
}) => {
  return (
    sections.find((section) => isSectionApplicable({ section, submission }))
      ?.id ?? null
  );
};

type Condition = NonNullable<SurveySection["display_rules"]>["conditions"][0];

export const isSectionApplicable = ({
  section,
  submission,
}: {
  section: SurveySection;
  submission: SurveySubmission;
}) => {
  if (!section.display_rules) {
    return true;
  }
  let ok = false;
  switch (section.display_rules.operator) {
    case "or":
      ok = section.display_rules.conditions.some((condition) =>
        matchCondition({ submission, condition })
      );
      break;
    case "and":
      ok = section.display_rules.conditions.every((condition) =>
        matchCondition({ submission, condition })
      );
      break;
    default:
      ok = false;
  }

  return ok;
};

// if user submission matches a single condition
const matchCondition = ({
  submission,
  condition,
}: {
  submission: SurveySubmission;
  condition: Condition;
}) => {
  if (!(condition.question_id in submission)) {
    return false;
  }

  const qdata = submission[condition.question_id];
  // NOTE: for now, only supports question data of type string or number
  // this means you can only set conditions for single choice, text input, numebr input
  if (typeof qdata == "string" || typeof qdata == "number") {
    switch (condition.operator) {
      case "eq":
        return qdata == condition.value;
      case "ne":
        return qdata != condition.value;
      default:
        return false;
    }
  }

  return false;
};

export const getPreviousSection = ({
  surveyId,
  sectionId,
}: {
  surveyId: string;
  sectionId: string;
}) => {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return null;
  }
  const sectionIndex = survey.sections.findIndex(
    (section) => section.id === sectionId
  );

  if (sectionIndex > 0) {
    return survey.sections[sectionIndex - 1];
  }

  return null;
};
