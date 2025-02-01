import { defineStore } from "pinia";
import { translate } from "../core/helpers/functions";
import { ResourceConfig } from "../core/types/ResourceConfigTypes";
import * as methods from "./enums/ResourceEnums";
import ApiService from "../core/services/ApiService";
import useAppStore from "./app";

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
  lastUpdated: number; // Timestamp in milliseconds
}

// Helper for URL manipulation
function getApiUrl(
  apiUrl: string,
  action: string,
  params: Record<string, string | number | null>,
  routeId: string | null
): string {
  // Replace :id in the URL if routeId is provided
  if (routeId) {
    apiUrl = apiUrl.replace(":id", routeId);
  }

  // Loop through params to replace other dynamic parts of the URL
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) {
      // Check if value is not null
      apiUrl = apiUrl.replace(new RegExp(`:${key}(?=/|$)`), value.toString()); // Use regex to ensure full match
    }
  }

  // Handle GETONE action
  if (action.toLowerCase() === "getone") {
    // Append the id to the URL if it exists in params
    const id = params.id ? params.id.toString() : "";
    return `${apiUrl}/${id}`;
  }

  return apiUrl;
}

// Action to process data based on the given action type
function processStoreData(
  store: any,
  resourceName: string,
  action: string,
  payload: any,
  data: any
) {
  const params = payload?.params || {};
  const state = store.resources[resourceName];

  switch (action) {
    case CREATE:
      if (state.data.list.data) {
        state.data.list.data.push(data);
      } else {
        state.data.list.push(data);
      }
      break;

    case DELETE:
      if (state.data.list.data) {
        state.data.list.data = state.data.list.data.filter(
          (item) => item.id !== params.id
        );
      } else {
        state.data.list = state.data.list.filter(
          (item) => item.id !== params.id
        );
      }
      break;

    case DELETE_MANY:
      if (params.values) {
        if (state.data.list.data) {
          state.data.list.data = state.data.list.data.filter(
            (item) => !params.values.includes(item.id)
          );
        } else {
          state.data.list = state.data.list.filter(
            (item) => !params.values.includes(item.id)
          );
        }
      }
      break;

    case GET:
    case GET_ONE:
      store.setItem(resourceName, data);
      break;

    case GET_LIST:
    case GET_TREE:
      store.setList(resourceName, data);
      break;

    case UPDATE:
      if (state.data.list.data) {
        const itemIndex = state.data.list.data.findIndex(
          (item) => item.id === params.id
        );
        if (itemIndex !== -1) {
          state.data.list.data[itemIndex] = {
            ...state.data.list.data[itemIndex],
            ...data,
          };
          store.setItem(resourceName, data);
        }
      } else {
        const itemIndex = state.data.list.findIndex(
          (item) => item.id === params.id
        );
        if (itemIndex !== -1) {
          state.data.list[itemIndex] = {
            ...state.data.list[itemIndex],
            ...data,
          };
          store.setItem(resourceName, data);
        }
      }
      break;
    default:
      console.warn(`Unhandled action in processStoreData: ${action}`);
  }
}

// Centralized error handling
function handleError(
  appStore: any,
  resourceStore: any,
  resource: IState,
  error: any
): Promise<any> {
  const message = error.response?.data?.message || "An error occurred";
  appStore.setApiLoading(false);
  resourceStore.showError(resource, error.message, message);
  return Promise.reject(error);
}

async function handleApiCall(
  this: ReturnType<typeof useResourceStore>,
  action: string,
  resourceName: string,
  payload: any
) {
  const appStore = useAppStore();
  const cacheValidity = 1 * 60 * 1000; // 1 minute
  const resource = this.resources[resourceName];
  const loadingActions = [GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE];

  // Check if we should use cached data
  if (loadingActions.includes(action) && resource.resource.cache === true) {
    if (
      resource.lastUpdated &&
      Date.now() - resource.lastUpdated < cacheValidity &&
      resource.data.list.length > 0
    ) {
      if (action === GET_ONE) {
        return resource.data.item;
      } else {
        return resource.data.list;
      }
    }
  }
  // carry on with the API call
  try {
    let params = payload?.params || {};
    if (action === UPDATE && !params.id) params.id = resource.data.item.id;

    const apiUrl = payload?.apiUrl || resource.resource.apiUrl;
    const routeId = payload?.routeId || null;

    const apiMethod = loadingActions.includes(action)
      ? "get"
      : action.toLowerCase();

    if (loadingActions.includes(action)) {
      appStore.setApiLoading(true);
    }

    // Adjusting the call based on the method
    let response;
    if (apiMethod === "delete") {
      // For DELETE, pass only the id or null if no id
      response = await ApiService.delete(
        getApiUrl(apiUrl, action, params, routeId),
        params.id ? params.id : null
      );
    } else if (apiMethod === "create") {
      // For CREATE and UPDATE, pass the URL and params
      response = await ApiService[apiMethod](
        getApiUrl(apiUrl, action, params, routeId),
        params
      );
    } else if (apiMethod === "update") {
      // For CREATE and UPDATE, pass the URL and params
      response = await ApiService[apiMethod](
        getApiUrl(apiUrl, action, params, routeId),
        params.id ? params.id : null,
        params
      );
    } else {
      // For GET, GET_LIST, GET_NODES, GET_ONE, GET_TREE
      const apiParams = action === GET_ONE ? {} : params;
      response = await ApiService.get(
        getApiUrl(apiUrl, action, params, routeId),
        apiParams
      );
    }
    const data = response.data.data;

    processStoreData(this, resourceName, action, payload, data);

    if (loadingActions.includes(action)) {
      resource.lastUpdated = Date.now();
    }
    appStore.setApiLoading(false);
    this.showSuccess(resource, { action, params, data });

    return data;
  } catch (error) {
    return handleError(appStore, this, resource, error);
  }
}

