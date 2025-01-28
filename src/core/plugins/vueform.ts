import { App } from "vue";
import Vueform from "@vueform/vueform";
import vueformConfig from "./../../../vueform.config";

/**
 * Initialize Vueform component
 * @param app vue instance
 */
export function initVueform(app: App<Element>) {
  app.use(Vueform, vueformConfig);
}
