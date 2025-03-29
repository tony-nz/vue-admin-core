import { App } from "vue";
import Vueform from "@vueform/vueform";
import vueformConfig from "./../../../vueform.config";

/**
 * Initialize Vueform component with optimized configuration
 * @param app vue instance
 */
export function initVueform(app: App<Element>) {
  // Only initialize VueForm if it hasn't been initialized yet
  if (!app._context.provides["vueform"]) {
    app.use(Vueform, {
      ...vueformConfig,
      // Add runtime optimizations
      lazy: true, // Lazy load components
      cache: true, // Cache form values
      debounce: 300, // Debounce validation
      // Disable features we don't use
      disableNativeValidation: true,
      // Optimize rendering
      renderField: true,
    });
  }
}
