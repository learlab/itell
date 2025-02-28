import plugin from "tailwindcss/plugin";
import { DefaultTheme, UserThemeSchema, themeConfig } from "./theme.js";
import { extractCssVariables } from "./utils.js";

let rootColors = extractCssVariables(DefaultTheme.root);
let darkColors = extractCssVariables(DefaultTheme.dark);

export const AppPlugin = plugin(({ addBase, config }) => {
  const userTheme = UserThemeSchema.safeParse(config("itell.theme"));
  if (userTheme.success) {
    if (userTheme.data.root) {
      rootColors = {
        ...rootColors,
        ...extractCssVariables(userTheme.data.root),
      };
    }
    if (userTheme.data.dark) {
      darkColors = {
        ...darkColors,
        ...extractCssVariables(userTheme.data.dark),
      };
    }
  } else {
    console.warn("site theme is not valid for tailwind, using default theme");
  }
}, themeConfig);

export const UIPlugin = plugin(() => {}, themeConfig);

export const CodePlugin = plugin(({ addBase }) => {
  addBase({
    ".prose code.language-math::before, .prose code.language-math::after": {
      content: "none",
    },
    ".prose pre:has(code.language-math)": {
      "@apply bg-background text-foreground": {},
    },
    pre: {
      "@apply !px-0 rounded-lg": {},
    },
    code: {
      "@apply text-sm md:text-base leading-loose": {},
    },
    "pre > code": {
      counterReset: "line",
    },
    'code[data-theme*=" "], code[data-theme*=" "] span': {
      color: "var(--shiki-light)",
      backgroundColor: "var(--shiki-light-bg)",
    },
    'pre[data-theme*=" "]': {
      backgroundColor: "var(--shiki-light-bg)",
    },
    ".dark": {
      'code[data-theme*=" "], code[data-theme*=" "] span': {
        color: "var(--shiki-dark)",
        backgroundColor: "var(--shiki-dark-bg)",
      },
      'pre[data-theme*=" "]': {
        backgroundColor: "var(--shiki-dark-bg)",
      },
    },
    "code[data-line-numbers]": {
      counterReset: "line",
    },
    "code[data-line-numbers] > [data-line]::before": {
      counterIncrement: "line",
      content: "counter(line)",
      "@apply inline-block w-4 mr-4 text-right text-gray-500": {},
    },
    "pre [data-line]": {
      "@apply px-4 border-l-2 border-l-transparent": {},
    },
    "[data-highlighted-line]": {
      background: "rgba(200, 200, 255, 0.1) !important",
      "@apply border-l-blue-400 !important": {},
    },
    "[data-highlighted-chars]": {
      "@apply bg-zinc-600/50 rounded": {},
      boxShadow: "0 0 0 4px rgb(82 82 91 / 0.5)",
    },
    "[data-chars-id]": {
      "@apply shadow-none p-1 border-b-2": {},
    },
    "[data-chars-id] span": {
      "@apply !text-inherit": {},
    },
    '[data-chars-id="v"]': {
      "@apply !text-pink-300 bg-rose-800/50 border-b-pink-600 font-bold": {},
    },
    '[data-chars-id="s"]': {
      "@apply !text-yellow-300 bg-yellow-800/50 border-b-yellow-600 font-bold":
        {},
    },
    '[data-chars-id="i"]': {
      "@apply !text-purple-200 bg-purple-800/50 border-b-purple-600 font-bold":
        {},
    },
    "[data-rehype-pretty-code-title]": {
      "@apply bg-[#746b4d] text-[#f4f4f4] dark:bg-zinc-700 dark:text-zinc-200 rounded-t-lg py-2 px-3 font-semibold text-sm":
        {},
    },
    "figure[data-rehype-pretty-code-figure]:has(> [data-rehype-pretty-code-title]) pre":
      {
        "@apply rounded-t-none bg-[var(--shiki-light-bg)] dark:bg-[var(--shiki-dark-bg)]":
          {},
      },
    "figure[data-rehype-pretty-code-figure] figcaption": {
      textAlign: "center",
    },
    figure: {
      "@apply mb-6 mt-1": {},
    },
    "pre, code, figure": {
      "@apply overflow-x-auto overflow-y-hidden": {},
    },
  });
});
