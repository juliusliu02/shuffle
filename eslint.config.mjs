import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: ["components/ui/**"] },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ),
  {
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // Enforce using `import type` for type-only imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // This setting prefers `import type`
          fixStyle: "inline-type-imports",
        },
      ],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"]],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
