<template>
  <div v-if="resource">
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
      :state-key="stateKey"
      :totalRecords="totalRecords"
      :value="resourceData"
      state-storage="session"
    >
      <template v-if="show.toolbar" #header>
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
                class="pl-10 font-normal w-full"
                placeholder="Keyword search"
              />
            </span>
          </div>
          <div v-if="show.active" class="flex gap-2">
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
          <div v-if="show.refresh" class="flex gap-2">
            <Button
              @click="getResourceData"
              class="p-button-text p-button-plain h-full"
              icon="pi pi-refresh"
            />
          </div>
          <button
            v-if="show.select && toolbar?.bulkDeleteBtn != false"
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
            Bulk Delete {{ getSingularizedLabel(resource.label) }}s
          </button>
          <button
            v-if="resource?.create?.modal && toolbar?.createBtn != false"
            type="button"
            class="bg-primary-500 hover:bg-primary-400 rounded shadow whitespace-nowrap"
            :class="{
              'fill-white p-2': toolbar?.simpleCreate,
              'text-white py-2 px-4': !toolbar?.simpleCreate,
            }"
            @click="showCreateEdit('dialog', 'create', modalData)"
          >
            <span v-if="!toolbar?.simpleCreate"
              >{{ translate("va.actions.create") }}
              {{ getSingularizedLabel(resource.label) }}</span
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
            v-else-if="resource?.create?.page && toolbar?.createBtn != false"
            :to="resource.url + '/create'"
            type="button"
            class="bg-primary-500 hover:bg-primary-400 rounded shadow whitespace-nowrap"
            :class="{
              'fill-white p-2': toolbar?.simpleCreate,
              'text-white py-2 px-4': !toolbar?.simpleCreate,
            }"
          >
            <span v-if="!toolbar?.simpleCreate"
              >{{ translate("va.actions.create") }}
              {{ getSingularizedLabel(resource.label) }}</span
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
          />
        </template>
      </Column>
      <slot name="columns">
        <!-- TODO:: rewrite this.. -->
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
      <Column v-if="show.actions" :exportable="false">
        <template #body="{ data }">
          <ActionColumn
            :data="data"
            :fields="resource.fields"
            :resource="resource"
            :showDefaults="show.actionDefaults"
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
    <!-- Start:Delete popup -->
    <div v-if="resource">
      <ConfirmPopup :group="'DT_' + upperCaseFirst(resource.name)">
        <template #message="slotProps">
          <div class="flex p-4">
            <i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
            <p class="pl-2">{{ slotProps.message.message }}</p>
          </div>
        </template>
      </ConfirmPopup>
    </div>
    <CreateUpdateDialog
      v-if="showModal && resource"
      @close="showModal = false"
      :data="modalData"
      :hidden="form.hidden"
      :fields="getResourceFields(resource.fields)"
      :type="modalType"
      :primaryKey="resource.primaryKey ? resource.primaryKey : 'id'"
      :resource="resource"
      :subId="params?.id ? params.id : null"
    />
  </div>
  <div v-else>
    <span>Missing resource prop</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, toRef, watch } from "vue";
import { translate } from "../../../core/helpers/functions";
import { FilterMatchMode } from "primevue/api";
import { useDebounce } from "../../../composables/useDebounce";
import {
  upperCaseFirst,
  getSingularizedLabel,
} from "../../../core/helpers/functions";
import ActionColumn from "./partials/ActionColumn.vue";
import CreateUpdateDialog from "../partials/CreateUpdateDialog.vue";
import useResource from "../../../composables/useResource";

interface DataTableToolbar {
  bulkDeleteBtn: Boolean;
  createBtn: Boolean;
  search: Boolean;
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
        loading: false,
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
     * Display table header
     * @type {Ref<string>}
     */
    const displayHeader = ref(
      props.show.header ? "table-header-group" : "none"
    );

    /**
     * Filters
     * @type {Ref<Record<string, { value: any; matchMode: FilterMatchMode }>>}
     */
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
      lazy: true,
      ...attrs,
    };

    /**
     * Resource data
     */
    const {
      getResourceData,
      getResourceFields,
      isLoading,
      lazyParams,
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
      update,
    } = useResource(props.resource, filters, props, {
      params: props.params,
    });

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
     * Active filters
     */
    const activeOptions = [
      { label: "All", value: null },
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ];

    onMounted(async () => {
      // lazy load / pagination
      lazyParams.value = JSON.parse(
        sessionStorage.getItem(stateKey.value as string) as string
      );
      if (!lazyParams.value) {
        lazyParams.value = {
          first: 0,
          filters: filters.value,
          rows: 10,
        };
      }
      lazyParams.value.page = Math.fround(
        parseInt(lazyParams.value.first) / parseInt(lazyParams.value.rows || 10)
      );

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

      getResourceData();
    });

    // todo: work filters into this to allow for column filtering
    // also remove redundant props, as it can all be passed through options

    // function setupFilters() {
    //   if (resourceData.value[0]) {
    //     globalFilterFields.value = Object.keys(resourceData.value[0]);
    //     globalFilterFields.value.forEach((valueName) => {
    //       Object.assign(filters.value, {
    //         [valueName]: {
    //           operator: FilterOperator.AND,
    //           constraints: [
    //             { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    //           ],
    //         },
    //       });
    //     });
    //   }
    // }

    watch(refresh, (val) => {
      getResourceData();
    });

    return {
      activeOptions,
      changeActive,
      debounce,
      displayHeader,
      dtOptions,
      expandedRows,
      filters,
      getResourceData,
      getResourceFields,
      getSingularizedLabel,
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

<style>
.p-datatable-header {
  padding: 0px !important;
}
.p-datatable-header:empty {
  display: none;
}
.p-datatable-thead {
  display: v-bind("displayHeader");
}
#toolbar-datatable .p-inputtext {
  padding: 8.21px;
  width: 410px;
  padding-left: 2.5rem;
}

/* Paginator styling */
.p-paginator .p-paginator-first,
.p-paginator .p-paginator-prev,
.p-paginator .p-paginator-next,
.p-paginator .p-paginator-last {
  border: none !important;
  min-width: 1rem;
}
.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: #009ffe;
  color: #ffffff;
}
.p-link:focus {
  box-shadow: none !important;
}
.p-paginator .p-paginator-first,
.p-paginator .p-paginator-prev,
.p-paginator .p-paginator-next,
.p-paginator .p-paginator-last,
.p-paginator .p-paginator-pages .p-paginator-page {
  border-radius: 0.5rem;
  border: none !important;
  height: 32px !important;
  width: 32px !important;
  min-height: 32px !important;
  min-width: 32px !important;
  padding: 0px !important;
  margin-left: 4px;
  margin-right: 4px;
}
/* Dropdown option styling */
.p-paginator .p-dropdown {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
/* 
 * Align list options on the left
 * and paginator to the right
 */
.p-paginator-current {
  margin-left: auto !important;
}
/* .p-paginator-first {
  margin-left: auto !important;
} */

/* fix for icon on search input */
.p-input-icon-left > i:first-of-type {
  position: absolute !important;
  left: 1.5rem !important;
  top: 1.5rem !important;
}
</style>
