"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { keymap } from "@codemirror/view";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { debounce } from "es-toolkit";
import {
  HelpCircleIcon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import useDriver from "use-driver";

import { createEventAction } from "@/actions/event";
import { EventType } from "@/lib/constants";
import { usePython } from "@/lib/hooks/use-python";
import { usePage } from "../provider/page-provider";
import { Spinner } from "../spinner";
import { baseExtensions, PythonResult } from "./editor-config";
import { CellData, CellMode, CellStatus } from "./types";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <p className="flex items-center gap-2">
      <Spinner />
      Loading code editor
    </p>
  ),
});

// io and contextlib is imported as setup code in providers
const codeWithStd = (code: string) => {
  const lines = code.split("\n");
  const indentedCode = lines.map((line) => `\t${line}`).join("\n");
  const output = `
with contextlib.redirect_stdout(io.StringIO()) as f:
${indentedCode}
	s = f.getvalue()
s
`;

  return output.trim();
};

// eslint-disable-next-line react/display-name
export const Cell = memo(({ code, mode = "script" }: CellData) => {
  const runCodeKeymap = keymap.of([
    {
      key: "Ctrl-Enter",
      preventDefault: true,
      stopPropagation: true,
      run: () => {
        runCode();
        return true;
      },
    },
  ]);

  const extensions = [...baseExtensions, runCodeKeymap];

  const { drive, register } = useDriver();

  const [input, setInput] = useState(code);
  const [cellMode] = useState<CellMode>(mode);
  const [result, setResult] = useState<PythonResult | null>(null);
  const [status, setStatus] = useState<CellStatus>(undefined);
  const { theme } = useTheme();
  const [isCellRunning, setIsCellRunning] = useState(false);
  const { runPython, isRunning } = usePython();
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const { slug } = usePage();

  const runCode = async () => {
    setIsCellRunning(true);
    setResult(null);
    const result = await runPython(
      cellMode === "script" ? codeWithStd(input) : input
    );

    createEvent();

    if (result.error) {
      setStatus("error");
    } else {
      setStatus("success");
    }
    setIsCellRunning(false);
    setResult(result);
  };

  const codeRef = useRef(code);
  useEffect(() => {
    codeRef.current = input;
  }, [input]);

  const createEvent = useMemo(() => {
    const func = () => {
      createEventAction({
        pageSlug: slug,
        type: EventType.RUNCODE,
        data: {
          code: codeRef.current,
        },
      });
    };

    return debounce(func, 1000);
  }, [slug]);

  const reset = () => {
    setInput(code);
    setStatus(undefined);
    setResult(null);
    if (editorRef.current) {
      editorRef.current.view?.focus();
    }
  };

  const help = () => {
    if (!drive) {
      return toast.warning(
        "Usage help is initializing, Please try again later."
      );
    }

    drive();
  };

  // const cancel = async () => {
  // 	// do not use interrupt buffer as it requires strict domain policy
  // 	await interruptExecution();
  // 	setIsCellRunning(false);
  // };

  return (
    <div
      className={cn("cell group border shadow-md", {
        "border-info": status === "success",
        "border-destructive": status === "error",
        "animate-border-color": isCellRunning,
      })}
    >
      <div className="px-2">
        <header className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            disabled={isRunning}
            onClick={async () => {
              if (!isRunning) {
                await runCode();
              }
            }}
            {...register({
              order: 2,
              popover: {
                title: "Run Code",
                description:
                  "Click on this button to run the code, you can also use the Ctrl+Enter keyboard shortcut.",
              },
            })}
          >
            {isRunning ? (
              <SquareIcon className="mr-2 h-4 w-4" />
            ) : (
              <PlayIcon className="mr-2 h-4 w-4" />
            )}
            <span>Run</span>
          </Button>
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={reset}
            {...register({
              order: 3,
              popover: {
                title: "Reset Code",
                description:
                  "Click on this button to reset your code in the editor.",
              },
            })}
          >
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button size={"sm"} variant={"ghost"} onClick={help}>
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            <span>Help</span>
          </Button>
        </header>
        <div>
          <div
            className="relative"
            {...register({
              order: 1,
              popover: {
                title: "Code Editor",
                description: "This is where you write Python code.",
              },
            })}
          >
            <CodeMirror
              value={input}
              onChange={setInput}
              extensions={extensions}
              theme={theme === "light" ? githubLight : githubDark}
              basicSetup={{
                lineNumbers: true,
              }}
              ref={editorRef}
            />
          </div>

          {result && (
            <div
              className="lg:text-normal relative mt-2 rounded-md border p-4 font-mono text-sm
                whitespace-break-spaces shadow-md xl:text-lg"
            >
              <Badge
                className="absolute top-0 right-0 -translate-y-1/2"
                variant={"outline"}
              >
                Output
              </Badge>
              {result?.output && result.output !== "undefined" && (
                <div>{result.output}</div>
              )}
              {result?.error && (
                <div className="text-red-500">{result.error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
