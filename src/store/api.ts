import { defineStore } from "pinia";

interface IState {
  loading: boolean;
  refresh: boolean;
}

const useApiStore = defineStore({
  id: "ApiStore",
  state: (): IState => ({
    loading: false,
    refresh: false,
  }),
  actions: {
    setLoading(loading) {
      this.loading = loading;
      if (!loading) {
        this.refresh = false;
      }
    },
    setRefresh(refresh) {
      this.refresh = refresh;
    },
  },
  getters: {
    /**
     * Get api loading state
     * @returns object
     */
    getLoading(): boolean {
      return this.loading;
    },
    /**
     * Get api refresh state
     * @returns object
     */
    getRefresh(): boolean {
      return this.refresh;
    },
  },
});

export default useApiStore;
