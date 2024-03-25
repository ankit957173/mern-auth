import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        //databse url here
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
