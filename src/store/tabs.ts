import { defineStore } from "pinia";

export interface ITabsItem {
  name: string;
  path: string;
  icon: string;
  activePath?: string;
  title: string;
  query?: {
    [key: string]: any;
  };
  params?: {
    [key: string]: any;
  };
}

interface IState {
  tabs: ITabsItem[];
}

const NO_PUSH_ROUTES = ["404"];

const HOME_PAGE = {
  name: "home",
  path: "/dashboard",
  title: "Dashboard",
  icon: "",
};

export const useTabsStore = defineStore({
  id: "TabStore",
  state: (): IState => ({
    tabs: [HOME_PAGE],
  }),
  actions: {
    handleAddRoute(route: any) {
      if (!route.name) return;
      if (NO_PUSH_ROUTES.includes(route.name)) return;
      this.tabs.push({
        name: route.name,
        path: route.path,
        icon: route.meta.icon,
        title: route.meta.title,
        activePath: route.meta.activeMenu,
        query: route.query,
        params: route.params,
      });
    },
    handleClose(index: number) {
      this.tabs.splice(index, 1);
    },
    handleCloseOther(index: number) {
      const obj = JSON.parse(JSON.stringify(this.tabs[index]));
      this.tabs = obj.name === "Home" ? [HOME_PAGE] : [HOME_PAGE, obj];
    },
    handleCloseAll() {
      this.tabs = [HOME_PAGE];
    },
  },
  getters: {
    getTabs: (state) => state.tabs,
  },
});

export default useTabsStore;
