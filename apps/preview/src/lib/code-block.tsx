"use client";
import { JSX, useLayoutEffect, useState } from "react";
import { highlight } from "./code-block-shared";

export function CodeBlockPython({
  initial,
  code,
}: {
  initial?: JSX.Element;
  code: string;
}) {
  const [nodes, setNodes] = useState(initial);

  useLayoutEffect(() => {
    highlight(code, "python").then(setNodes);
  }, []);

  return nodes ?? <p>Loading Python code...</p>;
}
