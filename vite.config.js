import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
 
export default defineConfig({
  plugins: [react()],
  server: {
    // 백엔드(Spring Boot) 연결 시 CORS 없이 /api 요청을 넘겨줌 (포트는 백엔드 설정에 맞게 수정)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
 