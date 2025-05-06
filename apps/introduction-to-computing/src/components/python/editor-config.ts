import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { EditorView, KeyBinding, keymap } from "@codemirror/view";

export type PythonResult = {
  output: string | null;
  error: string | null;
};

export const BaseEditorTheme = EditorView.baseTheme({
  "&": {
    padding: "8px",
    height: "auto",
  },
  ".cm-gutters": {
    lineHeight: "2rem",
  },
  ".cm-content": {
    fontFamily: "Fira Code, monospace",
    fontSize: "16px",
    lineHeight: "2rem",
  },
});

export const createShortcuts = (keybindings: readonly KeyBinding[]) => {
  return keymap.of(keybindings);
};

export const baseExtensions = [
  python(),
  BaseEditorTheme,
  indentUnit.of("    "),
];
