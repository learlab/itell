import React from "react";
import { buttonVariants } from "@itell/ui/button";
import { Checkbox } from "@itell/ui/checkbox";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import MultipleSelector from "@itell/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { ScrollArea } from "@itell/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import { cn } from "@itell/utils";
import { z } from "zod";

import {
  questionDataMap,
  SurveyQuestion,
  SurveyQuestionData,
} from "@/lib/survey-question";
import { GridQuestion } from "./grid-question";
import { LexTaleQuestion } from "./lextale-question";

export type BaseQuestionProps<TQuestion> = {
  question: TQuestion;
  isAdmin?: boolean;
  defaultValue?: any;
};

export function StyledLabel({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <Label
      className={cn(
        buttonVariants({ size: "lg", variant: "ghost" }),
        `has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground h-fit
        justify-start py-3 pl-2 text-wrap xl:text-base`,
        className
      )}
      {...props}
    >
      {children}
    </Label>
  );
}

const parseSessionData = <T extends z.ZodType>(schema: T, data: any) => {
  const result = schema.safeParse(data);
  return result.success ? result.data : undefined;
};

// Question Components
function SingleChoiceQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "single_choice" }>>) {
  return (
    <RadioGroup
      name={question.id}
      required={question.required}
      className="text-foreground flex flex-col gap-1.5"
      defaultValue={defaultValue}
    >
      {question.options.map((option) => (
        <StyledLabel key={String(option.text)}>
          <RadioGroupItem value={String(option.text)} className="sr-only" />
          <span>{option.text}</span>
        </StyledLabel>
      ))}
    </RadioGroup>
  );
}
function SingleSelectQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "single_select" }>>) {
  return (
    <Select
      name={question.id}
      required={question.required}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-96">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[60vh]">
          {question.options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.text)}>
              {option.text}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}

function InputQuestion<
  T extends Extract<SurveyQuestion, { type: "number_input" | "text_input" }>,
>({
  question,
  defaultValue,
  type,
}: BaseQuestionProps<T> & { type: "number" | "text" }) {
  return (
    <Label>
      <span className="sr-only">{question.text}</span>
      <Input
        type={type}
        name={question.id}
        required={question.required}
        className="w-80"
        min={type === "number" ? 1 : undefined}
        placeholder="Enter your answer"
        defaultValue={defaultValue}
      />
    </Label>
  );
}

function MultipleChoiceQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "multiple_choice" }>>) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3">
      {question.options.map((option) => (
        <Label
          key={String(option.value)}
          className="flex items-center gap-2 xl:text-lg"
        >
          <Checkbox
            name={`${question.id}--${option.value}`}
            value={String(option.text)}
            defaultChecked={defaultValue?.includes(option.text)}
          />
          <span>{option.text}</span>
        </Label>
      ))}
    </div>
  );
}

function MultiSelectQuestion({
  question,
  defaultValue,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "multiple_select" }>>) {
  return (
    <MultipleSelector
      defaultOptions={question.options.map((option) => ({
        value: String(option.value),
        label: option.text,
      }))}
      placeholder="Select all that apply"
      badgeClassName="bg-secondary text-secondary-foreground lg:text-base hover:bg-primary/80 hover:text-primary-foreground"
      formInputName={question.id}
      value={defaultValue}
    />
  );
}

const componentMap = {
  single_choice: SingleChoiceQuestion,
  single_select: SingleSelectQuestion,
  multiple_choice: MultipleChoiceQuestion,
  multiple_select: MultiSelectQuestion,
  number_input: (props: any) => <InputQuestion {...props} type="number" />,
  text_input: (props: any) => <InputQuestion {...props} type="text" />,
  grid: GridQuestion,
  lextale: LexTaleQuestion,
} as const;

export function SurveyQuestionRenderer({
  question,
  sessionData,
  isAdmin = false,
}: {
  question: SurveyQuestion;
  sessionData?: SurveyQuestionData | null;
  isAdmin?: boolean;
}) {
  const Component = componentMap[question.type];
  const schema = questionDataMap[question.type];
  const defaultValue = parseSessionData(schema, sessionData);

  if (!Component) {
    console.warn(`Unsupported question type: ${question.type}`);
    return null;
  }

  return (
    <Component
      question={question}
      defaultValue={defaultValue}
      isAdmin={isAdmin}
    />
  );
}
