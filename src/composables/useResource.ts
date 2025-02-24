import { Ref, ref } from "vue";
import { Constraint, Filter } from "../core/types/FilterTypes";
import { upperCaseFirst } from "../core/helpers/functions";
import { useConfirm } from "primevue/useconfirm";
import { useRoute } from "vue-router";
import ResourceType from "../core/types/ResourceConfigTypes";
import useResourceStore from "../store/resource";

export default function useResource(resource: ResourceType, dtProps: any) {
  const apiUrl = ref();
  const dtRef = ref();
  const confirmDelete = useConfirm();
  const filters = ref();
  const formData = ref();
  const isLoading = ref(true);
  const lazyParams: Ref<any> = ref({});
  const modalData = ref([]);
  const modalType = ref();
  const props: any = ref(dtProps);
  const resourceStore = useResourceStore();
  const route = useRoute();
  const routeId = ref(route?.params?.id);
  const showModal = ref(false);
  const totalRecords = ref(0);

  /**
   * Set the resource name
   */
  const resourceName = resource.name;

  /**
   * Set the searchable columns
   */
  const searchableColumns = ref(
    props.searchableColumns || resource?.datatable?.globalFilterFields || []
  );

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
   * Bulk remove resources
   * @param data
   * @param dataId
   * @returns Promise<void>
   */
  async function bulkRemove(data: any, dataId?: number): Promise<void> {
    if (data && resourceName) {
      try {
        await resourceStore.deleteMany({
          resourceName,
          payload: {
            params: { data },
            routeId: dataId ? dataId : routeId.value,
            apiUrl: apiUrl.value,
          },
        });
      } catch (e) {
        console.error("Error bulk removing resources:", e);
      }
    }
  }

  /**
   * Create a new resource
   * @param params
   * @param dataId
   * @returns Promise<void>
   */
  async function create(params: unknown, dataId?: number): Promise<void> {
    if (params && resourceName) {
      try {
        const payload = {
          params,
          apiUrl: apiUrl.value,
        };

        if (dataId) {
          payload["routeId"] = dataId;
        } else if (routeId.value) {
          payload["routeId"] = routeId.value;
        }

        await resourceStore.create({
          resourceName,
          payload,
        });
      } catch (e) {
        console.error("Error creating resource:", e);
      }
    }
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
        // remove filter items if they are empty
        lazyParams.value.filters = cleanFilters(filters.value);
        // if filters is empty, remove filters
        if (Object.keys(lazyParams.value.filters).length === 0) {
          delete lazyParams.value.filters;
        }
        // sortField
        if (!lazyParams.value.sortField) {
          lazyParams.value.sortField = props.sortField || "id";
        }
        // sortOrder
        if (![-1, 1].includes(lazyParams.value.sortOrder)) {
          lazyParams.value.sortOrder = props.sortDesc ? -1 : 1;
        }
        // rows
        lazyParams.value.rows = resource.datatable?.rows || 10;
        const params = {
          lazy: true,
          dt_params: JSON.stringify(lazyParams.value),
        };

        if (addSearchableColumns()) {
          params["searchable_columns"] = JSON.stringify(
            searchableColumns.value
          );
        }

        try {
          const response = await resourceStore.getList({
            resourceName,
            payload: {
              params: params,
              routeId: routeId.value,
              apiUrl: apiUrl.value,
            },
          });

          if (response.total) {
            totalRecords.value = response.total;
          } else if (response.data) {
            totalRecords.value = response.data.length;
          } else if (response.length) {
            totalRecords.value = response.length;
          }
        } catch (e) {
          totalRecords.value = 0;
          console.error("Error fetching resource list:", e);
        }
      } else {
        try {
          const response = await resourceStore.getList({
            resourceName,
            payload: {
              routeId: routeId.value,
              apiUrl: apiUrl.value,
            },
          });

          totalRecords.value = response.length;
        } catch (e) {
          totalRecords.value = 0;
          console.error("Error fetching resource list:", e);
        }
      }
      isLoading.value = false;
    }
  }

  /**
   * Remove a resource
   * @param id
   * @param dataId
   * @returns Promise<void>
   */
  async function remove(id: any, dataId?: number): Promise<void> {
    if (id && resourceName) {
      try {
        await resourceStore.delete({
          resourceName,
          payload: {
            params: { id },
            routeId: dataId ? dataId : routeId.value,
            apiUrl: apiUrl.value,
          },
        });
      } catch (e) {
        console.error("Error removing resource:", e);
      }
    }
  }

  /**
   * Update a resource
   * @param params
   * @param id
   * @param dataId
   * @returns Promise<void>
   */
  async function update(params: any, id: any, dataId?: number): Promise<void> {
    if (params && id && resourceName) {
      params.id = id;
      try {
        await resourceStore.update({
          resourceName,
          payload: {
            params,
            routeId: dataId ? dataId : routeId.value,
            apiUrl: apiUrl.value,
          },
        });
      } catch (e) {
        console.error("Error updating resource:", e);
      }
    }
  }

  /**
   * Add searchable columns
   * @returns string
   */
  function addSearchableColumns() {
    // check to see if cleanFilters(filters.value) has global filter
    const cleanedFilters = cleanFilters(filters.value);
    if (cleanedFilters.global) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Clean filters
   * @param filters
   * @returns { [key: string]: Filter }
   */
  function cleanFilters(filters: { [key: string]: Filter }): {
    [key: string]: Filter;
  } {
    const cleanedFilters: { [key: string]: Filter } = {};

    for (const [key, filter] of Object.entries(filters)) {
      let includeFilter = false;
      if (
        "value" in filter &&
        filter.value !== null &&
        filter.value !== undefined
      ) {
        includeFilter = true;
      } else if (Array.isArray(filter.constraints)) {
        const cleanedConstraints = (filter.constraints as Constraint[]).filter(
          (constraint) =>
            constraint.value !== null && constraint.value !== undefined
        );
        if (cleanedConstraints.length > 0) {
          includeFilter = true;
          cleanedFilters[key] = { ...filter, constraints: cleanedConstraints };
        }
      }
      if (includeFilter) {
        cleanedFilters[key] = cleanedFilters[key] || filter;
      }
    }

    return cleanedFilters;
  }
  // function cleanFilters(filters: { [key: string]: Filter }): {
  //   [key: string]: Filter;
  // } {
  //   const cleanedFilters: { [key: string]: Filter } = {};

  //   for (const [key, filter] of Object.entries(filters)) {
  //     // Check if value exists
  //     if (
  //       "value" in filter &&
  //       filter.value !== null &&
  //       filter.value !== undefined
  //     ) {
  //       if (Array.isArray(filter.constraints)) {
  //         // Clean constraints array
  //         const cleanedConstraints = (
  //           filter.constraints as Constraint[]
  //         ).filter(
  //           (constraint) =>
  //             constraint.value !== null && constraint.value !== undefined
  //         );

  //         if (cleanedConstraints.length > 0 || filter.operator) {
  //           cleanedFilters[key] = {
  //             ...filter,
  //             constraints: cleanedConstraints,
  //           };
  //         }
  //       } else {
  //         cleanedFilters[key] = filter;
  //       }
  //     } else if (Array.isArray(filter.constraints)) {
  //       // If value doesn't exist but constraints do, still include the filter if there are valid constraints or an operator
  //       const cleanedConstraints = (filter.constraints as Constraint[]).filter(
  //         (constraint) =>
  //           constraint.value !== null && constraint.value !== undefined
  //       );
  //       if (cleanedConstraints.length > 0 || filter.operator) {
  //         cleanedFilters[key] = {
  //           ...filter,
  //           constraints: cleanedConstraints,
  //         };
  //       }
  //     }
  //   }

  //   return cleanedFilters;
  // }

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
   * Show create/edit modal
   * @param display
   * @param type
   * @param data
   * @returns void
   */
  function showCreateEdit(display, type, data = []) {
    modalType.value = type;
    if (type === "update") {
      modalData.value = { ...formData.value, ...data };
    } else {
      // reset for create dialog
      modalData.value = { ...formData.value };
    }

    if (display === "dialog") {
      showModal.value = true;
    }
  }

  /**
   * Show delete popup
   * @param params
   * @returns void
   */
  function showDeletePopup(params) {
    if (resource && resource.name && params.$event) {
      confirmDelete.require({
        group: "DT_" + upperCaseFirst(resource.name),
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

  return {
    apiUrl,
    bulkRemove,
    create,
    dtRef,
    filters,
    formData,
    getResourceData,
    getResourceFields,
    isLoading,
    lazyParams,
    modalData,
    modalType,
    onFilter,
    onPage,
    onSort,
    remove,
    resource,
    route,
    routeId,
    searchableColumns,
    showCreateEdit,
    showDeletePopup,
    showModal,
    totalRecords,
    update,
  };
}
