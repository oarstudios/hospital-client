import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import serviceSeo from './vite-plugin-service-seo.js'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    serviceSeo(),
  ],

  

  /* ✅ ADD BELOW (iPhone Safari compatibility) */
  build: {
    target: ['es2015'],        // iPhone Safari safe
    cssTarget: 'chrome61',     // prevents CSS crash on iOS
     sourcemap: false,
  },

  esbuild: {
    target: 'es2015',          // forces safe JS output
  },
})
