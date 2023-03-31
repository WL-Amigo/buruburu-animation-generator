module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "solid", "unused-imports"],
  extends: ["eslint:recommended", "plugin:solid/typescript"],
  rules: {
    "no-undef": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
    ],
  },
};
