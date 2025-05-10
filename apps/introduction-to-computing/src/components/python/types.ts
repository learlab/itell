export type CellData = {
  code: string;
  mode?: CellMode;
};

export type CellStatus = "success" | "error" | undefined;
export type CellMode = "script" | "repl";
