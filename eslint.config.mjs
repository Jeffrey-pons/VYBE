import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import pluginReactHooks from "eslint-plugin-react-hooks";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["**/.expo/**"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // pluginReact.configs.recommended,
  {
    plugins: {
      react: pluginReact,
      "react-native": pluginReactNative,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-unused-styles": "warn",
    },
  },
];
