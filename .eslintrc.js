// eslint-disable-next-line no-undef
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["**/*.spec.*"],
      rules: {
        "@typescript-eslint/no-explicit-any": 0,
      },
    },
  ],
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
};
