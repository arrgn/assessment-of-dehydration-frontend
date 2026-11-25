import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    // Заготовка для подключения к веб-сервису (бэкенд на порту 8000,
    // глобальный префикс /api уже есть на бэкенде). В этой лабораторной
    // данные берутся из mock-объектов, запросов к /api нет.
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
