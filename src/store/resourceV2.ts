import { defineStore } from "pinia";
import { translate, upperCaseFirst } from "../core/helpers/functions";
import { ResourceConfig } from "../core/types/ResourceConfigTypes";
import * as methods from "./enums/ResourceEnums";
import ApiService from "../core/services/ApiService";
import useAppStore from "./app";

const stores = {};
let storeActions = {};

const {
  CREATE,
  DELETE,
  DELETE_MANY,
  GET,
  GET_LIST,
  GET_NODES,
  GET_ONE,
  GET_TREE,
  LOCK,
  UNLOCK,
  MOVE_NODE,
  UPDATE,
  UPDATE_MANY,
} = methods;

interface IState {
  data: {
    item: any;
    list: any[];
  };
  loading: boolean;
  resource: ResourceConfig;
}

/**
 * Function to figure out the correct apiUrl
 */
function getApiUrl(apiUrl, action, params) {
  const replaceUrlId = (url, id) => {
    return url.replace(":id", id);
  };
  const routeId = params?.routeId ? params?.routeId : null;
  const subId = params?.subId ? params?.subId : null;

  apiUrl = replaceUrlId(apiUrl, routeId ? routeId : subId);

  if (action === "getOne") {
    return apiUrl + "/" + params.id;
  }
  return apiUrl;
}

/**
 * processStoreData
 * Modify store lists with updated data
 * @param state
 * @param action
 * @param params
 * @param data
 */
function processStoreData(state, action, payload, data) {
  const params = payload?.params ? payload.params : {};

  switch (action) {
    case CREATE:
      state.data.list.push(data);
      break;
    case DELETE:
      if (params.id) {
        state.data.list.splice(
          state.data.list.map((item) => item.id).indexOf(params.id),
          1
        );
      }
      break;
    case DELETE_MANY:
      if (params.values) {
        params.values.forEach((id) => {
          state.data.list.splice(
            state.data.list.map((item) => id).indexOf(id),
            1
          );
        });
      }
      break;
    case GET_LIST:
    case GET_TREE:
      state.setList(state, data);
      break;
    case GET_ONE:
      break;
    case MOVE_NODE:
      break;
    case UPDATE:
      /**
       * Check for param Id
       */
      let updatedResource: string[] = [];

      updatedResource =
        params?.id && state.data.list
          ? state.data.list.find((val) => val["id"] === params.id)
          : null;

      // go through resource and update any values that are not null
      if (updatedResource) {
        Object.keys(data).forEach((key) => {
          if (updatedResource) {
            if (
              updatedResource[key] ||
              updatedResource[key] === "" ||
              updatedResource[key] === null ||
              updatedResource[key] === false
            ) {
              updatedResource[key] = data[key];
            }
          }
        });
      }

      state.setItem(state, data);
      break;
    case UPDATE_MANY:
      break;
    case LOCK:
      if (params.id) {
        state.data.list.find((item) => item.id === params.id).locked = true;
      }
      break;
    case UNLOCK:
      if (params.id) {
        state.data.list.find((item) => item.id === params.id).locked = false;
      }
      break;
    default:
      break;
  }
}

const useResourceStore = defineStore({
  id: "resourceStore",
  state: (): {
    resources: { [key: string]: IState };
  } => ({
    resources: {},
  }),
  actions: {
    addResource(resourceName: string, resourceConfig: ResourceConfig) {
      if (!this.resources[resourceName]) {
        this.resources[resourceName] = {
          data: { item: {}, list: [] },
          loading: false,
          resource: resourceConfig,
        };
      }
    },
    // Update existing action methods to work with the new structure
    async [CREATE]({ resourceName, payload }) {
      const appStore = useAppStore();
      const resource = this.resources[resourceName];
      try {
        appStore.setApiLoading(true);
        let params = payload?.params || {};

        const newApiUrl = payload?.apiUrl || resource.resource.apiUrl;
        let response = await ApiService[CREATE](
          getApiUrl(newApiUrl, CREATE, payload),
          params
        ).catch((error) => Promise.reject(error));

        const data = response.data?.data?.data || response.data.data;
        resource.data.list.push(data);
        appStore.setApiLoading(false);
        this.showSuccess(resource, { action: CREATE, params, data });
        return Promise.resolve(response.data);
      } catch (e) {
        handleError(resource, appStore, e);
      }
    },
    // Implement similar changes for DELETE, DELETE_MANY, GET, GET_LIST, etc.
    setItem(resourceName: string, item: any) {
      this.resources[resourceName].data.item = item;
    },
    setList(resourceName: string, data: any[]) {
      this.resources[resourceName].data.list = data;
    },
    showSuccess(resource, { action, params, data }) {
      // Similar to before but now with resource-specific notifications
      const appStore = useAppStore();
      const messages = {
        /* message definitions */
      };
      if (
        !resource.resource.notifications ||
        resource.resource.notifications["all"] ||
        resource.resource.notifications[action]
      ) {
        let message = "";
        if ([CREATE, UPDATE].includes(action)) {
          message = `<a class="mt-2" href="/${resource.resource
            .getName(1)
            .toLowerCase()}/${data.id}">Open ${
            data.name || data.title || data.id
          }</a>`;
        }
        appStore.showToast({
          severity: "success",
          summary: messages[action],
          message,
        });
      }
    },
    showError(resource, summary, message) {
      // Similar to before but now with resource-specific error handling
      const appStore = useAppStore();
      if (
        !resource.resource.notifications ||
        resource.resource.notifications["error"] === true
      ) {
        appStore.showToast({
          severity: "error",
          summary,
          message,
        });
      }
    },
  },
  getters: {
    getResourceData: (state) => (resourceName: string) =>
      state.resources[resourceName],
    getDataItem: (state) => (resourceName: string) =>
      state.resources[resourceName]?.data.item,
    getDataList: (state) => (resourceName: string) =>
      state.resources[resourceName]?.data.list,
    getResource: (state) => (resourceName: string) =>
      state.resources[resourceName]?.resource,
    getLoading: (state) => (resourceName: string) =>
      state.resources[resourceName]?.loading,
  },
});

// Helper function for error handling
function handleError(resource, appStore, error) {
  const message = error.response?.data?.message || false;
  appStore.setApiLoading(false);
  resource.showError(resource, error.message, message);
  return Promise.reject(error);
}

export default useResourceStore;
