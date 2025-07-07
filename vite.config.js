import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'a2bc-180-243-136-250.ngrok-free.app', // ganti sesuai domain ngrok kamu
    ],
  },
})
