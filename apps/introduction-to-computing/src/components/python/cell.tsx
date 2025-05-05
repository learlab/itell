"use client";

import { memo, useRef, useState } from "react";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import { cn } from "@itell/utils";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  HelpCircleIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import useDriver from "use-driver";

import { usePython } from "@/lib/hooks/use-python";
import { baseExtensions, createShortcuts, PythonResult } from "./editor-config";
import { CellData, CellMode, CellStatus } from "./types";

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
export const Cell = memo(
  ({ id, deleteCell, deletable, code, addCell, mode = "script" }: CellData) => {
    const extensions = [
      ...baseExtensions,
      createShortcuts([
        {
          key: "Shift-Enter",
          run: () => {
            run();
            return true;
          },
          preventDefault: true,
        },
      ]),
    ];

    const { drive, register } = useDriver();

    const [input, setInput] = useState(code);
    const [cellMode, setCellMode] = useState<CellMode>(mode);
    const [result, setResult] = useState<PythonResult | null>(null);
    const [status, setStatus] = useState<CellStatus>(undefined);
    const { theme } = useTheme();
    const [isCellRunning, setIsCellRunning] = useState(false);
    const { runPython, isRunning } = usePython();
    const editorRef = useRef<ReactCodeMirrorRef>(null);

    const run = async () => {
      setIsCellRunning(true);
      setResult(null);
      const result = await runPython(
        cellMode === "script" ? codeWithStd(input) : input
      );
      if (result.error) {
        setStatus("error");
      } else {
        setStatus("success");
      }
      setIsCellRunning(false);
      setResult(result);
    };

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
                  await run();
                }
              }}
              {...register({
                order: 2,
                popover: {
                  title: "Run Code",
                  description:
                    "Click on this button to run your code in the editor",
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
                    "Click on this button to reset your code in the editor",
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
                  description: "This is where you write Python code",
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
              {/* <div */}
              {/*   className="absolute top-2 right-2 z-10" */}
              {/*   {...register({ */}
              {/*     order: 4, */}
              {/*     popover: { */}
              {/*       title: "Switch Editor Mode", */}
              {/*       description: */}
              {/*         "Switch between Script and REPL mode. In the REPL mode, the output of the last expression is displayed. In the Script mode, all output needs to be printed using the print function.", */}
              {/*     }, */}
              {/*   })} */}
              {/* > */}
              {/*   <Select */}
              {/*     value={cellMode} */}
              {/*     onValueChange={(val) => setCellMode(val as CellMode)} */}
              {/*   > */}
              {/*     <SelectTrigger className="w-[90px]"> */}
              {/*       <SelectValue placeholder="Mode" /> */}
              {/*     </SelectTrigger> */}
              {/*     <SelectContent> */}
              {/*       <SelectItem value="script">Script</SelectItem> */}
              {/*       <SelectItem value="repl">REPL</SelectItem> */}
              {/*     </SelectContent> */}
              {/*   </Select> */}
              {/* </div> */}
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
        <div className="add-cell flex h-3 flex-col items-center self-center">
          <div
            className="add-cell-buttons flex-column flex gap-2 opacity-0 transition-opacity
              duration-100 ease-linear group-hover:opacity-100"
          >
            <Button size={"sm"} variant={"outline"} onClick={addCell}>
              <PlusIcon className="h-4 w-4" />
            </Button>
            {deletable && (
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => deleteCell(id)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
