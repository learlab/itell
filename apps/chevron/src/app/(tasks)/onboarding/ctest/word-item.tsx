import React, { useRef, useState } from "react";
import { Input } from "@itell/ui/input";
import { cn } from "@itell/utils";

interface Props {
  word: string;
  showLetter: number;
  isTarget?: boolean;
  className?: string;
  showAnswer?: boolean;
}

export function WordItem({
  word,
  showLetter,
  className,
  isTarget = false,
  showAnswer = false,
}: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);

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

  const handlePrev = async (currentIndex: number, clearPrev: boolean = false) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      if (clearPrev && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex].value = "";
      }
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
              if (clearPrev){
                input.value = "";
              }
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

  const handleClick = () => {
    if (showAnswer) {
      setIsRevealed(true);
    }
  };

  if (isRevealed) {
    return (
      <span className="word-item inline-block whitespace-nowrap py-0.5">
        <span className="text-green-600 font-medium px-1">{word}</span>
      </span>
    );
  }

  return (
    <span 
      className={cn(
        "word-item inline-block whitespace-nowrap py-0.5",
        showAnswer && "cursor-pointer hover:opacity-80"
      )}
      onClick={handleClick}
    >
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
            onPrev={(clearPrev) => handlePrev(index, clearPrev)}
            letterIndex={showLetter + index}
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
  onPrev?: (clearPrev?: boolean) => void;
  letterIndex: number;
}

function LetterInput({
  letter,
  onNext,
  onPrev,
  ref,
  className,
  letterIndex,
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
      if (value === "") {
        onPrev?.(true);
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
      data-letter-index={letterIndex}
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
