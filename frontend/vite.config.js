import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgLoader from "vite-svg-loader";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), svgLoader()],
    optimizeDeps: {
      include: ["recoil"],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      outDir: "dist",
    },
    server: {
      https: false, // Отключаем HTTPS, чтобы избежать проблем с локальным запуском
      host: "0.0.0.0", // Доступ к серверу из внешней сети
      port: 5173, // Используем стандартный порт Vite
      strictPort: true, // Если порт занят, сервер не стартует на другом порту
      open: false, // Не пытаемся открыть браузер автоматически
    },
  });
};
