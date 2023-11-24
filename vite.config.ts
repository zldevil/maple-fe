import { defineConfig } from 'vite'
import path from "path"
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 路径别名
      // "@assets": path.resolve(__dirname, "src/assets"),
      // "@components": path.resolve(__dirname, "src/components"),
      // "@images": path.resolve(__dirname, "src/assets/images"),
      // "@pages": path.resolve(__dirname, "src/pages"),
      // "@store": path.resolve(__dirname, "src/store"),
    },
    extensions: [".js", ".json", ".ts"], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  root: process.cwd(),
  //base: process.env.NODE_ENV === 'production' ? VITE_PUBLIC_PATH : './',
  optimizeDeps: {
    include: ['element-plus/es/locale/lang/zh-cn'],
  },
  server: {
    host: '0.0.0.0',
    //port: VITE_PORT,
    //open: VITE_OPEN,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[hash].[name].js`,
        chunkFileNames: `assets/[hash].[name].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        compact: true,
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
        },
      },
    },
  },
  define: {
    __VUE_I18N_LEGACY_API__: JSON.stringify(false),
    __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
    __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },

})

