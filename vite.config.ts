import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use absolute paths for Cloudflare Pages (recommended)
  // For Firebase, you can use '/' (default) or './' (both work)
  // For InfinityFree subdirectory hosting, use './'
  base: '/', // Absolute paths work best for Cloudflare Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
