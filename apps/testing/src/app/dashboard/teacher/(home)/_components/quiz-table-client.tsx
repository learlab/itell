"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@itell/ui/dialog";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { ScrollArea } from "@itell/ui/scroll-area";
import { cn } from "@itell/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Page } from "#content";
import { CircleIcon } from "lucide-react";

import { QuizColumns } from "./quiz-table";
import { StudentsTable } from "./students-table";
import { ColumnWithSorting } from "./table-utils";

export function QuizTableClient({
  data,
  quizPages,
}: {
  data: QuizColumns[];
  quizPages: Page[];
}) {
  const columns: ColumnDef<QuizColumns>[] = [
    {
      id: "Name",
      accessorKey: "name",
      header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
    },
    {
      id: "Total",
      accessorKey: "total",
      header: ({ column }) => ColumnWithSorting({ column, text: column.id }),
    },
    ...quizPages.map((page) => ({
      id: page.slug,
      accessorKey: page.slug,
      header: ({ column }: { column: any }) => (
        <ColumnWithSorting
          column={column}
          text={page.title}
          className="h-fit"
        />
      ),
      cell: ({ row }: { row: any }) => {
        const count = row.original[page.slug].correctCount;
        if (count === undefined || count === -1) {
          return (
            <div className="flex items-center justify-center">
              <CircleIcon className="text-muted-foreground" />
            </div>
          );
        }
        const pageData = row.original[page.slug].data;
        return (
          <Dialog>
            <DialogTrigger className="hover:underline">
              {count} / {page.quiz?.length}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{row.original.name}</DialogTitle>
                <DialogDescription>
                  Quiz submission for{" "}
                  <span className="font-medium">{page.title}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="bg-warning size-4 rounded-full" />
                  Student&apos;s choice
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-4 rounded-full bg-green-400" />
                  Correct answer
                </div>
                <div className="ml-auto">
                  <p>
                    <span className="text-green-400">{count}</span> /{" "}
                    <span>{page.quiz?.length}</span>
                  </p>
                </div>
              </div>

              <ScrollArea className="max-h-[60vh]">
                <form className="grid gap-4">
                  {page.quiz?.map(({ question, answers }, qIndex) => (
                    <div key={question} className="grid gap-3">
                      <RadioGroup
                        name={question}
                        required
                        className="gap-3"
                        value={pageData[qIndex]}
                      >
                        <h4 className="text-lg font-medium">{question}</h4>
                        {answers.map(({ answer, correct }, aIndex) => (
                          <div
                            key={String(answer)}
                            className={cn("flex items-center gap-3", {
                              "text-warning": answer === pageData[qIndex],
                              "text-green-500": correct,
                            })}
                          >
                            <RadioGroupItem
                              value={answer}
                              id={`${qIndex}-${aIndex}`}
                            />
                            <Label
                              htmlFor={`${qIndex}-${aIndex}`}
                              className="font-normal lg:text-base"
                            >
                              {answer}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        );
      },
    })),
  ];

  return (
    <StudentsTable
      columns={columns}
      data={data}
      caption="Showing accuracy ratios (correct/total) for each student in quiz, sorted by total quizzes taken"
      filename="Quiz Stats"
    />
  );
}
