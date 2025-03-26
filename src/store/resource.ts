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
    list: any[] | { data: any[] };
  };
  loading: boolean;
  resource: ResourceConfig;
  lastUpdated: number;
  cacheTimeout?: ReturnType<typeof setTimeout>;
}

const useResourceStore = defineStore("ResourceStore", {
  state: () => ({
    resources: {} as Record<string, IState>,
  }),
  actions: {
    addResource(resourceName: string, resourceConfig: ResourceConfig) {
      if (!this.resources[resourceName]) {
        this.resources[resourceName] = {
          data: { item: null, list: [] },
          loading: false,
          resource: resourceConfig,
          lastUpdated: 0,
        };
      }
      return resourceName;
    },
    removeResource(resourceName: string) {
      if (this.resources[resourceName]) {
        const resource = this.resources[resourceName];
        if (resource.cacheTimeout) {
          clearTimeout(resource.cacheTimeout);
          resource.cacheTimeout = undefined;
        }
        resource.data.item = null;
        resource.data.list = [];
        resource.lastUpdated = 0;
      }
    },
    setItem(resourceName: string, item: any) {
      if (this.resources[resourceName]) {
        this.resources[resourceName].data.item = item;
      }
    },
    setList(resourceName: string, data: any[]) {
      if (this.resources[resourceName]) {
        const resource = this.resources[resourceName];
        if (resource.cacheTimeout) clearTimeout(resource.cacheTimeout);
        resource.data.list = data;
        if (resource.resource.cache) {
          resource.cacheTimeout = setTimeout(() => {
            resource.data.list = [];
            resource.data.item = null;
          }, 5 * 60 * 1000);
        }
      }
    },
    async create({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) {
        this.addResource(resourceName, payload.resource || {});
      }
      return await handleApiCall.call(this, CREATE, resourceName, payload);
    },
    async delete({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, DELETE, resourceName, payload);
    },
    async deleteMany({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, DELETE_MANY, resourceName, payload);
    },
    async get({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, GET, resourceName, payload);
    },
    async getList({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, GET_LIST, resourceName, payload);
    },
    async getNodes({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, GET_NODES, resourceName, payload);
    },
    async getOne({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, GET_ONE, resourceName, payload);
    },
    async getTree({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, GET_TREE, resourceName, payload);
    },
    async lock({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, LOCK, resourceName, payload);
    },
    async unlock({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, UNLOCK, resourceName, payload);
    },
    async moveNode({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, MOVE_NODE, resourceName, payload);
    },
    async update({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, UPDATE, resourceName, payload);
    },
    async updateMany({
      resourceName,
      payload,
    }: {
      resourceName: string;
      payload: any;
    }) {
      if (!this.resources[resourceName]) return;
      return await handleApiCall.call(this, UPDATE_MANY, resourceName, payload);
    },
    showSuccess(
      resource: IState,
      { action, params, data }: { action: string; params: any; data: any }
    ) {
      const appStore = useAppStore();
      const resourceConfig = resource.resource;

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

      if (
        !resourceConfig.notifications ||
        resourceConfig.notifications["all"] ||
        resourceConfig.notifications[action]
      ) {
        let message = "";
        if ([CREATE, UPDATE].includes(action) && data?.id) {
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
    cleanup() {
      Object.keys(this.resources).forEach((resourceName) => {
        const resource = this.resources[resourceName];
        if (resource?.cacheTimeout) {
          clearTimeout(resource.cacheTimeout);
        }
      });
      this.resources = {};
    },
  },
  getters: {
    getDataItem: (state) => (resourceName: string) =>
      state.resources[resourceName]?.data.item ?? null,
    getDataList: (state) => (resourceName: string) => {
      const list = state.resources[resourceName]?.data.list;
      return list ? (Array.isArray(list) ? list : list.data || []) : [];
    },
    getLoading: (state) => (resourceName: string) =>
      state.resources[resourceName]?.loading ?? false,
    getResource: (state) => (resourceName: string) =>
      state.resources[resourceName]?.resource ?? null,
    getResourceData: (state) => (resourceName: string) =>
      state.resources[resourceName] ?? null,
    getResourceList: (state) => (resourceName: string) => {
      const list = state.resources[resourceName]?.data.list;
      return list ? (Array.isArray(list) ? list : list.data || []) : [];
    },
    getResourcesAsObject: (state) => {
      const obj: Record<string, any[]> = {};
      Object.keys(state.resources).forEach((resourceName) => {
        const list = state.resources[resourceName]?.data.list;
        obj[resourceName] = list
          ? Array.isArray(list)
            ? list
            : list.data || []
          : [];
      });
      return obj;
    },
  },
});

function getApiUrl(
  apiUrl: string,
  action: string,
  params: Record<string, string | number | null>,
  routeId: string | null
): string {
  let url = apiUrl;
  if (routeId) {
    url = url.replace(":id", routeId);
  }

  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      url = url.replace(new RegExp(`:${key}(?=/|$)`), String(value));
    }
  }

  if (action.toLowerCase() === "getone" && params.id) {
    return `${url}/${params.id}`;
  }
  return url;
}

function processStoreData(
  store: any,
  resourceName: string,
  action: string,
  payload: any,
  data: any
) {
  const state = store.$state.resources[resourceName];
  if (!state) return;

  const params = payload?.params || {};
  const list: any[] = Array.isArray(state.data.list)
    ? state.data.list
    : state.data.list?.data || [];

  switch (action) {
    case CREATE:
      list.push(data);
      state.data.list = list;
      break;
    case DELETE:
      const deleteIndex = list.findIndex((item) => item.id === params.id);
      if (deleteIndex !== -1) {
        list.splice(deleteIndex, 1);
        state.data.list = list;
      }
      break;
    case DELETE_MANY:
      if (params.values) {
        state.data.list = list.filter(
          (item) => !params.values.includes(item.id)
        );
      }
      break;
    case GET:
    case GET_ONE:
      state.data.item = data;
      break;
    case GET_LIST:
    case GET_TREE:
      store.setList(resourceName, data);
      break;
    case UPDATE:
      const updateIndex = list.findIndex((item) => item.id === params.id);
      if (updateIndex !== -1) {
        list[updateIndex] = Object.assign(list[updateIndex], data);
        state.data.list = list;
        state.data.item = data;
      }
      break;
    default:
      console.warn(`Unhandled action in processStoreData: ${action}`);
  }
}

async function handleApiCall(
  this: ReturnType<typeof useResourceStore>,
  action: string,
  resourceName: string,
  payload: any
) {
  const appStore = useAppStore();
  const cacheValidity = 60000;
  const resource = this.$state.resources[resourceName];
  if (!resource) return;

  const loadingActions = [GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE];

  try {
    if (loadingActions.includes(action) && resource.resource.cache) {
      const listLength = Array.isArray(resource.data.list)
        ? resource.data.list.length
        : resource.data.list?.data.length || 0;
      if (
        resource.lastUpdated &&
        Date.now() - resource.lastUpdated < cacheValidity &&
        listLength > 0
      ) {
        return action === GET_ONE ? resource.data.item : resource.data.list;
      }
    }

    const params = payload?.params || {};
    if (action === UPDATE && !params.id) params.id = resource.data?.item.id;

    const apiUrl = payload?.apiUrl || resource.resource.apiUrl;
    const routeId = payload?.routeId || null;
    const apiMethod = loadingActions.includes(action)
      ? "get"
      : action.toLowerCase();

    if (loadingActions.includes(action)) appStore.setApiLoading(true);

    const url = getApiUrl(apiUrl, action, params, routeId);
    let response;

    switch (apiMethod) {
      case "delete":
        response = await ApiService.delete(url, params.id || null);
        break;
      case "create":
        response = await ApiService.create(url, params);
        break;
      case "update":
        response = await ApiService.update(url, params.id || null, params);
        break;
      default:
        response = await ApiService.get(url, action === GET_ONE ? {} : params);
    }

    const data = response.data.data;
    processStoreData(this, resourceName, action, payload, data);

    if (loadingActions.includes(action)) {
      resource.lastUpdated = Date.now();
    }
    appStore.setApiLoading(false);
    this.showSuccess(resource, { action, params, data });

    return data;
  } catch (error: unknown) {
    appStore.setApiLoading(false);
    const err = error as {
      message?: string;
      response?: { data?: { message?: string } };
    };
    this.showError(
      resource,
      err.message || "Error",
      err.response?.data?.message || "An error occurred"
    );
    throw error;
  }
}

export default useResourceStore;
