import { useRoute } from "vue-router";
import { upperCaseFirst } from "../core/helpers/functions";
import { useConfirm } from "primevue/useconfirm";
import { Ref, ref } from "vue";
import ResourceType from "../core/types/ResourceConfigTypes";
import useResourceStore from "../store/resource";

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
  const apiUrl = ref();
  const confirmDelete = useConfirm();
  const filters = ref(dtFilters);
  const isLoading = ref(true);
  const lazyParams: Ref<any> = ref({});
  const modalData = ref([]);
  const modalType = ref();
  const props: any = ref(dtProps);
  const resourceData = ref();
  const resourceStore = useResourceStore(resource)();
  const route = useRoute();
  const routeId = ref(route?.params?.id);
  const showModal = ref(false);
  const totalRecords = ref(0);

  /**
   * Set the resource name
   */
  const resourceName = resource?.name
    ? upperCaseFirst(resource.name)
    : undefined;

  /**
   * Set the searchable columns
   */
  const searchableColumns = ref(
    props.searchableColumns || extractIds(resource?.fields)
  );

  /**
   * Extract ids from fields
   * @param obj
   * @returns string[]
   */
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

  /**
   * Get data on page change
   * @param event
   */
  const onPage = (event) => {
    if (resource?.lazy) {
      lazyParams.value = event;
      getResourceData();
    }
  };

  /**
   * Sort data
   * @param event
   */
  const onSort = (event) => {
    if (resource?.lazy) {
      lazyParams.value = event;
      getResourceData();
    }
  };

  /**
   * Filter data
   * @returns void
   */
  const onFilter = () => {
    if (resource?.lazy) {
      // set filters
      lazyParams.value.filters = filters.value;
      // reset pagination first
      lazyParams.value.originalEvent = { first: 0, page: 0 };
      // call onPage to get data
      onPage(lazyParams.value);
    }
  };

  /**
   * Create a new resource
   * @param params
   * @param subId
   * @returns Promise<void>
   */
  function create(params: unknown, subId?: number) {
    if (params && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .create({
            params,
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            subId: subId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  /**
   * Update a resource
   * @param params
   * @param id
   * @param subId
   * @returns Promise<void>
   */
  function update(params, id, subId?: number) {
    if (params && id && resourceName) {
      params.id = id;
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .update({
            params,
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            subId: subId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  /**
   * Lock a resource
   * @param id
   * @param subId
   * @returns Promise<void>
   */
  function lock(id, subId?: number) {
    if (id && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .lock({
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            subId: subId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  /**
   * Unlock a resource
   * @param id
   * @param subId
   * @returns Promise<void>
   */
  function unlock(id, subId?: number) {
    if (id && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .unlock({
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            subId: subId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  /**
   * Remove a resource
   * @param id
   * @param subId
   * @returns Promise<void>
   */
  function remove(id, subId?: number) {
    if (id && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .delete({
            params: { id },
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            subId: subId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  /**
   * Bulk remove resources
   * @param data
   * @param subId
   * @returns Promise<void>
   */
  function bulkRemove(data, subId?: number) {
    if (data && resourceName) {
      return new Promise<void>((resolve, reject) => {
        resourceStore
          .deleteMany({
            params: { data },
            routeId: routeId.value,
            apiUrl: apiUrl.value,
            subId: subId,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  /**
   * Show delete popup
   * @param params
   * @returns void
   */
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

  /**
   * Show create/edit modal
   * @param display
   * @param type
   * @param data
   * @returns void
   */
  function showCreateEdit(display, type, data = []) {
    modalType.value = type;
    modalData.value = data;

    if (display === "dialog") {
      showModal.value = true;
    }
  }

  /**
   * Get resource fields
   * @param fields
   * @returns any
   */
  function getResourceFields(fields: any) {
    let allFields: any = [];

    function traverse(fields) {
      fields.forEach((field: any) => {
        if (field.fields) {
          traverse(field.fields);
        } else {
          allFields.push(field);
        }
      });
    }

    traverse(fields);
    return allFields;
  }

  /**
   * Get resource data
   * @returns Promise<void>
   */
  async function getResourceData() {
    if (resource?.name) {
      isLoading.value = true;

      /**
       * Check for resource.lazy
       */
      if (resource.lazy) {
        lazyParams.value.filters = filters.value;
        if (!lazyParams.value.sortField) {
          lazyParams.value.sortField = props.sortField || "id";
        }
        if (![-1, 1].includes(lazyParams.value.sortOrder)) {
          lazyParams.value.sortOrder = props.sortDesc ? -1 : 1;
        }
        const params = {
          lazy: true,
          dt_params: JSON.stringify(lazyParams.value),
          searchable_columns: JSON.stringify(searchableColumns.value),
        };

        await resourceStore
          .getList({
            params: params,
            routeId: routeId.value,
            apiUrl: apiUrl.value,
          })
          .then((response) => {
            totalRecords.value = response.data.total;
            resourceData.value = response.data.data;
            return response.data.data;
          })
          .catch((e) => {
            totalRecords.value = 0;
          });
      } else {
        await resourceStore
          .getList({
            routeId: routeId.value,
            apiUrl: apiUrl.value,
          })
          .then((response) => {
            resourceData.value = response.data;
            totalRecords.value = response.data.length;
            return response.data;
          })
          .catch((e) => {
            totalRecords.value = 0;
          });
      }
      isLoading.value = false;
    }
  }

  return {
    apiUrl,
    bulkRemove,
    create,
    getResourceData,
    getResourceFields,
    isLoading,
    lazyParams,
    lock,
    modalData,
    modalType,
    onFilter,
    onPage,
    onSort,
    remove,
    resource,
    resourceData,
    route,
    routeId,
    searchableColumns,
    showCreateEdit,
    showDeletePopup,
    showModal,
    totalRecords,
    unlock,
    update,
  };
}
