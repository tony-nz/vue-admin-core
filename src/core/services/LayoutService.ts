import useConfigStore from "../../store/config";

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
    const configStore = useConfigStore();
    const localStorageConfig = Object.assign(
      {},
      JSON.parse(window.localStorage.getItem("config") || "{}")
    );

    /**
     * Load config from local storage
     * TODO:: this bugs out and overwrites user defined layoutconfig
     */
    if (localStorageConfig || !localStorageConfig.layout) {
      // configStore.overrideLayoutConfig();
    }
  }
}

export default LayoutService;
