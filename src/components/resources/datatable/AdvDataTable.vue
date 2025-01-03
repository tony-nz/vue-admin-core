<template>
  <DataTable
    v-bind="dtOptions"
    v-model:expandedRows="expandedRows"
    v-model:filters="filters"
    v-model:selection="selectedResources"
    @filter="onFilter"
    @page="onPage"
    @onRowExpand="onLocalRowExpand"
    @sort="onSort"
    :loading="options?.loading ? isLoading : false"
    :totalRecords="totalRecords"
    :value="resourceData"
    :state-key="stateKey"
    state-storage="session"
  >
    <template v-if="toolbar?.visible" #header>
      <AdvToolbar
        @clearSearch="clearSearch"
        @refresh="getResourceData"
        @createEdit="showCreateEdit"
        @delete="showDeletePopup"
        :filters="filters"
        :modalData="modalData"
        :onFilter="onFilter"
        :resource="resource"
        :selectedResources="selectedResources"
        :toolbar="toolbar"
      />
    </template>
    <Column
      v-if="options?.columns?.select"
      v-model:selection="selectedResources"
      selectionMode="multiple"
      headerStyle="width: 3em"
    />
    <slot name="columns">
      <div
        v-for="field in getResourceFields(resource.fields)"
        v-bind:key="field.id"
      >
        <Column :field="field.id" :header="field.label" :sortable="true" />
      </div>
    </slot>
    <Column v-if="options?.columns?.actions" :exportable="false" class="w-24">
      <template #body="{ data }">
        <ActionColumn
          :data="data"
          :fields="resource.fields"
          :resource="resource"
          :showDefaults="options.actions?.enabled"
          @deletePopup="showDeletePopup"
          @showCreateEdit="showCreateEdit"
        >
          <template v-slot:actionCol="slotProps">
            <slot name="actionCol" :data="slotProps.data" />
          </template>
        </ActionColumn>
      </template>
    </Column>
    <template #expansion="slotProps">
      <slot name="expansion" v-bind:slotProps="slotProps" />
    </template>
    <template #empty>
      <div
        v-if="isLoading"
        class="inline-flex items-center px-4 py-2 leading-6 text-sm text-slate-900 transition ease-in-out duration-150"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="#000000"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
      <div v-else>No records found</div>
    </template>
  </DataTable>
  <ConfirmPopup :group="'DT_' + upperCaseFirst(resource.name)">
    <template #message="slotProps">
      <div class="flex p-4">
        <i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
        <p class="pl-2">{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmPopup>
  <CreateUpdateDialog
    v-if="showModal && resource"
    @close="showModal = false"
    @liveData="emitLiveData"
    :data="modalData"
    :hidden="form.hidden"
    :fields="getResourceFields(resource.fields)"
    :type="modalType"
    :primaryKey="resource.primaryKey ? resource.primaryKey : 'id'"
    :resource="resource"
    :subId="params?.id ? params.id : null"
  />
  <template v-if="!resource">
    <span>Missing resource prop</span>
  </template>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRef,
  watch,
} from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import {
  TableOptions,
  ToolbarOptions,
} from "../../../core/types/DatatableTypes";
import { translate, upperCaseFirst } from "../../../core/helpers/functions";
import { useDebounce } from "../../../composables/useDebounce";
import ActionColumn from "./partials/ActionColumn.vue";
import AdvToolbar from "./partials/AdvToolbar.vue";
import CreateUpdateDialog from "../partials/CreateUpdateDialog.vue";
import ResourceType from "../../../core/types/ResourceConfigTypes";
import useResource from "../../../composables/useResource";
import useResourceStore from "../../../store/resource";

export interface Form {
  data: Object;
  hidden: Array<string>;
}

