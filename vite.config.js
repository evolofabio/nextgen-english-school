import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        metodo: resolve(__dirname, 'metodo.html'),
        corsi: resolve(__dirname, 'corsi.html'),
        contatti: resolve(__dirname, 'contatti.html'),
        corsoBambini: resolve(__dirname, 'corso-bambini.html'),
        corsoRagazzi: resolve(__dirname, 'corso-ragazzi.html'),
        corsoAdulti: resolve(__dirname, 'corso-adulti.html'),
        corsoCambridge: resolve(__dirname, 'corso-cambridge.html'),
        corsoViaggi: resolve(__dirname, 'corso-viaggi.html'),
      },
    },
  },
})
