// vite.config.ts
import { defineConfig } from "file:///Users/tony/Projects/GitHub/tony-nz/vue-admin-core/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import copy from "file:///Users/tony/Projects/GitHub/tony-nz/vue-admin-core/node_modules/rollup-plugin-copy/dist/index.commonjs.js";
import dts from "file:///Users/tony/Projects/GitHub/tony-nz/vue-admin-core/node_modules/vite-plugin-dts/dist/index.mjs";
import vue from "file:///Users/tony/Projects/GitHub/tony-nz/vue-admin-core/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/tony/Projects/GitHub/tony-nz/vue-admin-core";
var vite_config_default = defineConfig({
  plugins: [
    dts({
      include: "src/*.d.ts"
      // insertTypesEntry: true,
    }),
    copy({
      targets: [{ src: "./src/index.d.ts", dest: "./dist" }]
    }),
    vue()
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
      "@tony-nz/vue-admin-core": "./node_modules/@tony-nz/vue-admin-core",
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    },
    dedupe: ["vue"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdG9ueS9Qcm9qZWN0cy9HaXRIdWIvdG9ueS1uei92dWUtYWRtaW4tY29yZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3RvbnkvUHJvamVjdHMvR2l0SHViL3RvbnktbnovdnVlLWFkbWluLWNvcmUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3RvbnkvUHJvamVjdHMvR2l0SHViL3RvbnktbnovdnVlLWFkbWluLWNvcmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgY29weSBmcm9tIFwicm9sbHVwLXBsdWdpbi1jb3B5XCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgZHRzKHtcbiAgICAgIGluY2x1ZGU6IFwic3JjLyouZC50c1wiLFxuICAgICAgLy8gaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICB9KSxcbiAgICBjb3B5KHtcbiAgICAgIHRhcmdldHM6IFt7IHNyYzogXCIuL3NyYy9pbmRleC5kLnRzXCIsIGRlc3Q6IFwiLi9kaXN0XCIgfV0sXG4gICAgfSksXG4gICAgdnVlKCksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBlc21FeHRlcm5hbHM6IHRydWUsXG4gICAgfSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBuYW1lOiBcIlZ1ZUFkbWluXCIsXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYGluZGV4LiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1widnVlXCIsIFwicGluaWFcIiwgXCJ2dWUtcm91dGVyXCIsIFwidnVlLWlubGluZS1zdmdcIl0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gZXhwb3J0czogXCJuYW1lZFwiLFxuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgdnVlOiBcIlZ1ZVwiLFxuICAgICAgICAgIFwidnVlLWlubGluZS1zdmdcIjogXCJJbmxpbmVTdmdcIixcbiAgICAgICAgICBcInZ1ZS1yb3V0ZXJcIjogXCJWdWVSb3V0ZXJcIixcbiAgICAgICAgICBwaW5pYTogXCJwaW5pYVwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQHRvbnktbnovdnVlLWFkbWluLWNvcmVcIjogXCIuL25vZGVfbW9kdWxlcy9AdG9ueS1uei92dWUtYWRtaW4tY29yZVwiLFxuICAgICAgJ3Z1ZS1pMThuJzogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzJyxcbiAgICB9LFxuICAgIGRlZHVwZTogW1widnVlXCJdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdVLFNBQVMsb0JBQW9CO0FBQ3JXLFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUpoQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixTQUFTO0FBQUE7QUFBQSxJQUVYLENBQUM7QUFBQSxJQUNELEtBQUs7QUFBQSxNQUNILFNBQVMsQ0FBQyxFQUFFLEtBQUssb0JBQW9CLE1BQU0sU0FBUyxDQUFDO0FBQUEsSUFDdkQsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLEVBQ047QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGlCQUFpQjtBQUFBLE1BQ2YsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVUsQ0FBQyxXQUFXLFNBQVM7QUFBQSxJQUNqQztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE9BQU8sU0FBUyxjQUFjLGdCQUFnQjtBQUFBLE1BQ3pELFFBQVE7QUFBQTtBQUFBLFFBRU4sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsa0JBQWtCO0FBQUEsVUFDbEIsY0FBYztBQUFBLFVBQ2QsT0FBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLDJCQUEyQjtBQUFBLE1BQzNCLFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFDQSxRQUFRLENBQUMsS0FBSztBQUFBLEVBQ2hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
