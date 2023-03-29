import { defineStore } from "pinia";
import { translate, upperCaseFirst } from "../core/helpers/functions";
import { ResourceConfig } from "../core/types/ResourceConfigTypes";

import * as methods from "./enums/ResourceEnums";

import ApiService from "../core/services/ApiService";
import useApiStore from "./api";
import useLogStore from "./log";

const stores = {};
let storeActions = {};

/**
 * TODO
 * Rewrite state.whatever* to getters and setters...
 */

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
  const stateList = params?.stateList ? params.stateList : "";
  const stateUser = params?.stateUser ? params.stateUser : false;

  switch (action) {
    case CREATE:
      if (stateUser) {
        state.data.user.push(data);
      }
      if (stateList) {
        state.data.list[stateList].push(data);
      } else {
        state.data.list.push(data);
      }
      break;
    case DELETE:
      if (params.id) {
        if (stateUser && state.data.user) {
          state.data.user.splice(
            state.data.user.map((item) => item.id).indexOf(params.id),
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
        if (stateUser && state.data.user) {
          params.values.forEach((id) => {
            state.data.user.splice(
              state.data.user.map((item) => id).indexOf(id),
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
      // update lastSync time
      // state.lastSync = currentDate.setMinutes(currentDate.getMinutes());
      state.setLastSync(state, Date.now());

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
          params?.id && state.data.user
            ? state.data.user.find((val) => val["id"] === params.id)
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
      (storeActions[action] = async (state, payload, userApiUrl) => {
        const apiStore = useApiStore();
        const resourceStore = useResourceStore(resource)();

        try {
          let params = payload?.params ? payload.params : {};
          const stateList = params?.stateList ? params.stateList : "";
          const stateUser = params?.stateUser ? params.stateUser : false;
          const currentDate = new Date();

          /**
           * Set loading for certain methods
           */
          if ([GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE].includes(action)) {
            apiStore.setLoading(state, true);
          }

          /**
           * Set future date 1 minute(s) ago
           */
          currentDate.setMinutes(currentDate.getMinutes() - 1);

          /**
           * Check for cache
           */
          if (
            (!params?.force &&
              !stateUser &&
              resourceStore.getLastSync >= currentDate &&
              action === "getList") ||
            (!params?.force &&
              !resourceStore.getLastSync === null &&
              action === "getList")
          ) {
            apiStore.setLoading(state, false);

            if (stateList) {
              return Promise.resolve({
                data: resourceStore.data.list[stateList],
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
            params.id = resourceStore.item.id;
          }

          /**
           * Check action and return correct params
           */
          params = [DELETE, GET_ONE, UPDATE].includes(action)
            ? params.id
            : params;

          const newApiUrl = stateUser
            ? userApiUrl
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

          apiStore.setLoading(resourceStore, false);
          resourceStore.showSuccess(resourceStore, { action, params });

          /**
           * Return response data if it exists
           */
          if (response.data?.data) {
            return Promise.resolve(response.data);
          }

          return Promise.resolve(response);
        } catch (e: any) {
          apiStore.setLoading(resourceStore, false);
          resourceStore.showError(resourceStore, e.message);

          return Promise.reject(e);
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
      resource,
    }),
    actions: {
      ...storeActions,
      setItem(state, item) {
        state.data.item = item;
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
      showSuccess(state, { action, params }): any {
        const logStore = useLogStore();
        const messages = {
          [CREATE]: translate("va.messages.created"),
          [DELETE]: translate("va.messages.deleted"),
          [DELETE_MANY]: translate("va.messages.deletedMany"),
          [GET]: translate("va.messages.fetched"),
          [GET_LIST]: translate("va.messages.fetched"),
          [GET_NODES]: translate("va.messages.fetched"),
          [GET_ONE]: translate("va.messages.fetched"),
          [GET_TREE]: translate("va.messages.fetched"),
          [UPDATE]: translate("va.messages.updated"),
          [UPDATE_MANY]: translate("va.messages.updatedMany"),
        };
        // logStore.showToast({
        //   severity: "success",
        //   summary: messages[action],
        // });
      },
      showError(state, message): any {
        const logStore = useLogStore();
        logStore.showToast({
          severity: "error",
          summary: message,
        });
      },
    },
    getters: {
      getDataItem(): any {
        return this.data.item;
      },
      getDataList(): any {
        return this.data.list;
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
