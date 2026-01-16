import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for InfinityFree hosting (or './' for subdirectory)
  // For Firebase, you can use '/' (default) or './' (both work)
  base: './', // Relative paths work for both Firebase and InfinityFree
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
