import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 引入 v4 的 Vite 插件

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 启用 Tailwind v4 插件
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});
