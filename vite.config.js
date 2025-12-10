import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CSS به JS تزریق می‌کند
function cssInjectedByJsPlugin() {
  let cssCode = '';
  return {
    name: 'vite-plugin-css-injected-by-js',
    apply: 'build',
    enforce: 'post',
    generateBundle(options, bundle) {
      const cssFiles = [];
      for (const key in bundle) {
        const chunk = bundle[key];
        if (chunk.type === 'asset' && key.endsWith('.css')) {
          cssFiles.push(key);
          cssCode += chunk.source.toString();
        }
      }
      cssFiles.forEach(file => delete bundle[file]);
      if (!cssCode) return;

      const escapedCss = cssCode
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')
        .replace(/\r?\n/g, '');

      for (const key in bundle) {
        const chunk = bundle[key];
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const injectCode = `
(function(){
  try {
    if (typeof document !== 'undefined') {
      if (!document.getElementById('vue-datepicker-style')) {
        const style = document.createElement('style');
        style.id = 'vue-datepicker-style';
        style.textContent = \`${escapedCss}\`;
        document.head.appendChild(style);
      }
    }
  } catch(e) { console.error('[vue-datepicker] CSS injection failed', e); }
})();
`;
          chunk.code = injectCode + chunk.code;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/abstracts/variables" as *;
          @use "@/assets/styles/abstracts/functions" as *;
          @use "@/assets/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueDatepicker',
      fileName: format => `vue-datepicker.${format}.js`,
    },
    minify: 'esbuild', // سریع و سبک
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: 0, // فونت و تصاویر inline نشوند
    rollupOptions: {
      external: ['vue'], // Vue را external می‌کند
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
        compact: true,
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.woff2')) {
            return 'fonts/[name][extname]'; // فونت‌ها جدا
          }
          return '[name][extname]';
        },
      },
    },
  },
});
