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
}

// Helper for URL manipulation
function getApiUrl(apiUrl: string, action: string, params: any): string {
  const replaceUrlId = (url: string, id: any) => url.replace(":id", id ?? "");
  const id = params?.routeId ?? params?.subId ?? null;
  apiUrl = replaceUrlId(apiUrl, id);

  if (action.toLowerCase() === "getone") {
    return `${apiUrl}/${params.id ?? ""}`;
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
      state.data.list.push(data);
      break;

    case DELETE:
      state.data.list = state.data.list.filter((item) => item.id !== params.id);
      break;

    case DELETE_MANY:
      if (params.values) {
        state.data.list = state.data.list.filter(
          (item) => !params.values.includes(item.id)
        );
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
      const itemIndex = state.data.list.findIndex(
        (item) => item.id === params.id
      );
      if (itemIndex !== -1) {
        state.data.list[itemIndex] = { ...state.data.list[itemIndex], ...data };
        store.setItem(resourceName, data);
      }
      break;

    case LOCK:
    case UNLOCK:
      if (params.id) {
        const item = state.data.list.find((item) => item.id === params.id);
        if (item) item.locked = action === LOCK;
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
  const resource = this.resources[resourceName];
  const loadingActions = [GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE];

  try {
    let params = payload?.params || {};
    if (action === UPDATE && !params.id) params.id = resource.data.item.id;

    const apiUrl = payload?.apiUrl || resource.resource.apiUrl;
    // add routeId and subId to params
    params.routeId = payload?.routeId;
    params.subId = payload?.subId;

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
        getApiUrl(apiUrl, action, params),
        params.id ? params.id : null
      );
    } else if (apiMethod === "create") {
      // For CREATE and UPDATE, pass the URL and params
      response = await ApiService[apiMethod](
        getApiUrl(apiUrl, action, params),
        params
      );
    } else if (apiMethod === "update") {
      // For CREATE and UPDATE, pass the URL and params
      response = await ApiService[apiMethod](
        getApiUrl(apiUrl, action, params),
        params.id ? params.id : null,
        params
      );
    } else {
      // For GET, GET_LIST, GET_NODES, GET_ONE, GET_TREE
      response = await ApiService.get(
        getApiUrl(apiUrl, action, params),
        action === GET_ONE ? {} : params
      );
    }

    const data = response.data?.data?.data || response.data.data;

    processStoreData(this, resourceName, action, payload, data);

    appStore.setApiLoading(false);
    this.showSuccess(resource, { action, params, data });

    return data;
  } catch (error) {
    return handleError(appStore, this, resource, error);
  }
}

const useResourceStore = defineStore({
  id: "ResourceStore",
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
      return handleApiCall.call(this, CREATE, resourceName, payload);
    },
    async delete({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, DELETE, resourceName, payload);
    },
    async deleteMany({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, DELETE_MANY, resourceName, payload);
    },
    async get({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, GET, resourceName, payload);
    },
    async getList({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, GET_LIST, resourceName, payload);
    },
    async getNodes({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, GET_NODES, resourceName, payload);
    },
    async getOne({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, GET_ONE, resourceName, payload);
    },
    async getTree({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, GET_TREE, resourceName, payload);
    },
    async lock({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, LOCK, resourceName, payload);
    },
    async unlock({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, UNLOCK, resourceName, payload);
    },
    async moveNode({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, MOVE_NODE, resourceName, payload);
    },
    async update({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, UPDATE, resourceName, payload);
    },
    async updateMany({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      return handleApiCall.call(this, UPDATE_MANY, resourceName, payload);
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

export default useResourceStore;
