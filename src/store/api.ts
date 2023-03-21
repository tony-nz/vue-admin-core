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
    setLoading(state, loading) {
      state.loading = loading;
      if (!loading) {
        state.refresh = false;
      }
    },
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
  },
  getters: {
    /**
     * Get api loading state
     * @returns object
     */
    getLoading(state): boolean {
      return state.loading;
    },
    /**
     * Get api refresh state
     * @returns object
     */
    getRefresh(state): boolean {
      return state.refresh;
    },
  },
});

export default useApiStore;
