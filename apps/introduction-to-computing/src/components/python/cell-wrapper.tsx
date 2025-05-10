"use client";

import { Alert } from "@itell/ui/alert";

import { usePython } from "@/lib/hooks/use-python";
import { Spinner } from "../spinner";
import { Cell } from "./cell";
import { CellMode } from "./types";

export const CellWrapper = ({
  code,
  mode,
}: {
  code: string;
  mode?: CellMode;
}) => {
  const { isLoading, isError } = usePython();

  return (
    <div className="cells-group bg-background mb-8 space-y-6">
      {isError ? (
        <Alert variant={"error"}>
          Failed to setup Python environment. Please maintain network connection
          and refresh the page.
        </Alert>
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border p-2">
          <Spinner className="size-4" />
          <p className="text-sm font-semibold">setting up python environment</p>
        </div>
      ) : (
        <Cell code={code} mode={mode} />
      )}
    </div>
  );
};
