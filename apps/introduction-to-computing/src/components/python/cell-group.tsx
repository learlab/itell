"use client";

import { useCallback, useState } from "react";
import { Alert } from "@itell/ui/alert";

import { usePython } from "@/lib/hooks/use-python";
import { Spinner } from "../spinner";
import { Cell } from "./cell";
import { CellMode } from "./types";

export const CellGroup = ({
  codes,
  mode,
}: {
  codes: string[];
  mode?: CellMode;
}) => {
  const cellsData = codes.map((code) => ({
    code,
    deletable: false,
    id: crypto.randomUUID(),
  }));
  const [cells, setCells] = useState(() => cellsData);

  const addCell = useCallback(() => {
    setCells((cells) => [
      ...cells,
      { code: "", deletable: true, id: crypto.randomUUID() },
    ]);
  }, []);

  const deleteCell = useCallback((id: string) => {
    setCells((cells) => cells.filter((cell) => cell.id !== id));
  }, []);

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
        cells.map((cell) => (
          <Cell
            {...cell}
            addCell={addCell}
            deleteCell={deleteCell}
            key={cell.id}
            mode={mode}
          />
        ))
      )}
    </div>
  );
};
