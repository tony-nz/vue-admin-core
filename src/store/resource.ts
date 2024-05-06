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
    lastSync: number;
    userList: any[];
  };
  loading: boolean;
  resource: ResourceConfig;
}

/**
 * Function to figure out the correct apiUrl
 */
function getApiUrl(state, apiUrl, action, payload) {
  const replaceUrlId = (url, id) => {
    return url.replace(":id", id);
  };
  const params = payload?.params ? payload?.params : {};
  const stateList = payload?.stateList ? payload?.stateList : null;
  const routeId = payload?.routeId ? payload?.routeId : null;
  const subId = payload?.subId ? payload?.subId : null;
  /**
   * Look up to see if we need to reference a
   * custom list apiUrl, or return the payload
   * apiUrl
   */
  if (stateList && state.resource.lists) {
    const index = state.resource.lists.findIndex((list) => {
      return list.name === stateList;
    });
    if (index >= 0) {
      return replaceUrlId(
        state.resource.lists[index].apiUrl,
        routeId ? routeId : subId
      );
    }
  } else if (payload?.apiUrl) {
    return replaceUrlId(payload.apiUrl, routeId ? routeId : subId);
  }

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
  const stateList = payload?.stateList ? payload.stateList : "";
  const stateUser = payload?.stateUser ? payload.stateUser : false;

  switch (action) {
    case CREATE:
      if (stateUser) {
        state.data.userList.push(data);
      } else {
        if (stateList) {
          state.data.list[stateList].push(data);
        } else {
          state.data.list.push(data);
        }
      }
      break;
    case DELETE:
      if (params.id) {
        if (stateUser && state.data.userList) {
          state.data.userList.splice(
            state.data.userList.map((item) => item.id).indexOf(params.id),
            1
          );
        } else {
          if (stateList) {
            state.data.list[stateList].splice(
              state.data.list[stateList]
                .map((item) => item.id)
                .indexOf(params.id),
              1
            );
          } else {
            state.data.list.splice(
              state.data.list.map((item) => item.id).indexOf(params.id),
              1
            );
          }
        }
      }
      break;
    case DELETE_MANY:
      if (params.values) {
        if (stateUser && state.data.userList) {
          params.values.forEach((id) => {
            state.data.userList.splice(
              state.data.userList.map((item) => id).indexOf(id),
              1
            );
          });
        } else {
          if (stateList) {
            params.values.forEach((id) => {
              state.data.list[stateList].splice(
                state.data.list[stateList].map((item) => id).indexOf(id),
                1
              );
            });
          } else {
            params.values.forEach((id) => {
              state.data.list.splice(
                state.data.list.map((item) => id).indexOf(id),
                1
              );
            });
          }
        }
      }
      break;
    case GET_LIST:
    case GET_TREE:
      // set list data
      state.setList(state, { data, stateList, stateUser });
      break;
    case GET_ONE:
      break;
    case MOVE_NODE:
      break;
    case UPDATE:
      /**
       * Check for param Id
       */
      let stateListResource: string[] = [];

      if (stateUser) {
        stateListResource =
          params?.id && state.data.userList
            ? state.data.userList.find((val) => val["id"] === params.id)
            : null;
      } else if (stateList) {
        stateListResource =
          params?.id && state.data.list[stateList]
            ? state.data.list[stateList].find((val) => val["id"] === params.id)
            : null;
      } else {
        stateListResource =
          params?.id && state.data.list
            ? state.data.list.find((val) => val["id"] === params.id)
            : null;
      }

      // go through resource and update any values that are not null
      if (stateListResource) {
        Object.keys(data).forEach((key) => {
          if (stateListResource) {
            if (
              stateListResource[key] ||
              stateListResource[key] === "" ||
              stateListResource[key] === null ||
              stateListResource[key] === false
            ) {
              stateListResource[key] = data[key];
            }
          }
        });
      }

      // don't overwrite the exisiting resource we're working with
      if (!stateUser) {
        state.setItem(state, data);
      }
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
          const stateList = payload?.stateList ? payload.stateList : "";
          const stateUser = payload?.stateUser ? payload.stateUser : false;
          const currentDate = new Date();
          const lastSync = resourceStore.getLastSync;
          const syncCheck = currentDate.getTime() - 60000;

          /**
           * Set loading for certain methods
           */
          if ([GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE].includes(action)) {
            appStore.setApiLoading(true);
          }

          /**
           * Check for cache
           */
          if (
            (!params?.force &&
              !stateUser &&
              lastSync > 0 &&
              lastSync < syncCheck &&
              action === "getList") ||
            (!params?.force && !lastSync === null && action === "getList") ||
            (!params?.force &&
              !stateUser &&
              currentDate.getTime() - lastSync < 10000 &&
              action === "getList")
          ) {
            appStore.setApiLoading(false);

            if (stateList && resourceStore.data.list[stateList].length > 0) {
              return Promise.resolve({
                data: resourceStore.data.list[stateList],
              });
            } else if (stateUser && resourceStore.data.userList.length > 0) {
              return Promise.resolve({
                data: resourceStore.data.userList,
              });
            }
            if (resourceStore.data.list.length > 0) {
              return Promise.resolve({
                data: resourceStore.data.list,
              });
            }
            return Promise.resolve({
              data: resourceStore.data.list,
            });
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

          const newApiUrl = stateUser
            ? payload?.apiUrl
              ? payload?.apiUrl
              : resourceStore.resource.apiUrl
            : resourceStore.resource.apiUrl;
          let response = await ApiService[
            [GET_LIST, GET_NODES, GET_ONE, GET_TREE].includes(action)
              ? "get"
              : action
          ](
            getApiUrl(resourceStore, newApiUrl, action, payload),
            params,
            action === UPDATE ? payload.params : null
          );

          // if the response contains a data object, use that,
          // otherwise use the response itself
          const data = response.data?.data ? response.data.data : response.data;

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
        }
      })
  );
  stores[storeName] = defineStore({
    id: storeName,
    state: (): IState => ({
      data: {
        item: {},
        lastSync: 0,
        list: [],
        userList: [],
      },
      loading: false,
      resource,
    }),
    actions: {
      ...storeActions,
      setItem(state, item) {
        this.data.item = item;
      },
      setList(state, { stateList, stateUser, data }) {
        if (stateUser && data) {
          state.data.userList = data;
          state.data.lastSync = Date.now();
        } else {
          if (stateList !== "") {
            state.data.list[stateList] = data;
          } else {
            state.data.list = data;
          }
          state.data.lastSync = Date.now();
        }
      },
      setLastSync(state, lastSync) {
        state.data.lastSync = lastSync;
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
          !this.resource.notifications ||
          this.resource.notifications["all"] ||
          this.resource.notifications[action]
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
          !this.resource.notifications ||
          this.resource.notifications["error"] === true
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
      getDataList(state): any {
        return state.data.list;
      },
      getDataUserList(): any {
        return this.data.userList;
      },
      getDataResource(): ResourceConfig {
        return this.resource;
      },
      getLastSync(): any {
        return this.data.lastSync;
      },
    },
  });

  return stores[storeName];
};

export default useResourceStore;