const useResourceStore = defineStore("ResourceStore", {
  state: () => ({
    resources: {} as { [key: string]: IState },
  }),
  actions: {
    addResource(resourceName: string, resourceConfig: ResourceConfig) {
      if (!this.resources[resourceName]) {
        this.resources[resourceName] = {
          data: { item: {}, list: [] },
          loading: false,
          resource: resourceConfig,
          lastUpdated: 0,
        };
      }
    },
    setItem(resourceName: string, item: any) {
      this.resources[resourceName].data.item = item;
    },
    setList(resourceName: string, data: any[]) {
      this.resources[resourceName].data.list = data;
    },
    // CRUD and State Management Actions
    async create({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, CREATE, resourceName, payload);
    },
    async delete({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, DELETE, resourceName, payload);
    },
    async deleteMany({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, DELETE_MANY, resourceName, payload);
    },
    async get({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, GET, resourceName, payload);
    },
    async getList({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, GET_LIST, resourceName, payload);
    },
    async getNodes({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, GET_NODES, resourceName, payload);
    },
    async getOne({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, GET_ONE, resourceName, payload);
    },
    async getTree({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, GET_TREE, resourceName, payload);
    },
    async lock({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, LOCK, resourceName, payload);
    },
    async unlock({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, UNLOCK, resourceName, payload);
    },
    async moveNode({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, MOVE_NODE, resourceName, payload);
    },
    async update({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, UPDATE, resourceName, payload);
    },
    async updateMany({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return await handleApiCall.call(this, UPDATE_MANY, resourceName, payload);
    },
    showSuccess(
      resource: IState,
      { action, params, data }: { action: string; params: any; data: any }
    ) {
      const appStore = useAppStore();
      const resourceConfig = resource.resource as ResourceConfig;

      const messages = {
        [CREATE]: "va.messages.created",
        [DELETE]: "va.messages.deleted",
        [DELETE_MANY]: "va.messages.deletedMany",
        [GET]: "va.messages.fetched",
        [GET_LIST]: "va.messages.fetched",
        [GET_NODES]: "va.messages.fetched",
        [GET_ONE]: "va.messages.fetched",
        [GET_TREE]: "va.messages.fetched",
        [UPDATE]: "va.messages.updated",
        [UPDATE_MANY]: "va.messages.updatedMany",
        [LOCK]: "va.messages.locked",
        [UNLOCK]: "va.messages.unlocked",
      };

      const getMessage = (actionKey: string, extras: any = {}) => {
        const baseMessage = messages[actionKey];
        if (!baseMessage) return "";

        const count = data?.length || 1;
        const singularOrPlural = resourceConfig.getName?.(count).toLowerCase();

        return translate(baseMessage, {
          resource: singularOrPlural,
          id: params.id,
          count,
          ...extras,
        });
      };

      // Check if notifications should be shown for this action
      if (
        !resourceConfig.notifications ||
        resourceConfig.notifications["all"] ||
        resourceConfig.notifications[action]
      ) {
        let message = "";
        if ([CREATE, UPDATE].includes(action)) {
          message = `<a class="mt-2" href="/${resourceConfig
            .getName?.(1)
            .toLowerCase()}/${data.id}">Open ${
            data.name || data.title || data.id
          }</a>`;
        }

        appStore.showToast({
          severity: "success",
          summary: getMessage(action),
          message,
        });
      }
    },
    showError(resource: IState, summary: string, message: string) {
      const appStore = useAppStore();
      const resourceConfig = resource.resource;

      // Check if error notifications are enabled
      if (
        !resourceConfig.notifications ||
        resourceConfig.notifications["error"] === true
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
    getDataItem: (state) => (resourceName: string) =>
      state.resources[resourceName]?.data.item,
    getDataList: (state) => (resourceName: string) =>
      state.resources[resourceName]?.data.list,
    getLoading: (state) => (resourceName: string) =>
      state.resources[resourceName]?.loading,
    getResource: (state) => (resourceName: string) =>
      state.resources[resourceName]?.resource,
    getResourceData: (state) => (resourceName: string) =>
      state.resources[resourceName],
    getResourceList: (state) => (resource: string) => {
      const r = Object.values(state.resources).find(
        (r) => r.resource.name === resource
      );
      return r ? r.data.list : [];
    },
    getResourcesAsObject(): any {
      const obj: any = {};
      Object.entries(this.resources).forEach(([key, r]) => {
        obj[key] = r.data.list;
      });
      return obj;
    },
  },
});

export default useResourceStore;
