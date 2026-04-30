import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Node.js 환경에서 Server Actions 단위 테스트 실행
    environment: "node",
  },
  resolve: {
    // @/* 경로 별칭 설정
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
