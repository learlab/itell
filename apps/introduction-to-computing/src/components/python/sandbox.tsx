import React from "react";
import Children from "react-children-utilities";

import { CellGroup } from "./cell-group";
import { CellMode } from "./types";
import { getCellCodes } from "./utils";

type Props =
  | { code: string; mode?: CellMode }
  | { children: React.ReactNode; mode?: CellMode }
  | undefined;

export function Sandbox(props: Props) {
  let codes = [""];
  let mode: CellMode = "script";
  if (props) {
    mode = props.mode || "script";
    let code = "";
    if ("code" in props) {
      // append a new line if not present
      code = props.code.endsWith("\n") ? props.code : `${props.code}\n`;
    } else if ("children" in props) {
      code = Children.onlyText(props.children);
    }
    codes = getCellCodes(code);
  }

  return (
    <div className="sandbox">
      <CellGroup codes={codes} mode={mode} />
    </div>
  );
}