export default defineComponent({
  name: "AdvDataTable",
  components: {
    ActionColumn,
    AdvToolbar,
    CreateUpdateDialog,
  },
  props: {
    apiUrl: {
      type: String,
      required: false,
    },
    filters: {
      type: Object,
    },
    form: {
      type: Object as PropType<Form>,
      default: () => ({
        data: {},
        hidden: [],
      }),
    },
    options: {
      type: Object as PropType<TableOptions>,
      required: false,
    },
    params: {
      type: Object,
    },
    refresh: {
      type: String,
    },
    resource: {
      type: Object as PropType<ResourceType>,
      required: true,
    },
    routeId: {
      type: String,
    },
    toolbar: {
      type: Object as () => ToolbarOptions,
      required: true,
    },
  },
  inheritAttrs: false,
  setup(props, { emit, attrs }) {
    const debounce = useDebounce();
    const expandedRows = ref([] as unknown[]);
    const refresh = toRef(props, "refresh");
    const selectedResources = ref();
    const stateKey = ref("dt-" + props.resource.name + "-state:");
    const store = useResourceStore();

    /**
     * Reactive resource data
     */
    const resourceData = computed(() => {
      const dataList: any = store.getDataList(props.resource.name);

      if (props.resource.lazy) {
        return dataList.data;
      }

      return dataList;
    });

    /**
     * Filters
     * @type {Ref<Record<string, { value: any; matchMode: FilterMatchMode }>>}
     */
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ...props.resource.datatable?.filters,
      ...props.filters,
    });

    /**
     * Datatable options
     * @type {Ref<Options>}
     */
    const dtOptions = {
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [10, 25, 50, 100],
      paginatorTemplate:
        "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
      currentPageReportTemplate: "Showing {first} to {last} of {totalRecords}",
      first: 0,
      ...attrs,
    };

    /**
     * Resource data
     */
    const {
      apiUrl,
      getResourceData,
      getResourceFields,
      isLoading,
      lazyParams,
      modalData,
      modalType,
      onFilter,
      onPage,
      onSort,
      routeId,
      showCreateEdit,
      showDeletePopup,
      showModal,
      totalRecords,
    } = useResource(props.resource, filters, props);
    const { canAction } = props.resource;

    /**
     * Clear search
     */
    const clearSearch = () => {
      filters.value.global.value = null;
      getResourceData();
    };

    /**
     * Emit live data
     * @param data
     */
    const emitLiveData = (data: any) => {
      emit("liveData", data);
    };

    /**
     * Lazy load resource data
     */
    const lazyLoad = () => {
      lazyParams.value = JSON.parse(
        sessionStorage.getItem(stateKey.value as string) as string
      );
      if (!lazyParams.value) {
        lazyParams.value = {
          first: 0,
          filters: filters.value,
          rows: dtOptions.rows || 10,
        };
      }
      lazyParams.value.page = Math.fround(
        parseInt(lazyParams.value.first) / parseInt(lazyParams.value.rows || 10)
      );
    };

    /**
     * On local row expand
     * @param event
     * @returns {void}
     */
    const onLocalRowExpand = (event) => {
      const resource = resourceData.value.find(
        (item) => item.id == event.data.id
      );
      expandedRows.value = [resource];
    };

    onMounted(async () => {
      // Set apiUrl if provided
      if (props.apiUrl) {
        apiUrl.value = props.apiUrl;
      }
      // Set routeId if provided
      if (props.routeId) {
        routeId.value = props.routeId;
      }
      // Merge form data if available
      if (props.form?.data) {
        modalData.value = { ...props.form.data, ...modalData.value };
      }
      // Lazy load if resource is set to lazy
      if (props.resource.lazy) {
        lazyLoad();
      }
      // Fetch resource data after all conditions are checked
      getResourceData();
    });

    /**
     * Watch for new prop data
     */
    watch(
      () => props.form?.data,
      async (newData: any) => {
        modalData.value = newData;
      },
      { deep: true }
    );

    watch(refresh, (val) => {
      getResourceData();
    });

    watch(
      () => props.filters,
      (newFilters) => {
        filters.value = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          ...props.resource.datatable?.filters,
          ...newFilters,
        };
      },
      { deep: true, immediate: true }
    );

    return {
      canAction,
      clearSearch,
      debounce,
      dtOptions,
      emitLiveData,
      expandedRows,
      filters,
      getResourceData,
      getResourceFields,
      isLoading,
      modalData,
      modalType,
      onFilter,
      onLocalRowExpand,
      onPage,
      onSort,
      resourceData,
      selectedResources,
      showCreateEdit,
      showDeletePopup,
      showModal,
      stateKey,
      totalRecords,
      translate,
      upperCaseFirst,
      useDebounce,
    };
  },
});
</script>
