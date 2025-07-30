import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "src/generated/**",
      "**/generated/**",
      "**/*.wasm.js",
      ".next/**",
      "node_modules/**",
    ],
  },
  {
    rules: {
      // Turn off strict rules for development
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",

      // Keep these as errors for important runtime issues
      "@typescript-eslint/no-require-imports": "error",
      "react-hooks/rules-of-hooks": "error",
    },
  },
];

export default eslintConfig;
