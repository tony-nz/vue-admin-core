import useAppStore from "../../store/app";

class LayoutService {
  /**
   * @description initialize default layout
   */
  public static init(): void {
    LayoutService.initLayout();
  }

  /**
   * @description init layout
   */
  public static initLayout(): void {
    const appStore = useAppStore();
    const localStorageConfig = Object.assign(
      {},
      JSON.parse(window.localStorage.getItem("config") || "{}")
    );

    /**
     * Load config from local storage
     * TODO:: this bugs out and overwrites user defined layoutconfig
     */
    if (localStorageConfig || !localStorageConfig.layout) {
      // appStore.overrideLayoutConfig();
    }
  }
}

export default LayoutService;
