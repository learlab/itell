"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itell/ui/table";

import { AdminButton } from "@/components/admin-button";
import { BaseQuestionProps, SurveyQuestion } from "./survey-question-renderer";

export function GridQuestion({
  question,
  defaultValue,
  isAdmin,
}: BaseQuestionProps<Extract<SurveyQuestion, { type: "grid" }>>) {
  const finish = async () => {
    const firstCol = question.columns[0].value;
    question.rows.forEach((row) => {
      const input = document.querySelector(
        `input[name="${question.id}--${row.text}"][value="${firstCol}"]`
      ) as HTMLInputElement;
      if (input) {
        input.checked = true;
      }
    });
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <AdminButton type="button" onClick={finish}>
          Finish
        </AdminButton>
      )}
      <Table className="caption-top">
        <TableCaption className="mb-4 text-left">
          Please select an option for each row that best describes your feeling.
        </TableCaption>
        <TableHeader>
          <TableRow className="sticky top-0">
            <TableHead></TableHead>
            {question.columns.map((col) => (
              <TableHead key={String(col.value)}>
                <span className="font-semibold">{col.text}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {question.rows.map((row) => (
            <TableRow key={String(row.value)}>
              <TableCell className="w-80 text-left lg:text-base xl:text-lg">
                <legend>{row.text}</legend>
              </TableCell>
              {question.columns.map((col) => (
                <TableCell key={String(col.value)}>
                  <label className="block h-full w-full cursor-pointer">
                    <span className="sr-only">{col.text}</span>
                    <input
                      type="radio"
                      name={`${question.id}--${String(row.text)}`}
                      value={String(col.value)}
                      defaultChecked={
                        String(col.value) === defaultValue?.[String(row.text)]
                      }
                      className="peer sr-only"
                      required={true}
                    />
                    <span className="relative inline-block h-6 w-6 rounded-full border-2 border-gray-300 transition-colors duration-200 ease-in-out peer-checked:border-info peer-focus:ring-2 peer-focus:ring-info peer-focus:ring-offset-2">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3 w-3 rounded-full bg-info opacity-0 transition-opacity duration-200 ease-in-out peer-checked:opacity-100"></span>
                      </span>
                    </span>
                  </label>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
