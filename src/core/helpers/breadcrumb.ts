import useBreadcrumbStore from "../../store/breadcrumb";

/**
 * Sets current page breadcrumbs
 * @param {string} pageTitle Current page title
 * @param {Array<string>} breadcrumbs Current page breadcrumbs
 */
export const setCurrentPageBreadcrumbsOG = (
  pageTitle: string,
  breadcrumbs: Array<string>
): void => {
  const breadcrumbStore = useBreadcrumbStore();
  breadcrumbStore.setBreadcrumb({
    title: pageTitle,
    pageBreadcrumbPath: breadcrumbs,
  });
};

/**
 * Sets current page breadcrumbs
 * @param {string} pageTitle Current page title
 * @param {Array<string>} breadcrumbs Current page breadcrumbs
 */
export const setCurrentPageBreadcrumbs = (
  pageTitle: string,
  breadcrumbs: Array<string>,
  getPage?: string
): void => {
  const breadcrumbStore = useBreadcrumbStore();
  breadcrumbStore.setBreadcrumb({
    title: pageTitle,
    pageBreadcrumbPath: breadcrumbs,
    page: getPage ? getPage : null,
  });
};

/**
 * Sets current page breadcrumbs
 * @param {string} title Current page title name
 */
export const setCurrentPageTitle = (title: string): void => {
  const breadcrumbStore = useBreadcrumbStore();
  breadcrumbStore.setBreadcrumb({
    title: title,
  });
};
