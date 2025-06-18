import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from network IP
    port: 5173, // Default Vite port, can be customized
    // Optional: Proxy for API/Socket.IO during development if client and server are on different origins
    // proxy: {
    //   '/socket.io': { // Proxy WebSocket connections for Socket.IO
    //     target: 'http://localhost:3001', // Your backend server URL
    //     ws: true, // Enable WebSocket proxy
    //     changeOrigin: true
    //   },
    //   '/api': { // Example: if you have REST API routes
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  // Optional: build options, e.g., for base path if deploying to a sub-directory
  // build: {
  //   outDir: 'dist', // Default build output directory
  // }
});