import ApiService from "../core/services/ApiService";
import ResourceType from "../core/types/ResourceConfigTypes";
import useResourceStore from "../store/resource";
import { useRoute } from "vue-router";
import { upperCaseFirst } from "../core/helpers/functions";
import { useConfirm } from "primevue/useconfirm";
import { computed, ref, onMounted } from "vue";

interface Options {
  dataFilters?: object;
  params?: object | any;
}

export default function useResource(
  resource: ResourceType | undefined,
  options?: Options | undefined
) {
  const confirmDelete = useConfirm();
  const apiUrl = ref();
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
  /*
   * Check for prop filters to filter the resource results
   * e.g. filters = { name: "Reading", id: 1 }
   */
  const resourceDataFiltered = computed(() => {
    const filters = ref(options?.dataFilters);
    
    if (filters.value && Object.keys(filters.value).length !== 0) {
      return resourceData.value?.data.filter((item) => {
        for (const key in filters.value) {
          if (filters.value[key] === true && item[key] !== null) {
            return true;
          }
          if (item[key] === undefined || item[key] != filters.value[key])
            return false;
        }
        return true;
      });
    }
    return resourceData.value?.data;
  });

  function create(params: unknown, subId?: number, vStateUser?: boolean) {
    if (params && resourceName) {
      resourceStore.create({
        params,
        routeId: routeId.value,
        apiUrl: apiUrl.value,
        stateList: stateList.value,
        stateUser: vStateUser ? vStateUser : stateUser.value,
        subId: subId,
      });
    }
  }

  function update(params, id, subId?: number, vStateUser?: boolean) {
    if (params && id && resourceName) {
      params.id = id;
      resourceStore.update({
        params,
        routeId: routeId.value,
        apiUrl: apiUrl.value,
        stateList: stateList.value,
        stateUser: vStateUser ? vStateUser : stateUser.value,
        subId: subId,
      });
    }
  }

  function remove(id, subId?: number, vStateUser?: boolean) {
    if (id && resourceName) {
      resourceStore.delete({
        params: { id },
        routeId: routeId.value,
        apiUrl: apiUrl.value,
        stateList: stateList.value,
        stateUser: vStateUser ? vStateUser : stateUser.value,
        subId: subId,
      });
    }
  }

  function bulkRemove(data, subId?: number, vStateUser?: boolean) {
    if (data && resourceName) {
      resourceStore.deleteMany({
        params: { data },
        routeId: routeId.value,
        apiUrl: apiUrl.value,
        stateList: stateList.value,
        stateUser: vStateUser ? vStateUser : stateUser.value,
        subId: subId,
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
    // if (apiUrl) {
    //   resourceData.value = await ApiService.get(apiUrl).then(({ data }) => {
    //     return data.data;
    //   });
    // } else {}
    // }
      resourceData.value = await resourceStore.getList({
        params: options?.params ? options?.params : null,
        routeId: routeId.value,
        apiUrl: apiUrl.value,
        stateList: stateList.value,
        stateUser: stateUser.value,
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
    resourceDataFiltered,
  };
}
