import ResourceType from "../core/types/ResourceConfigTypes";
import useResourceStore from "../store/resource";
import { useRoute } from "vue-router";
import { upperCaseFirst } from "../core/helpers/functions";
import { useConfirm } from "primevue/useconfirm";
import { Ref, ref } from "vue";

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
    if (resource?.lazy) {
      lazyParams.value = event;
      // lazyParams.value.filters = filters.value;
      console.log("onPage");
      getResourceData();
    }
  };
  const onSort = (event) => {
    if (resource?.lazy) {
      lazyParams.value = event;
      console.log("onSort");
      getResourceData();
    }
  };
  const onFilter = () => {
    if (resource?.lazy) {
      lazyParams.value.filters = filters.value;
      //Reset pagination first
      lazyParams.value.originalEvent = { first: 0, page: 0 };
      onPage(lazyParams.value);
      console.log("onFilter");
      getResourceData();
    }
  };

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
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

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
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

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
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

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
    }
  }

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
    lazyParams,
    modalData,
    modalType,
    isLoading,
    remove,
    resource,
    route,
    routeId,
    showModal,
    update,
    getResourceData,
    getResourceFields,
    showCreateEdit,
    showDeletePopup,
    resourceData,
    searchableColumns,
    onPage,
    onSort,
    onFilter,
    totalRecords,
  };
}
