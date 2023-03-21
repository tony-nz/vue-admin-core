// vite.config.ts
import { defineConfig } from "file:///Users/tony/Documents/Github/tony-nz/vue-admin-core/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import copy from "file:///Users/tony/Documents/Github/tony-nz/vue-admin-core/node_modules/rollup-plugin-copy/dist/index.commonjs.js";
import dts from "file:///Users/tony/Documents/Github/tony-nz/vue-admin-core/node_modules/vite-plugin-dts/dist/index.mjs";
import vue from "file:///Users/tony/Documents/Github/tony-nz/vue-admin-core/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/tony/Documents/Github/tony-nz/vue-admin-core";
var vite_config_default = defineConfig({
  plugins: [
    dts({
      include: "src/*.d.ts"
    }),
    copy({
      targets: [{ src: "./src/index.d.ts", dest: "./dist" }]
    }),
    vue()
    // {
    //   name: "copy-index-dts",
    //   writeBundle: async () => {
    //     const { promises } = require("fs");
    //     await promises.copyFile("./src/index.d.ts", "./dist/index.d.ts");
    //   },
    // },
  ],
  build: {
    commonjsOptions: {
      esmExternals: true
    },
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "VueAdmin",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["vue", "pinia", "vue-router", "vue-inline-svg"],
      output: {
        // exports: "named",
        globals: {
          vue: "Vue",
          "vue-inline-svg": "InlineSvg",
          "vue-router": "VueRouter",
          pinia: "pinia"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@tony-nz/vue-admin-core": "./node_modules/@tony-nz/vue-admin-core"
    },
    dedupe: ["vue"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdG9ueS9Eb2N1bWVudHMvR2l0aHViL3RvbnktbnovdnVlLWFkbWluLWNvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy90b255L0RvY3VtZW50cy9HaXRodWIvdG9ueS1uei92dWUtYWRtaW4tY29yZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdG9ueS9Eb2N1bWVudHMvR2l0aHViL3RvbnktbnovdnVlLWFkbWluLWNvcmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgY29weSBmcm9tIFwicm9sbHVwLXBsdWdpbi1jb3B5XCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgZHRzKHtcbiAgICAgIGluY2x1ZGU6IFwic3JjLyouZC50c1wiLFxuICAgIH0pLFxuICAgIGNvcHkoe1xuICAgICAgdGFyZ2V0czogW3sgc3JjOiBcIi4vc3JjL2luZGV4LmQudHNcIiwgZGVzdDogXCIuL2Rpc3RcIiB9XSxcbiAgICB9KSxcbiAgICB2dWUoKSxcbiAgICAvLyB7XG4gICAgLy8gICBuYW1lOiBcImNvcHktaW5kZXgtZHRzXCIsXG4gICAgLy8gICB3cml0ZUJ1bmRsZTogYXN5bmMgKCkgPT4ge1xuICAgIC8vICAgICBjb25zdCB7IHByb21pc2VzIH0gPSByZXF1aXJlKFwiZnNcIik7XG4gICAgLy8gICAgIGF3YWl0IHByb21pc2VzLmNvcHlGaWxlKFwiLi9zcmMvaW5kZXguZC50c1wiLCBcIi4vZGlzdC9pbmRleC5kLnRzXCIpO1xuICAgIC8vICAgfSxcbiAgICAvLyB9LFxuICBdLFxuICBidWlsZDoge1xuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgZXNtRXh0ZXJuYWxzOiB0cnVlLFxuICAgIH0sXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxuICAgICAgbmFtZTogXCJWdWVBZG1pblwiLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBpbmRleC4ke2Zvcm1hdH0uanNgLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtcInZ1ZVwiLCBcInBpbmlhXCIsIFwidnVlLXJvdXRlclwiLCBcInZ1ZS1pbmxpbmUtc3ZnXCJdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIGV4cG9ydHM6IFwibmFtZWRcIixcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHZ1ZTogXCJWdWVcIixcbiAgICAgICAgICBcInZ1ZS1pbmxpbmUtc3ZnXCI6IFwiSW5saW5lU3ZnXCIsXG4gICAgICAgICAgXCJ2dWUtcm91dGVyXCI6IFwiVnVlUm91dGVyXCIsXG4gICAgICAgICAgcGluaWE6IFwicGluaWFcIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkB0b255LW56L3Z1ZS1hZG1pbi1jb3JlXCI6IFwiLi9ub2RlX21vZHVsZXMvQHRvbnktbnovdnVlLWFkbWluLWNvcmVcIixcbiAgICB9LFxuICAgIGRlZHVwZTogW1widnVlXCJdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJVLFNBQVMsb0JBQW9CO0FBQ3hXLFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUpoQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsSUFDRCxLQUFLO0FBQUEsTUFDSCxTQUFTLENBQUMsRUFBRSxLQUFLLG9CQUFvQixNQUFNLFNBQVMsQ0FBQztBQUFBLElBQ3ZELENBQUM7QUFBQSxJQUNELElBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUU47QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGlCQUFpQjtBQUFBLE1BQ2YsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVUsQ0FBQyxXQUFXLFNBQVM7QUFBQSxJQUNqQztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE9BQU8sU0FBUyxjQUFjLGdCQUFnQjtBQUFBLE1BQ3pELFFBQVE7QUFBQTtBQUFBLFFBRU4sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsa0JBQWtCO0FBQUEsVUFDbEIsY0FBYztBQUFBLFVBQ2QsT0FBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLDJCQUEyQjtBQUFBLElBQzdCO0FBQUEsSUFDQSxRQUFRLENBQUMsS0FBSztBQUFBLEVBQ2hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
