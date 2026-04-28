// eslint-config-next v16은 네이티브 flat config를 제공하므로 FlatCompat 불필요
import nextConfig from "eslint-config-next/core-web-vitals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  // Next.js 권장 규칙 (TypeScript + Core Web Vitals 포함)
  ...nextConfig,
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // any 타입 사용 금지 (CLAUDE.md 규칙)
      "@typescript-eslint/no-explicit-any": "error",
      // 미사용 변수 금지 (_prefix로 시작하는 변수는 허용)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Prettier와 충돌하는 ESLint 규칙 비활성화 (항상 마지막에 위치)
  eslintConfigPrettier,
];

export default eslintConfig;
