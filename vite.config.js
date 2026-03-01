import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const GSAP_ESM = path.resolve(__dirname, 'assets/gsap-public/gsap-public/esm')

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Array form: specific aliases must come BEFORE the generic 'gsap' entry
    alias: [
      { find: 'gsap/ScrollTrigger', replacement: path.join(GSAP_ESM, 'ScrollTrigger.js') },
      { find: 'gsap/SplitText',     replacement: path.join(GSAP_ESM, 'SplitText.js') },
      { find: 'gsap/Observer',      replacement: path.join(GSAP_ESM, 'Observer.js') },
      { find: 'gsap/CustomEase',    replacement: path.join(GSAP_ESM, 'CustomEase.js') },
      { find: 'gsap',               replacement: path.join(GSAP_ESM, 'index.js') },
    ],
  },
})
