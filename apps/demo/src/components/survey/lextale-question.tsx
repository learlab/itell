"use client";

import { useEffect, useState, useTransition } from "react";
import { buttonVariants } from "@itell/ui/button";
import { Card, CardContent } from "@itell/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@itell/ui/carousel";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { cn } from "@itell/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminButton } from "@/components/admin-button";
import { SurveyQuestion } from "@/lib/survey-question";
import { BaseQuestionProps } from "./survey-question-renderer";

export function LexTaleQuestion({
  question,
  defaultValue,
  isAdmin,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "lextale" }>>) {
  const words = question.options;
  const [, startTransition] = useTransition();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const currentWord = words[current];
  // only cares about if the word is visited, not the value
  const [checkedWords, setCheckedWords] = useState<Record<string, boolean>>(
    () =>
      defaultValue ? Object.fromEntries(words.map((word) => [word, true])) : {}
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("scroll", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, currentWord, checkedWords]);

  // disable arrow key movements
  useEffect(() => {
    function disableArrowKeys(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", disableArrowKeys);

    return () => window.removeEventListener("keydown", disableArrowKeys);
  }, []);

  const handleScrollNext = (e: MouseEvent) => {
    if (!(currentWord in checkedWords)) {
      e.preventDefault();
      return toast.info("Please indicate if the word is English or not.");
    }

    api?.scrollNext();
  };

  const finish = async () => {
    setCurrent(words.length);
    api?.scrollTo(words.length - 1);
    startTransition(() => {
      words.forEach((w) => {
        const input = document.querySelector(
          `input[name='${inputName(question.id, w)}'][value='no']`
        ) as HTMLInputElement;
        input.checked = true;
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isAdmin && (
        <AdminButton size={"lg"} type="button" onClick={finish}>
          Quick Fill
        </AdminButton>
      )}

      <span className="text-muted-foreground">
        {current + 1} / {words.length}
      </span>
      <Carousel
        setApi={setApi}
        // disable dragging
        opts={{ watchDrag: false, watchResize: false, watchSlides: false }}
        onKeyDown={(e) => e.preventDefault()}
      >
        <CarouselContent
          className="max-w-sm"
          onKeyDown={(e) => e.preventDefault()}
        >
          {words.map((word) => (
            <CarouselItem key={word}>
              <Card>
                <CardContent className="relative flex aspect-square flex-col items-center justify-center gap-4">
                  <span className="text-4xl font-extrabold">{word}</span>
                  <RadioGroup
                    name={inputName(question.id, word)}
                    required={true}
                    className="absolute bottom-4 flex items-center justify-between"
                    defaultValue={
                      defaultValue
                        ? defaultValue[word] === true
                          ? "yes"
                          : "no"
                        : undefined
                    }
                    onValueChange={() => {
                      setCheckedWords((prev) => ({ ...prev, [word]: true }));
                      api?.scrollNext();
                    }}
                  >
                    <Label
                      className={cn(
                        buttonVariants({ size: "lg", variant: "outline" }),
                        "h-fit p-4 has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground xl:text-base"
                      )}
                    >
                      <RadioGroupItem value={"yes"} className="sr-only" />
                      <CheckIcon className="size-6" />
                    </Label>

                    <Label
                      className={cn(
                        buttonVariants({ size: "lg", variant: "outline" }),
                        "h-fit p-4 has-[:checked]:bg-primary/85 has-[:checked]:text-primary-foreground xl:text-base"
                      )}
                    >
                      <RadioGroupItem value={"no"} className="sr-only" />
                      <XIcon className="size-6" />
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious type="button" />

        {currentWord in checkedWords && (
          // @ts-expect-error event type
          <CarouselNext type="button" onClick={handleScrollNext} />
        )}
      </Carousel>
    </div>
  );
}

function inputName(questionId: string, word: string) {
  return `${questionId}--${word}`;
}
