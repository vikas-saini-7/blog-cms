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
      // Disable strict TypeScript rules for development
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",

      // Keep these as errors for important issues
      "@typescript-eslint/no-require-imports": "error",
    },
  },
];

export default eslintConfig;
