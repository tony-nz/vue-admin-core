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
    :loading="show.loading ? isLoading : false"
    :row-class="rowClass"
    :totalRecords="totalRecords"
    :value="resourceData"
  >
    <template v-if="show.toolbar" #header>
      <div class="px-2 py-1">
        <h3
          class="text-lg leading-6 font-medium text-gray-900 dark:text-white transition ease-in-out duration-200 text-white"
        >
          {{ resource.label }}
        </h3>
        <p
          class="mt-1 text-sm text-gray-500 dark:text-gray-600 transition ease-in-out duration-200 text-white text-opacity-60 dark:text-white"
        >
          List of {{ resource.label.toLowerCase() }}
        </p>
      </div>
      <div
        class="flex flex-column md:flex-row md:justiify-content-between p-2 gap-2 dark:bg-transparent"
      >
        <div v-if="toolbar?.search != false" class="flex w-full justify-end">
          <span class="flex w-full relative">
            <i
              class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
            />
            <InputText
              v-model="filters['global'].value"
              @input="debounce(onFilter, 500)"
              id="dt_search"
              class="pl-10 font-normal w-full min-w-[350px]"
              placeholder="Keyword search"
            />
            <button
              v-if="filters['global'].value"
              @click="filters['global'].value = ''"
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="h-5 w-5"
              >
                <path
                  fill="currentColor"
                  d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m1.41-1.41A8 8 0 1 0 15.66 4.34A8 8 0 0 0 4.34 15.66m9.9-8.49L11.41 10l2.83 2.83l-1.41 1.41L10 11.41l-2.83 2.83l-1.41-1.41L8.59 10L5.76 7.17l1.41-1.41L10 8.59l2.83-2.83z"
                />
              </svg>
            </button>
          </span>
        </div>
        <div v-if="toolbar?.active" class="flex gap-2">
          <Dropdown
            v-model="filters['active'].value"
            :options="activeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filter by activity"
            class="w-48"
          />
        </div>
        <slot name="toolbar"></slot>
        <button
          v-if="toolbar?.refresh"
          type="button"
          class="fill-white py-2 px-3 bg-primary-500 hover:bg-primary-400 rounded shadow whitespace-nowrap"
          @click="getResourceData"
        >
          <span class="text-white pi pi-refresh mx-0" data-pc-section="icon" />
        </button>
        <button
          v-if="toolbar?.select"
          @click="showDeletePopup({ $event, selectedResources })"
          :class="{
            'bg-primary-500 hover:bg-primary-400 border-gray-400':
              selectedResources?.length > 0,
            'bg-gray-300 border-gray-300':
              selectedResources?.length === 0 || !selectedResources,
          }"
          :disabled="selectedResources?.length === 0 || !selectedResources"
          class="py-2 px-4 border rounded shadow whitespace-nowrap text-white"
          type="button"
        >
          {{ translate("va.actions.bulkDelete") }}
          {{
            resource.singularLabel ? resource.singularLabel : resource.label
          }}s
        </button>
        <button
          v-if="
            resource?.create?.modal && toolbar?.create && canAction('create')
          "
          type="button"
          class="bg-primary-500 hover:bg-primary-600 rounded shadow whitespace-nowrap"
          :class="{
            'fill-white p-2': toolbar?.simpleCreate,
            'text-white py-2 px-4': !toolbar?.simpleCreate,
          }"
          @click="showCreateEdit('dialog', 'create', modalData)"
        >
          <span v-if="!toolbar?.simpleCreate"
            >{{ translate("va.actions.create") }}
            {{
              resource.singularLabel ? resource.singularLabel : resource.label
            }}</span
          >
          <span v-else>
            <svg
              class="h-4 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
              />
            </svg>
          </span>
        </button>
        <router-link
          v-else-if="
            resource?.create?.page && toolbar?.create && canAction('create')
          "
          :to="resource.url + '/create'"
          type="button"
          class="bg-primary-500 hover:bg-primary-600 rounded shadow whitespace-nowrap"
          :class="{
            'fill-white p-2': toolbar?.simpleCreate,
            'text-white py-2 px-4': !toolbar?.simpleCreate,
          }"
        >
          <span v-if="!toolbar?.simpleCreate"
            >{{ translate("va.actions.create") }}
            {{
              resource.singularLabel ? resource.singularLabel : resource.label
            }}</span
          >
          <span v-else>
            <svg
              class="h-4 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
              />
            </svg>
          </span>
        </router-link>
      </div>
    </template>
    <Column
      v-if="show.select"
      v-model:selection="selectedResources"
      selectionMode="multiple"
      headerStyle="width: 3em"
      :selectable="isRowSelectable"
    />
    <Column
      v-if="show.active"
      :exportable="false"
      :sortable="true"
      field="active"
      headerStyle="width: 2rem"
    >
      <template #body="{ data }">
        <InputSwitch
          v-model="data.active"
          @update:modelValue="changeActive(data)"
          :disabled="data.locked"
        />
      </template>
    </Column>
    <slot name="columns">
      <div
        v-for="field in getResourceFields(resource.fields)"
        v-bind:key="field.id"
      >
        <Column
          v-if="field.id !== 'active'"
          :field="field.id"
          :header="field.label"
          :sortable="true"
        />
      </div>
    </slot>
    <Column v-if="show.actions" :exportable="false" class="w-24">
      <template #body="{ data }">
        <ActionColumn
          :data="data"
          :fields="resource.fields"
          :resource="resource"
          :showDefaults="show.actionDefaults"
          @deletePopup="showDeletePopup"
          @changeLock="changeLock"
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
    <template #paginatorcontainer="slotProps">
      <div
        class="flex items-center justify-between gap-4 border border-primary bg-transparent rounded-full w-full py-2 px-4"
      >
        <!-- Left Section: Rows Per Page Dropdown -->
        <div class="flex items-center gap-2">
          <label for="rows-dropdown" class="text-sm font-medium text-color"
            >Rows:</label
          >
          <select
            id="rows-dropdown"
            class="border border-gray-300 rounded-md px-2 py-1 text-sm text-color focus:ring-primary focus:border-primary"
          >
            <option
              v-for="option in [10, 25, 50, 100]"
              @click="slotProps.setRows(option)"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Center Section: Showing X to Y of Z -->
        <div class="text-color font-medium">
          <span class="hidden sm:block"
            >Showing {{ slotProps.first }} to {{ slotProps.last }} of
            {{ slotProps.totalRecords }}</span
          >
          <span class="block sm:hidden"
            >Page {{ slotProps.page + 1 }} of {{ slotProps.pageCount }}</span
          >
        </div>

        <!-- Right Section: Navigation Buttons -->
        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-chevron-left"
            rounded
            text
            @click="slotProps.prevPageCallback"
            :disabled="slotProps.page === 0"
            aria-label="Previous"
          />
          <Button
            icon="pi pi-chevron-right"
            rounded
            text
            @click="slotProps.nextPageCallback"
            :disabled="slotProps.page === slotProps.pageCount - 1"
            aria-label="Next"
          />
        </div>
      </div>
    </template>
  </DataTable>
  <!-- Start:Delete popup -->
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
  <div v-if="!resource">
    <span>Missing resource prop</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, toRef, watch } from "vue";
