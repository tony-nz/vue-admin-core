import { computed } from "vue";
import useLayoutStore from "../../store/layout";

/**
 * Returns layout config
 * @returns {object}
 */
export const config = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig;
});

/**
 * Display breadcrumbs
 * @returns {boolean}
 */
export const displayBreadcrumbs = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.breadcrumbs.display");
});

/**
 * Display page loader
 * @returns {boolean}
 */
export const displayLoader = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.loader.display");
});

/**
 * Display logo
 * @returns {boolean}
 */
export const displayLogo = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.logo.display");
});

/**
 * Display toolbar
 * @returns {boolean}
 */
export const displayToolbar = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.toolbar.display");
});

/**
 * Display scroll to top
 * @returns {boolean}
 */
export const displayScrollTop = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.scrollTop.display");
});

/**
 * Check if layout is fluid or fixed
 * @returns {boolean}
 */
export const layoutWidth = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.theme.display");
});

/**
 * Check if container width is fluid
 * @returns {boolean}
 */
export const contentWidth = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.content.width");
});

/**
 * Page loader logo image
 * @returns {string}
 */
export const loaderLogo = computed(() => {
  const appStore = useLayoutStore();
  return process.env.BASE_URL + appStore.getConfig("layout.loader.logo");
});

/**
 * Logo dark location
 * @returns {string}
 */
export const logoDark = computed(() => {
  const appStore = useLayoutStore();
  return process.env.BASE_URL + appStore.getConfig("layout.logo.dark");
});

/**
 * Logo light location
 * @returns {string}
 */
export const logoLight = computed(() => {
  const appStore = useLayoutStore();
  return process.env.BASE_URL + appStore.getConfig("layout.logo.light");
});

/**
 * Logo alt attribute
 * @returns {string}
 */
export const logoAlt = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.logo.alt");
});

/**
 * Logo class attribute
 * @returns {string}
 */
export const logoClass = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.logo.class");
});

/**
 * Returns dark mode
 * @returns {boolean}
 */
export const darkMode = computed(() => {
  const appStore = useLayoutStore();
  return appStore.getConfig("layout.theme.darkMode");
});

/**
 * Toggle dark mode
 * @returns {boolean}
 */
export const toggleDarkMode = computed(() => {
  const appStore = useLayoutStore();
  return appStore.toggleDarkMode;
});
/**
 * Toggle toolbar
 * @returns {boolean}
 */
export const toggleToolbar = computed(() => {
  const appStore = useLayoutStore();
  return appStore.toggleToolbar;
});
