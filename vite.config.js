import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build:{
    outDir: "dist"  //backend 위치
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",  // 백엔드 서버 주소
        changeOrigin: true,               // CORS 문제 해결을 위해 원본 변경 허용
        rewrite: (path) => path.replace(/^\/api/, '')  // 프록시 요청에서 /api를 제거
      }
    },
  },
});
