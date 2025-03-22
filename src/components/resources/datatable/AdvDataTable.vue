<template>
  <DataTable
    v-bind="dtOptions"
    v-model:expandedRows="expandedRows"
    v-model:filters="filters"
    @filter="onFilter"
    @page="onPage"
    @onRowExpand="onLocalRowExpand"
    @sort="onSort"
    :loading="options?.loading ? isLoading : false"
    :totalRecords="totalRecords"
    :value="resourceData"
    :rows="rows"
    ref="dtRef"
  >
    <template v-if="toolbar?.visible" #header>
      <AdvToolbar
        @export="exportCSV"
        @clearSearch="clearSearch"
        @refresh="getResourceData"
        @createEdit="showCreateEdit"
        @delete="showDeletePopup"
        :filters="filters"
        :modalData="modalData"
        :formData="form.data"
        :onFilter="onFilter"
        :resource="resource"
        :selectedResources="selectedResources"
        :toolbar="toolbar"
      >
        <template #header_left>
          <slot name="header_left" />
        </template>
        <template #header_icon>
          <slot name="header_icon" />
        </template>
        <slot name="header" />
        <template #header_right>
          <slot name="header_right" />
        </template>
      </AdvToolbar>
    </template>
    <Column
      v-if="options?.columns?.select"
      v-model:selection="selectedResources"
      selectionMode="multiple"
      headerStyle="width: 3em"
    />
    <slot name="columns">
      <div v-for="field in getResourceFields(resource.fields)" :key="field.id">
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
  <template v-if="showModal">
    <CreateUpdateDialog
      v-if="showModal && resource"
      @close="showModal = false"
      @liveData="emitLiveData"
      :data="modalData"
      :hidden="form.hidden"
      :fields="resource.fields || []"
      :type="modalType"
      :primaryKey="resource.primaryKey ? resource.primaryKey : 'id'"
      :resource="resource"
      :subId="params?.id ? params.id : null"
    />
  </template>
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
  onBeforeUnmount,
} from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import {
  TableOptions,
  ToolbarOptions,
} from "../../../core/types/DatatableTypes";
import { translate, upperCaseFirst } from "../../../core/helpers/functions";
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
    const expandedRows = ref([] as unknown[]);
    const refresh = toRef(props, "refresh");
    const selectedResources = ref();
    const stateKey = ref("dt-" + props.resource.name + "-state");
    const store = useResourceStore();

    // Reactive resource data
    const resourceData = computed(() => {
      const dataList: any = store.getDataList(props.resource.name);
      return props.resource.lazy && dataList?.data
        ? dataList.data
        : dataList || [];
    });

    // Resource data and composable
    const {
      apiUrl,
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
      routeId,
      showCreateEdit,
      showDeletePopup,
      showModal,
      totalRecords,
      rows,
    } = useResource(props.resource, props);

    const { canAction } = props.resource;

    // Base default options for DataTable
    const baseDtOptions = {
      paginator: true,
      rows: rows.value,
      rowsPerPageOptions: [10, 25, 50, 100],
      paginatorTemplate:
        "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
      currentPageReportTemplate: "Showing {first} to {last} of {totalRecords}",
      first: 0,
    };

    // Datatable options
    const dtOptions = computed(() => ({
      ...baseDtOptions,
      ...props,
      ...attrs,
      rows: rows.value,
    }));

    // Clear search
    const clearSearch = () => {
      filters.value.global.value = null;
      getResourceData();
    };

    // Emit live data
    const emitLiveData = (data: any) => {
      emit("liveData", data);
    };

    // Export CSV
    const exportCSV = () => {
      dtRef.value?.exportCSV();
    };

    // Lazy load resource data
    const lazyLoad = () => {
      if (!lazyParams.value) {
        lazyParams.value = {
          first: 0,
          filters: filters.value,
          rows: dtOptions.value.rows,
        };
      }
      lazyParams.value.page = Math.floor(
        lazyParams.value.first / lazyParams.value.rows
      );
    };

    // On local row expand
    const onLocalRowExpand = (event: any) => {
      const resource = resourceData.value.find(
        (item: any) => item.id === event.data.id
      );
      expandedRows.value = resource ? [resource] : [];
    };

    // Store watcher stop handles
    const stopHandles: Array<() => void> = [];

    onMounted(async () => {
      if (props.apiUrl) apiUrl.value = props.apiUrl;
      if (props.routeId) routeId.value = props.routeId;
      if (props.form?.data) formData.value = props.form.data;
      if (props.resource.lazy) lazyLoad();

      filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ...props.resource.datatable?.filters,
        ...props.filters,
      };

      getResourceData();
    });

    // Watchers with cleanup
    stopHandles.push(
      watch(
        () => props.form?.data,
        (newData: any) => {
          modalData.value = newData;
        },
        { deep: true }
      )
    );

    stopHandles.push(
      watch(refresh, () => {
        getResourceData();
      })
    );

    stopHandles.push(
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
      )
    );

    stopHandles.push(
      watch(
        () => props.apiUrl,
        (newApiUrl) => {
          apiUrl.value = newApiUrl;
        },
        { deep: true }
      )
    );

    // Cleanup on unmount
    onBeforeUnmount(() => {
      // Stop all watchers
      stopHandles.forEach((stop) => stop());
      stopHandles.length = 0;

      // Clear refs to allow garbage collection
      expandedRows.value = [];
      selectedResources.value = null;
      if (lazyParams.value) lazyParams.value = null;
      if (filters.value)
        filters.value = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };

      // Clear this component's resource from the store
      store.removeResource(props.resource.name);
    });

    return {
      canAction,
      clearSearch,
      dtOptions,
      dtRef,
      emitLiveData,
      expandedRows,
      exportCSV,
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
      rows,
      selectedResources,
      showCreateEdit,
      showDeletePopup,
      showModal,
      stateKey,
      totalRecords,
      translate,
      upperCaseFirst,
    };
  },
});
</script>
