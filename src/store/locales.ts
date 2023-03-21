import { defineStore } from "pinia";
import i18n from "../core/plugins/i18n";

interface IState {
  locales: any;
}

const useLocalesStore = defineStore({
  id: "LocalesStore",
  state: (): IState => ({
    locales: {},
  }),
  actions: {
    setLocales(payload): void {
      this.locales = payload;

      // loop through payload and set each locale
      for (const [key, value] of Object.entries(payload)) {
        i18n.global.setLocaleMessage(key, Object.assign({}, value));
      }
    },
  },
  getters: {
    getLocales(): any {
      return this.locales;
    },
  },
});

export default useLocalesStore;
