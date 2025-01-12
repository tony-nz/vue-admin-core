// vueform.config.(js|ts)

import en from "@vueform/vueform/locales/en";
import tailwind from "@vueform/vueform/themes/tailwind";
import { defineConfig } from "@vueform/vueform";
import ColorPickerPlugin from "./src/components/ui/color-picker";
import InputNumberPlugin from "./src/components/ui/input-number";
import MapcenterElement from "./src/components/ui/map-center/MapcenterElement.vue";

export default defineConfig({
  theme: tailwind,
  locales: { en },
  locale: "en",
  plugins: [ColorPickerPlugin],
  elements: [MapcenterElement],
});
