import { defineStore } from "pinia";

interface Breadcrumb {
  title: string;
  pageBreadcrumbPath: Array<string>;
  page: string;
}

interface IState {
  breadcrumbs: Breadcrumb;
}

const useBreadcrumbStore = defineStore({
  id: "BreadcrumbStore",
  state: (): IState => ({
    breadcrumbs: {} as Breadcrumb,
  }),
  actions: {
    setBreadcrumb(payload) {
      this.breadcrumbs = payload;
    },
  },
  getters: {
    /**
     * breadcrumb object for current page
     * @returns object
     */
    getBreadcrumbs(): Breadcrumb {
      return this.breadcrumbs;
    },
    /**
     * breadcrumb array for current page
     * @returns object
     */
    pageBreadcrumbPath(): Array<string> {
      return this.breadcrumbs.pageBreadcrumbPath;
    },
    /**
     * current page title
     * @returns string
     */
    pageTitle(): string {
      return this.breadcrumbs.title;
    },
    /**
     * current page title
     * @returns string
     */
    currentPage(): string {
      return this.breadcrumbs.page;
    },
  },
});

export default useBreadcrumbStore;
