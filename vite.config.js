import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',   // اضافه کردن این خط
  base: '/miniapp/',
  build: {
    outDir: '../dist',  // خروجی در کنار src، نه داخل src
    emptyOutDir: true
  }
});
