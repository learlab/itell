// TODO: this config is not used after tailwind v4 upgrade, remove this in the future
// the actual styling is in packages/ui/src/styles/globals.css
// keeping this to enable completion in neovim https://github.com/luckasRanarison/tailwind-tools.nvim/issues/50
import { AppPreset } from "@itell/tailwind";

import type { Config } from "tailwindcss";

export default {
  presets: [AppPreset],
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./content/**/*.md"],
} satisfies Config;
