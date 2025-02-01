import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgLoader from "vite-svg-loader";
import mkcert from "vite-plugin-mkcert";
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), svgLoader(), mkcert()],
    optimizeDeps: {
      include: ["recoil"],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      outDir: "dist",
    },
    server: {
      https: true,
    },
  });
};
