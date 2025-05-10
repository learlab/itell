import React from "react";
import Children from "react-children-utilities";

import { CellWrapper } from "./cell-wrapper";
import { CellMode } from "./types";

type Props =
  | { code: string; mode?: CellMode }
  | { children: React.ReactNode; mode?: CellMode }
  | undefined;

export function Sandbox(props: Props) {
  let mode: CellMode = "script";
  let code = "";
  if (props) {
    mode = props.mode || "script";
    if ("code" in props) {
      // append a new line if not present
      code = props.code.endsWith("\n") ? props.code : `${props.code}\n`;
    } else if ("children" in props) {
      code = Children.onlyText(props.children);
    }
  }

  return (
    <div className="sandbox">
      <CellWrapper code={code} mode={mode} />
    </div>
  );
}
