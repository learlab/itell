// TODO: remove this file after tailwind v4 is supported in neovim https://github.com/luckasRanarison/tailwind-tools.nvim/issues/50
// this file is not used after the v4 upgrade and the actual styling is in packages/ui/src/styles/globals.css
import { AppPreset } from "@itell/tailwind";

import type { Config } from "tailwindcss";

export default {
  presets: [AppPreset],
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./content/**/*.md"],
} satisfies Config;
