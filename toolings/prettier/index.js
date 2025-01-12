module.exports = {
  trailingComma: "es5",
  semi: true,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  plugins: [
    "prettier-plugin-css-order",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "only$",
    "",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "^(@itell)(/.*)$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/.*",
    "^[./]",
    "<TYPES>^(node:)",
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  tailwindFunctions: ["clsx", "cn"],
};
