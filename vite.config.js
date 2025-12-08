import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

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

      cssFiles.forEach((file) => delete bundle[file]);

      if (!cssCode) {
        console.warn('[css-inject] No CSS found to inject');
        return;
      }

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
      var existing = document.getElementById('vue-datepicker-style');
      if (!existing) {
        var style = document.createElement('style');
        style.id = 'vue-datepicker-style';
        style.textContent = \`${escapedCss}\`;
        document.head.appendChild(style);
      }
    }
  } catch(e) {
    console.error('[vue-datepicker] Failed to inject styles:', e);
  }
})();
`;
          chunk.code = injectCode + chunk.code;
          console.log('[css-inject] CSS injected into:', key);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
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
          @use "@/assets/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueDatepicker',
      fileName: (format) => `vue-datepicker.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
  },
});
