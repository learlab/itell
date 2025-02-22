"use client";

import { useState, useRef, useEffect } from "react";
import { useActionStatus } from "use-action-status";
import { apiClient } from "@/lib/api-client";
import { borderColors, QuestionScore, StatusStairs } from "@textbook/cri/types"
import { Alert, AlertTitle } from "@itell/ui/alert";
import { BanIcon, PencilIcon, KeyRoundIcon, ChevronLast, ListRestart } from "lucide-react";
import { StatusButton } from "@itell/ui/status-button";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import { cn } from "@itell/utils";
import { useDebounce } from "@itell/core/hooks";
import { toast } from "sonner";
import { CRIShell } from "@textbook/cri/cri-shell";
import { Button } from "@itell/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import Link from "next/link";
import { routes } from "@/lib/navigation";
import { buttonVariants } from "@itell/ui/button";
import { createEventAction } from "@/actions/event";
import { EventType } from "@/lib/constants";

type State = {
  status: StatusStairs;
  error: string | null;
  input: string;
};

export interface QuizMeObject {
  pageSlug: string;
  slug: string;
  question: string;
  answer: string;
}

export default function QuizMeBox({
    quizmeList,
  }: {
    quizmeList: QuizMeObject[];
  }) {

    const [correctlyAnswered, setCorrectlyAnswered] = useState<number[]>([]);
    const [semiCorrectlyAnswered, setSemiCorrectlyAnswered] = useState<number[]>([]);
    const [incorrectlyAnswered, setIncorrectlyAnswered] = useState<number[]>([]);
    const [failed, setFailed] = useState<Boolean>(false);
    
    const [unanswered, setUnanswered] = useState<number[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [streak, setStreak] = useState<number>(0);
    const [qatext, setQatext] = useState<string>("");

    // Function to update the state and select a new question based on the score
    const handleScore = (score: number, input: string) => {
        // Handle status change based on score
        if (score === 2) {
            setState({
                status: StatusStairs.BOTH_CORRECT,
                error: null,
                input,
            });
            setCorrectlyAnswered((prev) => [...prev, currentQuestionIndex]);
            setStreak((prev) => prev + 1);
        } else if (score === 1) {
            setState({
                status: StatusStairs.SEMI_CORRECT,
                error: null,
                input,
            });
            setSemiCorrectlyAnswered((prev) => [...prev, currentQuestionIndex]);
            setStreak((prev) => prev + 1);
        } else if (score === 0) {
            setState({
                status: StatusStairs.BOTH_INCORRECT,
                error: null,
                input,
            });
            if (streak > 0) {
            toast.info("You have ended with a streak of " + streak + "🔥");
            };
            
            setIncorrectlyAnswered((prev) => [...prev, currentQuestionIndex]);
            setFailed(true);
        }

        setUnanswered((prev) => prev.filter((index) => index !== currentQuestionIndex));
    };

    const createQuizMeEvent = async () => {
        await createEventAction({
            type: EventType.QUIZME,
            pageSlug: "quizme-page",
            data: {
              "correctly-answered": correctlyAnswered,
              "semi-correctly-answered": semiCorrectlyAnswered,
              "streak": streak,
            },
          });
    }

    // Function to handle selecting and removing a random unanswered question
    const handleNextQuestion = () => {
        setState((state) => ({
            status: StatusStairs.UNANSWERED,
            error: null,
            input: "",     
        }));

        console.log(currentQuestionIndex);

        if (unanswered.length > 0) {
            const randomIndex = Math.floor(Math.random() * unanswered.length);
            const selectedQuestionIndex = unanswered[randomIndex];
            
            setCurrentQuestionIndex(selectedQuestionIndex);
            setQatext(quizmeList[selectedQuestionIndex].question);
            console.log(currentQuestionIndex);

            // Remove the selected question from unanswered
            setUnanswered((prev) => prev.filter((_, i) => i !== randomIndex));
        } else if (unanswered.length === 0) {
            toast.success("You have completed all the questions! 🎉");
        }

        console.log(unanswered);
        console.log(currentQuestionIndex); 
        
    };

    // Initialize unanswered questions
    useEffect(() => {
    const initialUnanswered = quizmeList.map((_, index) => index);
    setUnanswered(initialUnanswered);
    }, []);

    useEffect(() => {
        if (unanswered.length > 0 && currentQuestionIndex === 0) {
          handleNextQuestion();
        }
      }, [unanswered]);

    
    useEffect(() => {
    // To stop from running twice (strict mode?)
    if (failed) {
        createQuizMeEvent();
    }
    }, [failed]);

    const form = useRef<HTMLFormElement>(null);

    // Ensure there are questions to choose from
    if (quizmeList.length === 0) {
        return <div>No questions available.</div>;
    }

    const qa = quizmeList[currentQuestionIndex];

    const chunkSlug = qa.slug;
    const pageSlug = qa.pageSlug;

    const {
        action: onSubmit,
        isPending: _isPending,
        error,
    } = useActionStatus(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const input = String(formData.get("input")).trim();

        if (input.length === 0) {
        setState((state) => ({ ...state, error: "Answer cannot be empty" }));
        return;
        }

        if (input === state.input) {
        setState((state) => ({
            ...state,
            error: "Please submit a different answer",
        }));
        return;
        }

        const res = await apiClient.api.cri.$post({
        json: {
            page_slug: pageSlug,
            chunk_slug: chunkSlug,
            answer: input,
        },
        });
        if (!res.ok) {
        const { details, error } = await res.json();
        throw new Error(error, { cause: details });
        }
        const response = await res.json();
        const score = response.score as QuestionScore;

        handleScore(score, input);
        
    });


    const isPending = useDebounce(_isPending, 100);

    const [state, setState] = useState<State>({
        status: StatusStairs.UNANSWERED,
        error: null,
        input: "",
    });

    const status = state.status;

    const borderColor = borderColors[state.status];


    return (
        
        <>
            <CRIShell
            className={cn(borderColor,
            {
                shake: state.status === StatusStairs.BOTH_INCORRECT
            },
            )}
            >
                <div className="m-8 p-8">
                { streak > 0 && (status !== StatusStairs.BOTH_INCORRECT) ? (
                    <div className="absolute top-2 right-8 p-4 flex items-center">
                        <img src="/images/flame.gif" alt="Flame" />
                        <span className="text-orange-300 font-semibold"> {streak}</span>
                    </div>
                ) : (null) }
                {(status === StatusStairs.BOTH_CORRECT || status === StatusStairs.SEMI_CORRECT) ? (
                    <>
                        <div className="success-checkmark">
                            <div className="check-icon">
                            <span className="icon-line line-tip"></span>
                            <span className="icon-line line-long"></span>
                            <div className="icon-circle"></div>
                            <div className="icon-fix"></div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-3 pt-4">
                            <StatusButton
                                pending={isPending}
                                disabled={_isPending}
                                variant="outline"
                                className="min-w-40"
                                onClick={handleNextQuestion}
                            >
                                <span className="flex items-center gap-2">
                                <ChevronLast className="size-4" />
                                    Next Question
                                </span>
                            </StatusButton>
                        </div>
                    </>
                ) : status === StatusStairs.BOTH_INCORRECT ? (
                    <>
                        <div className="error-xmark">
                            <div className="x-icon mb-5 p-2">
                                <span className="icon-line line-left"></span>
                                <span className="icon-line line-right"></span>
                                <div className="icon-circle"></div>
                            </div>
                        </div>
                        <div className="mt-3 mb-3 pt-2 pb-2">
                            <p></p>
                        </div>
                        <div className="flex justify-center items-center space-x-8mt-3 pt-4">
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                <Button variant="link" type="button" className="gap-2">
                                    <KeyRoundIcon className="size-4" />
                                    Show Answer
                                </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                <p className="no-select leading-relaxed">{qa.answer}</p>
                                </HoverCardContent>
                            </HoverCard>

                            <Link
                                className={buttonVariants()}
                                href={routes.textbook({ slug: pageSlug })}
                            >
                                Go to Page
                            </Link>

                            <Button variant="link" type="button" className="gap-2" onClick={() => window.location.reload()}>
                                <ListRestart className="size-4" />
                                Try Again
                            </Button>
                        </div>
                    </>

                ) : (
                    <div className="default-content">

                        <div className="mt-4 mb-6">
                            <p><span className="font-bold">Question: </span></p>
                            <p>{qatext}</p>
                        </div>

                        <form
                            ref={form}
                            aria-labelledby="form-question-heading"
                            onSubmit={onSubmit}
                            className="flex flex-col gap-4"
                            >
                            <Label className="font-normal">
                                <span className="sr-only">your answer</span>
                                <TextArea
                                name="input"
                                rows={3}
                                className="rounded-md p-4 shadow-md xl:text-lg"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.shiftKey) {
                                    e.preventDefault();
                                    return;
                                    }
                
                                    if (e.key === "Enter") {
                                    e.preventDefault();
                                    form.current?.requestSubmit();
                                    }
                                }}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    toast.warning(
                                        "Copy & Paste is disallowed, please answer with your own words."
                                    );
                                }}
                                />
                            </Label>
                
                            <div className="flex flex-col items-center gap-2 sm:flex-row">
                                <StatusButton
                                    pending={isPending}
                                    type="submit"
                                    disabled={_isPending}
                                    variant="outline"
                                    className="min-w-40"
                                >
                                    <span className="flex items-center gap-2">
                                    <PencilIcon className="size-4" />
                                        Answer
                                    </span>
                                </StatusButton>
                            </div>

                            {state.error ? (
                                <Alert variant={"error"}>
                                <BanIcon />
                                <AlertTitle>{state.error}</AlertTitle>
                                </Alert>
                            ) : null}
                        </form>

                    </div>
                )}

                <style jsx>{`/* Styles for the checkmark */
/* Styles for the checkmark */
.success-checkmark {
  width: 80px;
  height: 115px;
  margin: 20px auto;
}

.success-checkmark .check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #4CAF50;
}

.success-checkmark .check-icon .icon-line {
  height: 5px;
  background-color: #4CAF50;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.success-checkmark .check-icon .line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.success-checkmark .check-icon .line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.success-checkmark .check-icon .icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(76, 175, 80, 0.5);
}

.success-checkmark .check-icon .icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: #FFFFFF;
}

/* X mark styles (you already have this section) */
.error-xmark {
    width: 80px;
    height: 80px;
    margin: 20px auto;
}

.error-xmark .x-icon {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 4px solid #FF0000; /* Red border for X mark */
}

.error-xmark .x-icon .icon-line {
    height: 5px;
    background-color: #FF0000; /* Red for X lines */
    display: block;
    border-radius: 2px;
    position: absolute;
    z-index: 10;
}

.error-xmark .x-icon .line-left {
    top: 50%;
    left: 50%;
    width: 0;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(45deg);
    animation: x-icon-line-left 0.75s forwards;
}

.error-xmark .x-icon .line-right {
    top: 50%;
    left: 50%;
    width: 0;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(-45deg);
    animation: x-icon-line-right 0.75s forwards;
}

/* Remove the extra circle */
.error-xmark .x-icon .icon-circle {
    display: none;
}

@keyframes x-icon-line-left {
    0% {
        width: 0;
    }
    100% {
        width: 60px;
    }
}

@keyframes x-icon-line-right {
    0% {
        width: 0;
    }
    100% {
        width: 60px;
    }
}

/* Animations */
@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

@keyframes icon-line-left {
  0% {
    width: 0;
    left: 14px;
  }
  50% {
    width: 25px;
    left: 14px;
  }
  100% {
    width: 50px;
    left: 14px;
  }
}

@keyframes icon-line-right {
  0% {
    width: 0;
    left: 14px;
  }
  50% {
    width: 25px;
    left: 14px;
  }
  100% {
    width: 50px;
    left: 14px;
  }
}
}`}</style>

            </div>
        </CRIShell>
    </>
  );
};