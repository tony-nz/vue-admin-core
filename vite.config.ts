import { defineConfig } from "vite";
import { resolve } from "path";
import copy from "rollup-plugin-copy";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    dts({
      include: "src/*.d.ts",
      // insertTypesEntry: true,
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
      external: ["vue", "pinia", "vue-router", "vue-inline-svg"],
      output: {
        // exports: "named",
        globals: {
          vue: "Vue",
          "vue-inline-svg": "InlineSvg",
          "vue-router": "VueRouter",
          pinia: "pinia",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@tony-nz/vue-admin-core": "./node_modules/@tony-nz/vue-admin-core",
    },
    dedupe: ["vue"],
  },
});
