import * as methods from "./enums/ResourceEnums";
import { defineStore } from "pinia";
import { translate, upperCaseFirst } from "../core/helpers/functions";
import { ResourceConfig } from "../core/types/ResourceConfigTypes";
import ApiService from "../core/services/ApiService";

interface IState {
  isLoading: boolean;
  name: string;
  resource: ResourceConfig;
  data: {
    // [key: string]: any;
    item: any;
    list: any;
    user: any;
    lastSync: Date | string;
  };
}

const storeActions = {};

const {
  GET,
  GET_LIST,
  GET_TREE,
  GET_NODES,
  GET_ONE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
  MOVE_NODE,
} = methods;

// /**
//  * Format the sub resource apiUrl to replace the
//  * primary :id with the route Id
//  */
function replaceUrlId(url, id) {
  let newApiUrl = url;
  if (url.includes(":id")) {
    newApiUrl = newApiUrl.replace(":id", id);
  }
  return newApiUrl;
}
// /**
//  * Function to figure out the correct apiUrl
//  */
function getApiUrl(state, apiUrl, action, payload) {
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

// /**
//  * Return the correct action params
//  */
function getParams(action, params) {
  if (action === "update") {
    return params.id;
  } else if (action === "create") {
    return params;
  } else if (action === "delete") {
    return params.id;
  } else if (action === "getOne") {
    return params.id;
  }
  return params;
}

// /**
//  * If the resource has custom lists,
//  * generate them
//  */
function generateStateLists(lists) {
  const newLists = {};
  if (lists) {
    lists.forEach((list) => {
      // newLists.push(list.name);
      newLists[list.name] = [];
    });
  }
  return newLists;
}

// /**
//  * Validate the action against ApiService
//  */
function validateAction(resource, action) {
  const errors: string[] = [];
  if (
    !ApiService[["get", "getOne", "getList"].includes(action) ? "get" : action]
  ) {
    errors.push("Data provider action " + action + " not implemented");
  }
  if (errors.length > 0) {
    // throw new Error(errors.toString());
    console.log(
      "The following errors have been found within the " +
        upperCaseFirst(resource.name) +
        " resource: \n" +
        errors
    );
  }
}
// const resource: any = {};
// const { name, apiUrl, userApiUrl, getName } = resource;

async function sendAction(state, action, payload?, userApiUrl?) {
  try {
    validateAction(state.resource, action);
    const params = payload?.params ? payload.params : {};
    const stateList = payload?.stateList ? payload.stateList : "";
    const stateUser = payload?.stateUser ? payload.stateUser : false;
    const currentDate = new Date();
    const futureDate = new Date();

    /**
     * Only set global loading when read actions
     */
    if ([GET, GET_LIST, GET_TREE, GET_NODES, GET_ONE].includes(action)) {
      state.setIsLoading(true);
      // store.commit("ApiModule/setLoading", true);
    }

    /**
     * Check to see if we have cached results within 5 or 1 minutes old?
     * TODO::Enum the following
     */
    futureDate.setMinutes(futureDate.getMinutes() - 1);

    /**
     * Check for cached store
     */
    if (
      (!params?.force &&
        !stateUser &&
        state.lastSync >= futureDate &&
        action === "getList") ||
      (!params?.force && !state.lastSync === null && action === "getList")
    ) {
      /**
       * Apply success message on writes operations
       */
      // dispatch("showSuccess", { action, params });
      // store.commit("ApiModule/setLoading", false);
      state.setIsLoading(false);
      // store.commit(
      //   `${upperCaseFirst(resource.name)}Resource/setIsLoading`,
      //   false
      // );
      if (stateList) {
        return {
          data: state.list[stateList],
        };
      }
      return {
        data: state.getDataList,
      };
    }

    /* Calling the setIsLoading mutation on the resource's module.
     * We want this after the cache to prevent false loading states
     */
    state.setIsLoading(true);
    // store.commit(
    //   `${upperCaseFirst(resource.name)}Resource/setIsLoading`,
    //   true
    // );

    try {
      try {
        if (!params?.id && action === "update") {
          params.id = state.item.id;
        }
      } catch (e) {
        // r
      }
      const newApiUrl = stateUser ? userApiUrl : state.resource.apiUrl;
      const response = await ApiService[
        ["get", "getOne", "getList"].includes(action) ? "get" : action
      ](
        getApiUrl(state, newApiUrl, action, payload), // generate apiUrl
        getParams(action, params),
        // params?.id ? params.id : "", // check resource for id, if so, add slug
        {
          locale: state.locale,
          ...params,
        }
      );
      const data = response.data?.data ? response.data.data : response.data;
      switch (action) {
        case "getList":
        case "getTree":
          // update lastSync time
          state.lastSync = currentDate.setMinutes(currentDate.getMinutes());
          // write response to list
          state.setList({
            stateList: stateList,
            stateUser: payload?.stateUser ? payload.stateUser : false,
            data: data,
          });
          // store.commit(`${upperCaseFirst(name)}Resource/setList`, {
          //   stateList: stateList,
          //   stateUser: payload?.stateUser ? payload.stateUser : false,
          //   data: data,
          // });
          break;
        case "getOne":
          // this is performed in resources helper
          // store.commit(
          //   `${upperCaseFirst(resource.name)}Resource/setItem`,
          //   data
          // );
          break;
        case "create":
          if (stateUser) {
            state.user.push(data);
          }
          if (stateList) {
            state.list[stateList].push(data);
          } else {
            state.list.push(data);
          }
          break;
        case "update":
          try {
            /**
             * Check for param Id
             */
            let stateListResource: string[] = [];
            if (stateUser) {
              stateListResource =
                params?.id && state.user
                  ? state.user.find((val) => val["id"] === params.id)
                  : null;
            } else {
              stateListResource =
                params?.id && state.list[stateList]
                  ? state.list[stateList].find((val) => val["id"] === params.id)
                  : null;
            }

            if (stateListResource) {
              // .every includes keys with false values
              Object.keys(data).forEach((key) => {
                if (stateListResource) {
                  if (
                    /* Creating a new instance of the stateListResource class. */
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
              state.setItem(data);
              // store.commit(
              //   `${upperCaseFirst(resource.name)}Resource/setItem`,
              //   data
              // );
            }
          } catch (e) {
            // TODO ERROR LOG
            console.log(e);
          }
          break;
        case "delete":
          if (params.id) {
            if (stateUser && state.user) {
              state.user.splice(
                state.user.map((item) => item.id).indexOf(params.id),
                1
              );
            } else {
              if (stateList) {
                state.list[stateList].splice(
                  state.list[stateList]
                    .map((item) => item.id)
                    .indexOf(params.id),
                  1
                );
              } else {
                state.list.splice(
                  state.list.map((item) => item.id).indexOf(params.id),
                  1
                );
              }
            }
          }
          break;
        case "deleteMany":
          if (params.values) {
            if (stateUser && state.user) {
              params.values.forEach((id) => {
                state.user.splice(state.user.map((item) => id).indexOf(id), 1);
              });
            } else {
              if (stateList) {
                params.values.forEach((id) => {
                  state.list[stateList].splice(
                    state.list[stateList].map((item) => id).indexOf(id),
                    1
                  );
                });
              } else {
                params.values.forEach((id) => {
                  state.list.splice(
                    state.list.map((item) => id).indexOf(id),
                    1
                  );
                });
              }
            }
          }
          break;
        default:
          break;
      }

      // GET,
      // GET_NODES,
      // GET_ONE,
      // UPDATE_MANY,
      // DELETE_MANY,
      // MOVE_NODE,
      state.isLoading = false;
      // store.commit(
      //   `${upperCaseFirst(resource.name)}Resource/setIsLoading`,
      //   false
      // );
      /**
       * Apply success message on writes operations
       */
      // dispatch("showSuccess", { action, params });
      // store.commit("ApiModule/setLoading", false);
      // TODO FIX THIS
      if (response.data?.data) {
        return Promise.resolve(response.data);
      }

      return Promise.resolve(response);
    } catch ({ status, message }) {
      console.log(message);
      // store.commit("LogModule/addLog", {
      //   log: "error",
      //   message: {
      //     message,
      //     url: window.location.href,
      //   },
      // });
      // store.dispatch("ToastModule/showToast", {
      //   severity: "danger",
      //   summary: "Error",
      //   message,
      // });

      return Promise.resolve(message);
    }
  } catch (e: any) {
    // store.commit("ApiModule/setLoading", false);
    // dispatch("showError", e.message);
    // dispatch("auth/checkError", e, {
    //   root: true,
    // });
    return Promise.reject(e);
  }
}

const stores = {};

const useResourceStore = function (resource) {
  const { name, apiUrl, userApiUrl, getName } = resource;
  const storeId = "Resource" + upperCaseFirst(resource.name);

  if (!stores[storeId]) {
    stores[storeId] = defineStore({
      id: "Resource" + upperCaseFirst(resource.name),
      state: (): IState => ({
        isLoading: false,
        name,
        resource,
        data: {
          item: "",
          list: [],
          user: [],
          lastSync: "",
        },
      }),
      actions: {
        getList(payload) {
          return sendAction(this, "getList", payload);
        },
        setItem(item) {
          if (item) {
            this.data.item = item;
          } else {
            this.showError("No item found");
          }
        },
        removeItem() {
          this.data.item = null;
        },
        setList(params) {
          if (params) {
            const data = params.data || null;
            const stateList = params.stateList || null;
            const stateUser = params.stateUser || null;
            if (stateUser && data) {
              this.data.user = data;
              this.data.lastSync = new Date();
            } else {
              if (stateList) {
                this.data.list[stateList] = data;
              } else {
                this.data.list = data;
              }
              this.data.lastSync = new Date();
            }
          } else {
            this.showError("No params found");
          }
        },
        removeList(params) {
          if (params) {
            const stateList = params.stateList || null;
            const stateUser = params.stateUser || null;
            if (stateUser) {
              this.data.user = null;
              this.data.lastSync = "";
            } else {
              if (stateList) {
                this.data.list[stateList] = null;
              } else {
                this.data.list = null;
              }
              this.data.lastSync = "";
            }
          } else {
            this.showError("No params found");
          }
        },
        setIsLoading(value) {
          if (value) {
            this.isLoading = value;
          } else {
            this.showError("No value found");
          }
        },
        showSuccess({ action, params }) {
          // const messages = {
          //   [CREATE]: () => translate("va.messages.created"),
          //   // translate("va.messages.created", {
          //   //   resource: getName(1),
          //   // }),
          //   [UPDATE]: () => translate("va.messages.updated"),
          //   // translate("va.messages.updated", {
          //   //   resource: getName(1),
          //   //   id: params.id,
          //   // }),
          //   [UPDATE_MANY]: () => translate("va.messages.updated_many"),
          //   // translate("va.messages.updated_many", {
          //   //   resource: getName(params.ids.length).toLowerCase(),
          //   //   count: params.ids.length,
          //   // })
          //   [DELETE]: () => translate("va.messages.deleted"),
          //   // translate("va.messages.deleted", {
          //   //   resource: getName(1),
          //   //   id: params.id,
          //   // }),
          //   [DELETE_MANY]: () => translate("va.messages.deleted_many"),
          //   // translate("va.messages.deleted_many", {
          //   //   resource: getName(params.ids.length).toLowerCase(),
          //   //   count: params.ids.length,
          //   // }),
          //   [MOVE_NODE]: () => translate("va.messages.moved"),
          //   // translate("va.messages.moved", {
          //   //   resource: getName(1),
          //   //   id: params.id,
          //   // }),
          // };
          // if (messages[action]) {
          //   store.commit("LogModule/addLog", {
          //     log: "success",
          //     message: {
          //       message: messages[action](),
          //       url: window.location.href,
          //     },
          //   });
          //   store.dispatch("ToastModule/showToast", {
          //     severity: "success",
          //     summary: "Success",
          //     message: messages[action](),
          //   });
          // }
        },
        showError(message) {
          // store.commit("LogModule/addLog", {
          //   log: "error",
          //   message: {
          //     message,
          //     url: window.location.href,
          //   },
          // });
          // store.dispatch("ToastModule/showToast", {
          //   severity: "danger",
          //   summary: "Error",
          //   message,
          // });
        },
        create(params) {
          // if (params) {
          //   const { name, api } = resource;
          //   const { data, stateList, stateUser } = params;
          //   this.setIsLoading(true);
          //   return api
          //     .create(data)
          //     .then((response) => {
          //       this.setIsLoading(false);
          //       this.setList(
          //         { getters },
          //         { data: response.data, stateList, stateUser }
          //       );
          //       this.showSuccess({ action: CREATE, params });
          //       return Promise.resolve(response.data);
          //     })
          //     .catch((error) => {
          //       this.setIsLoading(false);
          //       this.showError(error.message);
          //       return Promise.reject(error);
          //     });
          // } else {
          //   this.showError("No value found");
          // }
        },
      },
      getters: {
        getResource(): ResourceConfig {
          return this.resource;
        },
        getIsLoading(): boolean {
          return this.isLoading;
        },
        getDataItem(): any {
          return this.data.item;
        },
        getDataList(): any {
          return this.data.list;
        },
        getUserList(): any {
          return this.data.user;
        },
      },
    });
  }

  return stores[storeId];
};

export default useResourceStore;
