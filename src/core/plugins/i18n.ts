import { createI18n } from "vue-i18n";

const i18n = createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: {},
  // warning message disable
  warnHtmlMessage: false,
});

export default i18n;
