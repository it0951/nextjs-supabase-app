// lint-staged: 커밋 전 스테이지된 파일에만 도구 실행
const config = {
  // TypeScript/JavaScript 파일: ESLint 자동 수정 후 Prettier 포맷팅
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  // 마크업/데이터/스타일 파일: Prettier 포맷팅만
  "*.{json,css,md,mdx}": ["prettier --write"],
};

export default config;
