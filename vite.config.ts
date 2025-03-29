import { defineConfig } from "vite";
import { resolve } from "path";
import copy from "rollup-plugin-copy";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    dts({
      include: "src/*.d.ts",
    }),
    copy({
      targets: [{ src: "./src/index.d.ts", dest: "./dist" }],
    }),
    vue(),
  ],
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueAdmin",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "vue",
        "pinia",
        "vue-router",
        "vue-inline-svg",
        "primevue",
        "chart.js",
        "vue3-google-map",
        "vue-i18n",
        "axios",
        "vue-axios",
        "vue3-toastify",
        "deepmerge",
        "object-path",
        "@vueform/vueform",
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "vue-inline-svg": "InlineSvg",
          "vue-router": "VueRouter",
          pinia: "pinia",
          primevue: "PrimeVue",
          "chart.js": "Chart",
          "vue3-google-map": "VueGoogleMap",
          "vue-i18n": "VueI18n",
          axios: "axios",
          "vue-axios": "VueAxios",
          "vue3-toastify": "Vue3Toastify",
          deepmerge: "deepmerge",
          "object-path": "objectPath",
          "@vueform/vueform": "Vueform",
        },
        manualChunks: {
          vendor: ["vue", "pinia", "vue-router"],
          ui: ["primevue", "@vueform/vueform"],
          charts: ["chart.js"],
          maps: ["vue3-google-map"],
          i18n: ["vue-i18n"],
          http: ["axios", "vue-axios"],
          utils: ["deepmerge", "object-path"],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@tony-nz/vue-admin-core": "./node_modules/@tony-nz/vue-admin-core",
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
    },
    dedupe: ["vue"],
  },
});
