import { defineStore } from "pinia";

export interface ITabsItem {
  name: string;
  path: string;
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
};

export const useTabsStore = defineStore({
  id: "TabStore",
  state: (): IState => ({
    tabs: JSON.parse(window.sessionStorage.getItem("tabs") as string) || [],
  }),
  actions: {
    setStorage() {
      // prevent double ups
      this.tabs = this.tabs.filter((tab, index, self) => {
        return (
          index ===
          self.findIndex((t) => {
            return t.name === tab.name;
          })
        );
      });
      window.sessionStorage.setItem("tabs", JSON.stringify(this.tabs));
    },
    handleAddRoute(route: any) {
      if (!route.name) return;
      if (NO_PUSH_ROUTES.includes(route.name)) return;
      this.tabs.push({
        name: route.name,
        path: route.path,
        title: route.meta.title,
        activePath: route.meta.activeMenu,
        query: route.query,
        params: route.params,
      });
      this.setStorage();
    },
    handleClose(index: number) {
      this.tabs.splice(index, 1);
      this.setStorage();
    },
    handleCloseOther(index: number) {
      const obj = JSON.parse(JSON.stringify(this.tabs[index]));
      this.tabs = obj.name === "Home" ? [HOME_PAGE] : [HOME_PAGE, obj];
      this.setStorage();
    },
    handleCloseAll() {
      this.tabs = [HOME_PAGE];
      this.setStorage();
    },
  },
});
