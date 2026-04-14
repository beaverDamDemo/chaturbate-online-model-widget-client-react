import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    // Proxy removed to allow direct API calls to live backend via VITE_API_BASE_URL
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
});
