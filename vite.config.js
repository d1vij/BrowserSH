import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
    // Mount onto www.example.com/BrowserSH
    base: mode === 'production' ? '/BrowserSH/' : '/',
}))