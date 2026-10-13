import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base يطابق اسم المستودع على GitHub Pages: https://wajbatna.github.io/Sokhrti/
export default defineConfig({
  base: "/Sokhrti/",
  plugins: [react()],
});
