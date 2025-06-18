import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ✅ Important pour les alias

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ajoute ici tous les alias utilisés dans le projet
      layouts: path.resolve(__dirname, 'src/layouts'),
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      examples: path.resolve(__dirname, 'src/examples'),
      // si tu veux être safe :
      pages: path.resolve(__dirname, 'src/pages'),
      context: path.resolve(__dirname, 'src/context'),
      routes: path.resolve(__dirname, 'src/routes'),
    },
  },
});

