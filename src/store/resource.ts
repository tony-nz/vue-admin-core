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
    default:
      break;
  }
}

const useResourceStore = function (resource) {
  if (!resource.name) {
    throw new Error(translate("errors.missingResourceName"));
  }
  const storeName = "Resource" + upperCaseFirst(resource.name);

  Object.values(methods).forEach(
    (action) =>
      (storeActions[action] = async (payload) => {
        const appStore = useAppStore();
        const resourceStore = useResourceStore(resource)();

        try {
          let params = payload?.params ? payload.params : {};

          /**
           * Set loading for certain methods
           */
          if ([GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE].includes(action)) {
            appStore.setApiLoading(true);
          }

          /**
           * Set params.id to state.item.id if action
           * is UPDATE and params.id is not set
           */
          if (action === UPDATE && !params.id) {
            params.id = resourceStore.data.item.id;
          }

          /**
           * Check action and return correct params
           */
          params = [DELETE, GET_ONE, UPDATE].includes(action)
            ? params.id
            : params;

          const newApiUrl = payload?.apiUrl
            ? payload?.apiUrl
            : resourceStore.resource.apiUrl;

          let response = await ApiService[
            [GET_LIST, GET_NODES, GET_ONE, GET_TREE].includes(action)
              ? "get"
              : action
          ](
            getApiUrl(newApiUrl, action, payload),
            params,
            action === UPDATE ? payload.params : null
          ).catch((response) => {
            return Promise.reject(response);
          });

          // if the response contains a data object, use that,
          // otherwise use the response itself
          const data = response.data?.data?.data
            ? response.data.data.data
            : response.data.data;

          /**
           * Process data into store for caching
           * and referencing
           */
          processStoreData(resourceStore, action, payload, data);

          /**
           * Set loading to false
           * and show success message
           */
          appStore.setApiLoading(false);
          resourceStore.showSuccess(resourceStore, { action, params, data });

          /**
           * Return response data if it exists
           */
          if (response.data?.data) {
            return Promise.resolve(response.data);
          }

          return Promise.resolve(response);
        } catch (e: any) {
          const message = e.response?.data?.message || false;
          appStore.setApiLoading(false);
          resourceStore.showError(resourceStore, e.message, message);
          return Promise.reject(e);
        }
      })
  );
  stores[storeName] = defineStore({
    id: storeName,
    state: (): IState => ({
      data: {
        item: {},
        list: [],
      },
      loading: false,
      resource,
    }),
    actions: {
      ...storeActions,
      setItem(state, item) {
        state.data.item = item;
      },
      setList(state, data) {
        state.data.list = data;
      },
      showSuccess(state, { action, params, data }): any {
        const appStore = useAppStore();
        const messages = {
          [CREATE]: translate("va.messages.created", {
            resource: resource.getName(1),
          }),
          [DELETE]: translate("va.messages.deleted", {
            resource: resource.getName(1),
            id: params,
          }),
          [DELETE_MANY]: translate("va.messages.deletedMany", {
            resource: resource.getName(data.length).toLowerCase(),
            count: data?.length ? data.length : 1,
          }),
          [GET]: translate("va.messages.fetched", {
            resource: resource.getName(data.length).toLowerCase(),
            count: data?.length ? data.length : 1,
          }),
          [GET_LIST]: translate("va.messages.fetched", {
            resource: resource.getName(data.length).toLowerCase(),
            count: data?.length ? data.length : 1,
          }),
          [GET_NODES]: translate("va.messages.fetched"),
          [GET_ONE]: translate("va.messages.fetched", {
            resource: resource.getName(1),
            id: params,
          }),
          [GET_TREE]: translate("va.messages.fetched"),
          [UPDATE]: translate("va.messages.updated", {
            resource: resource.getName(1),
            id: params,
          }),
          [UPDATE_MANY]: translate("va.messages.updatedMany", {
            resource: resource.getName(data.length).toLowerCase(),
            count: data?.length ? data.length : 1,
          }),
        };
        if (
          !state.resource.notifications ||
          state.resource.notifications["all"] ||
          state.resource.notifications[action]
        ) {
          appStore.showToast({
            severity: "success",
            summary: messages[action],
          });
        }
      },
      showError(state, summary, message): any {
        const appStore = useAppStore();
        if (
          !state.resource.notifications ||
          state.resource.notifications["error"] === true
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
      getDataItem(): any {
        return this.data.item;
      },
      getDataList(): any {
        return this.data.list;
      },
      getResource(): ResourceConfig {
        return this.resource;
      },
      getLoading(): boolean {
        return this.loading;
      },
    },
  });

  return stores[storeName];
};

export default useResourceStore;
