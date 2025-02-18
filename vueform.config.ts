// vueform.config.(js|ts)

import { defineConfig } from "@vueform/vueform";
import en from "@vueform/vueform/locales/en";
import ColorPickerPlugin from "./src/components/ui/color-picker";
import InputNumberPlugin from "./src/components/ui/input-number";
import MapcenterElement from "./src/components/ui/map-center/MapcenterElement.vue";
import MarkerSettingElement from "./src/components/ui/marker-setting/MarkerSettingElement.vue";
import tailwind from "@vueform/vueform/themes/tailwind";

export default defineConfig({
  theme: tailwind,
  locales: { en },
  locale: "en",
  plugins: [ColorPickerPlugin],
  elements: [MapcenterElement, MarkerSettingElement],
});
