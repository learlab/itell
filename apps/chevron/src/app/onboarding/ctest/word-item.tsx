import React, { useRef, useState } from "react";
import { Input } from "@itell/ui/input";
import { cn } from "@itell/utils";

interface Props {
  word: string;
  showLetter: number;
  isTarget?: boolean;
  className?: string;
}

export function WordItem({
  word,
  showLetter,
  className,
  isTarget = false,
}: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isTarget) {
    return <span className="py-0.5">{word}</span>;
  }

  const letters = word.split("");

  const revealedLetters = letters.slice(0, showLetter);
  const hiddenLetters = letters.slice(showLetter);
  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleNext = async (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < hiddenLetters.length) {
      focusInput(nextIndex);
    }

    if (nextIndex === hiddenLetters.length) {
      // get the outer span wrapper
      let parent =
        inputRefs.current[currentIndex]?.parentElement?.parentElement;
      if (parent) {
        while (parent?.nextElementSibling) {
          const nextSibling = parent.nextElementSibling as HTMLElement;
          if (nextSibling?.classList.contains("word-item")) {
            const input = nextSibling.querySelector(
              "input[data-is-target='true']"
            ) as HTMLInputElement;
            if (input) {
              input.focus();
              break;
            }
          }
          parent = nextSibling;
        }
      }
    }
  };

  const handlePrev = async (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      focusInput(prevIndex);
    } else if (currentIndex === 0) {
      let parent =
        inputRefs.current[currentIndex]?.parentElement?.parentElement;
      if (parent) {
        while (parent?.previousElementSibling) {
          const prevSibling = parent.previousElementSibling as HTMLElement;
          if (prevSibling?.classList.contains("word-item")) {
            const input = prevSibling.querySelector(
              "input[data-is-target='true']:last-of-type"
            ) as HTMLInputElement;
            if (input) {
              input.focus();
              break;
            }
          }
          parent = prevSibling;
        }
      }
    }
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <span className="word-item inline-block whitespace-nowrap py-0.5">
      <fieldset
        data-target-word={word}
        className={cn(
          "inline-flex items-center px-1 transition-opacity duration-300",
          className
        )}
      >
        {revealedLetters.map((letter, index) => (
          <Letter
            key={index}
            letter={letter}
            className="rounded-none px-1 py-1 first-of-type:rounded-l-md focus-visible:ring-1"
          />
        ))}

        {hiddenLetters.map((letter, index) => (
          <LetterInput
            className="rounded-none px-1 py-1 last-of-type:rounded-r-lg focus-visible:ring-1"
            letter={letter}
            key={index}
            ref={setInputRef(index)}
            onNext={() => handleNext(index)}
            onPrev={() => handlePrev(index)}
          />
        ))}
      </fieldset>
    </span>
  );
}

interface LetterProps {
  letter: string;
  className?: string;
}

function Letter({ letter, className }: LetterProps) {
  return (
    <Input
      className={cn(
        "size-7 bg-muted text-center text-base text-muted-foreground xl:text-lg",
        className
      )}
      type="text"
      defaultValue={letter}
      data-is-target={false}
      readOnly
    />
  );
}

interface LetterInputProps {
  letter: string;
  className?: string;
  ref: (_: HTMLInputElement) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

function LetterInput({
  letter,
  onNext,
  onPrev,
  ref,
  className,
}: LetterInputProps) {
  const [, setIsCorrect] = useState<boolean | undefined>(undefined);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "ArrowLeft") {
      e.preventDefault();
      onPrev?.();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext?.();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      const value = e.currentTarget.value;
      e.currentTarget.value = "";
      if (value === "") {
        onPrev?.();
      } else {
        e.currentTarget.value = "";
        setIsCorrect(undefined);
      }
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setIsCorrect(undefined);
      return;
    }
    setIsCorrect(newValue === letter);
    onNext?.();
  };

  return (
    <Input
      required
      data-is-target={true}
      ref={ref}
      type="text"
      maxLength={1}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={cn(
        "size-7 border bg-background text-center text-base focus-visible:border-2 focus-visible:border-info xl:text-lg",
        className
      )}
    />
  );
}