import { translate } from "../../../core/helpers/functions";
import { FilterMatchMode } from "@primevue/core/api";
import { useDebounce } from "../../../composables/useDebounce";
import { upperCaseFirst } from "../../../core/helpers/functions";
import ActionColumn from "./partials/ActionColumn.vue";
import CreateUpdateDialog from "../partials/CreateUpdateDialog.vue";
import useResource from "../../../composables/useResource";
interface PaginatorContainerProps {
  first: number;
  last: number;
  page: number;
  pageCount: number;
  totalRecords: number;
  setRows: (rows: number) => void;
  prevPageCallback: () => void;
  nextPageCallback: () => void;
}
interface DataTableToolbar {
  active: Boolean;
  bulkDeleteBtn: Boolean;
  create: Boolean;
  refresh: Boolean;
  search: Boolean;
  select: Boolean;
  simpleCreate: Boolean;
}

interface Show {
  actions: Boolean;
  actionDefaults: Boolean;
  active: Boolean;
  header: Boolean;
  loading: Boolean;
  toolbar: Boolean;
  refresh: Boolean;
  select: Boolean;
}

interface Options {
  sortDesc: Boolean;
  sortField: String;
}

interface Form {
  data: Object;
  hidden: Array<string>;
}

export default defineComponent({
  name: "AdvDataTable",
  components: {
    ActionColumn,
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
      type: Object as PropType<Options>,
      required: false,
      default: () => ({
        sortField: "id",
        sortDesc: true,
      }),
    },
    params: {
      type: Object,
    },
    refresh: {
      type: String,
    },
    resource: {
      type: Object,
      required: true,
    },
    routeId: {
      type: String,
    },
    show: {
      type: Object as PropType<Show>,
      required: false,
      default: () => ({
        actions: true,
        actionDefaults: true,
        active: false,
        header: true,
        loading: true,
        refresh: true,
        select: false,
        toolbar: true,
      }),
    },
    toolbar: {
      type: Object as PropType<DataTableToolbar>,
    },
  },
  inheritAttrs: false,
  setup(props, { emit, attrs }) {
    const debounce = useDebounce();
    const expandedRows = ref([] as unknown[]);
    const refresh = toRef(props, "refresh");
    const selectedResources = ref();
    const stateKey = ref("dt-" + props.resource.name + "-state:");

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
      // paginatorTemplate:
      //   "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
      // currentPageReportTemplate: "Showing {first} to {last} of {totalRecords}",
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
      lock,
      modalData,
      modalType,
      onFilter,
      onPage,
      onSort,
      resourceData,
      routeId,
      showCreateEdit,
      showDeletePopup,
      showModal,
      totalRecords,
      unlock,
      update,
    } = useResource(props.resource, filters, props, {
      params: props.params,
      dtOptions: dtOptions,
    });
    const { canAction } = props.resource;

    const onLocalRowExpand = (event) => {
      const resource = resourceData.value.find(
        (item) => item.id == event.data.id
      );
      expandedRows.value = [resource];
    };

    /**
     * Change active
     * @param event
     */
    const changeActive = async (event: any) => {
      if (event && event.id) {
        await update(event, event.id);
      }
    };

    /**
     * Change lock
     * @param event
     */
    const changeLock = async (event: any) => {
      if (event && event.id) {
        if (event.locked) {
          await unlock(event.id);
        } else {
          await lock(event.id);
        }
      }
    };

    /**
     * Active filters
     */
    const activeOptions = [
      { label: "All", value: null },
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ];

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
     * Is row selectable
     * @param rowData
     */
    const isRowSelectable = (rowData: any) => {
      return !rowData.locked;
    };

    /**
     * rowClass
     * @param rowData
     */
    const rowClass = (rowData: any) => {
      return {
        // "bg-red-100": rowData.locked,
        locked: rowData.locked,
      };
    };

    onMounted(async () => {
      /**
       * Check for props apiUrl
       */
      if (props.apiUrl) {
        apiUrl.value = props.apiUrl;
      }

      /**
       * Set route id of current route
       */
      if (props.routeId) {
        routeId.value = props.routeId;
      }

      /**
       * Merge prop form data with modal data
       */
      if (props.form?.data) {
        modalData.value = { ...props.form.data, ...modalData.value };
      }

      if (props.show.active) {
        // add active filter
        Object.assign(filters.value, {
          active: { value: true, matchMode: FilterMatchMode.EQUALS },
        });
      }

      /**
       * Check resource.lazy and lazy load data
       */
      if (props.resource.lazy) {
        lazyLoad();
      }

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
      activeOptions,
      canAction,
      changeActive,
      changeLock,
      debounce,
      dtOptions,
      emitLiveData,
      expandedRows,
      filters,
      getResourceData,
      getResourceFields,
      isLoading,
      isRowSelectable,
      modalData,
      modalType,
      onFilter,
      onLocalRowExpand,
      onPage,
      onSort,
      resourceData,
      rowClass,
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
