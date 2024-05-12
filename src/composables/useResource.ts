import ApiService from "../core/services/ApiService";
import ResourceType from "../core/types/ResourceConfigTypes";
import useResourceStore from "../store/resource";
import { useRoute } from "vue-router";
import { upperCaseFirst } from "../core/helpers/functions";
import { useConfirm } from "primevue/useconfirm";
import { computed, Ref, ref, toRef, onMounted } from "vue";

interface Options {
  dataFilters?: object;
  params?: object | any;
}

export default function useResource(
  resource: ResourceType | undefined,
  dtFilters: Ref<any>,
  dtProps: any,
  options?: Options | undefined
) {
  const confirmDelete = useConfirm();
  const apiUrl = ref();
  const filters = ref(dtFilters);
  const props = ref(dtProps);
  const modalData = ref([]);
  const modalType = ref();
  const resourceData = ref();
  const resourceName = resource?.name
    ? upperCaseFirst(resource.name)
    : undefined;
  const route = useRoute();
  const routeId = ref(route?.params?.id);
  const showModal = ref(false);
  const showSidebar = ref(false);
  const stateList = ref();
  const stateUser = ref(false);
  const isLoading = ref(true);
  const resourceStore = useResourceStore(resource)();

  const searchableColumns = ref(
    props.searchableColumns || extractIds(resource?.fields)
  );
  const lazyParams: Ref<any> = ref({});
  const totalRecords = ref(0);

  function extractIds(obj: any): string[] {
    let ids: string[] = [];

    // Base case: if obj is a field with an id property
    if (obj && obj.id) {
      ids.push(obj.id);
    }

    // Recursive case: if obj has children or fields
    if (obj.children) {
      obj.children.forEach((child: any) => {
        ids = ids.concat(extractIds(child));
      });
    } else if (obj.fields) {
      obj.fields.forEach((field: any) => {
        ids.push(field.id);
      });
    }

    return ids;
  }

  const onPage = (event) => {
    lazyParams.value = event;
    // lazyParams.value.filters = filters.value;
    getResourceData();
  };
  const onSort = (event) => {
    lazyParams.value = event;
    getResourceData();
  };
  const onFilter = () => {
    lazyParams.value.filters = filters.value;
    //Reset pagination first
    lazyParams.value.originalEvent = { first: 0, page: 0 };
    onPage(lazyParams.value);
    getResourceData();
  };

  function create(params: unknown, subId?: number, vStateUser?: boolean) {
    if (params && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .create({
            params,
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            stateList: stateList.value,
            stateUser: vStateUser ? vStateUser : stateUser.value,
            subId: subId,
          })
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  function update(params, id, subId?: number, vStateUser?: boolean) {
    if (params && id && resourceName) {
      params.id = id;
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .update({
            params,
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            stateList: stateList.value,
            stateUser: vStateUser ? vStateUser : stateUser.value,
            subId: subId,
          })
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  function remove(id, subId?: number, vStateUser?: boolean) {
    if (id && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .delete({
            params: { id },
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            stateList: stateList.value,
            stateUser: vStateUser ? vStateUser : stateUser.value,
            subId: subId,
          })
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  function bulkRemove(data, subId?: number, vStateUser?: boolean) {
    if (data && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .deleteMany({
            params: { data },
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            stateList: stateList.value,
            stateUser: vStateUser ? vStateUser : stateUser.value,
            subId: subId,
          })
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  function showDeletePopup(params) {
    if (resource && params.$event) {
      confirmDelete.require({
        group:
          "DT_" +
          upperCaseFirst(
            resourceName
              ? resourceName
              : (Math.random() + 1).toString(36).substring(7)
          ),
        target: params.$event.currentTarget,
        message: "Are you sure you want to proceed?",
        acceptClass: "bg-primary-500",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          if (params.data?.id) {
            remove(params.data.id, params?.id ? params.id : null);
          } else {
            bulkRemove(params.selectedResources, params?.id ? params.id : null);
          }
        },
        reject: () => {
          //
        },
      });
    }
  }

  function showCreateEdit(display, type, data = []) {
    modalType.value = type;
    modalData.value = data;
    if (display === "dialog") {
      showModal.value = true;
    } else if (display === "sidebar") {
      showSidebar.value = true;
    }
  }

  function closeModal() {
    showModal.value = false;
  }

  function closeSidebar() {
    // store.dispatch("appResource/closeSidebar");
    showSidebar.value = false;
  }

  function getResourceFields(stateList, fullObject = false) {
    if (resource) {
      if (resource.lists && stateList) {
        const index = resource.lists.findIndex((i) => {
          return i.name === stateList;
        });
        if (fullObject) {
          return resource.lists[index].fields;
        }
        return resource.lists[index]?.fields?.[0]?.children?.[0].fields;
      }
      if (fullObject) {
        return resource.fields;
      }
      return resource.fields?.[0]?.children?.[0].fields;
    }
  }

  async function getResourceData() {
    if (resource?.name) {
      lazyParams.value.filters = filters.value;
      if (!lazyParams.value.sortField) {
        lazyParams.value.sortField = props.defaultSortField || "id";
        // lazyParams.value.sortField = toRef(props, "defaultSortField").value;
      }
      if (![-1, 1].includes(lazyParams.value.sortOrder)) {
        lazyParams.value.sortOrder = props.defaultSortDesc ? -1 : 1;
      }
      const params = {
        // ...lazyParams.value,
        //   ...options?.params,
        force: true, // bypass cache
        dt_params: JSON.stringify(lazyParams.value),
        searchable_columns: JSON.stringify(searchableColumns.value),
      };

      // if (apiUrl) {
      //   resourceData.value = await ApiService.get(apiUrl).then(({ data }) => {
      //     return data.data;
      //   });
      // } else {}
      // }
      isLoading.value = true;
      await resourceStore
        .getList({
          params: params,
          routeId: routeId.value,
          apiUrl: apiUrl.value,
          stateList: stateList.value,
          stateUser: stateUser.value,
        })
        .then((data) => {
          totalRecords.value = data.data.total;
          isLoading.value = false;
          resourceData.value = data.data.data;
          console.log("data", data);
          return data.data;
        })
        .catch((e) => {
          totalRecords.value = 0;
          isLoading.value = false;
        });
    }
  }

  onMounted(() => {
    //
  });

  return {
    apiUrl,
    bulkRemove,
    create,
    lazyParams,
    modalData,
    modalType,
    isLoading,
    remove,
    resource,
    route,
    routeId,
    showModal,
    showSidebar,
    stateList,
    stateUser,
    update,
    getResourceData,
    getResourceFields,
    showCreateEdit,
    showDeletePopup,
    closeModal,
    closeSidebar,
    resourceData,
    searchableColumns,
    onPage,
    onSort,
    onFilter,
    totalRecords,
  };
}
