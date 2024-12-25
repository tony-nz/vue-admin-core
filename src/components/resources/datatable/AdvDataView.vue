<template>
  <DataView
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
    :layout="layout"
    :pt="dataViewStyle"
    :dataKey="'id'"
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
        <slot name="toolbar"></slot>
        <button
          v-if="show.refresh"
          type="button"
          class="fill-white p-2 bg-primary-500 hover:bg-primary-400 rounded shadow whitespace-nowrap"
          @click="getResourceData"
        >
          <span class="text-white pi pi-refresh mx-0" data-pc-section="icon" />
        </button>
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
          Bulk Delete
          {{ resource.singularName ? resource.singularName : resource.label }}s
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
            {{
              resource.singularName ? resource.singularName : resource.label
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
            {{
              resource.singularName ? resource.singularName : resource.label
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
        <SelectButton
          v-model="layout"
          :options="options"
          :allowEmpty="false"
          class="flex flex-row"
        >
          <template #option="{ option }">
            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-th-large']" />
          </template>
        </SelectButton>
      </div>
    </template>
    <template #list="slotProps">
      <slot name="list" v-bind:slotProps="slotProps">
        <div class="flex flex-col px-4">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="w-full"
          >
            <div :class="listClass">
              <slot name="item" v-bind="{ item, index }" class="p-4">
                <!-- Default content if no slot is provided -->
                <div>{{ item }}</div>
              </slot>
              <div class="p-2 content-center">
                <ActionColumn
                  :data="item"
                  :fields="resource.fields"
                  :resource="resource"
                  :showDefaults="show.actionDefaults"
                  @deletePopup="showDeletePopup"
                  @showCreateEdit="showCreateEdit"
                >
                  <template v-slot:actionCol="item">
                    <slot name="actionCol" :data="item" />
                  </template>
                </ActionColumn>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <template #grid="slotProps">
      <slot name="grid" v-bind:slotProps="slotProps">
        <div class="flex flex-wrap p-4">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="w-full sm:w-1/2 md:w-4/12 xl:w-1/2 p-2"
          >
            <div :class="gridClass">
              <slot name="item" v-bind="{ item, index }" class="p-4">
                <!-- Default content if no slot is provided -->
                <div>{{ item }}</div>
              </slot>
              <div class="bg-gray-100 p-2">
                <ActionColumn
                  :data="item"
                  :fields="resource.fields"
                  :resource="resource"
                  :showDefaults="show.actionDefaults"
                  @deletePopup="showDeletePopup"
                  @showCreateEdit="showCreateEdit"
                >
                  <template v-slot:actionCol="item">
                    <slot name="actionCol" :data="item" />
                  </template>
                </ActionColumn>
              </div>
            </div>
          </div>
          <div
            v-if="show.create"
            class="w-full sm:w-1/2 md:w-4/12 xl:w-1/2 p-2 group"
          >
            <div :class="gridClass" class="h-full">
              <button
                v-if="resource?.create?.modal && show?.create"
                class="flex flex-col w-full h-full p-8 space-y-4 justify-evenly items-center"
                type="button"
                @click="showCreateEdit('dialog', 'create', modalData)"
              >
                <slot name="gridCreate">
                  <!-- Default content if no slot is provided -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="h-32"
                  >
                    <path
                      class="fill-primary-500 group-hover:fill-primary-400"
                      d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
                    />
                  </svg>
                  <button
                    type="button"
                    class="bg-primary-500 group-hover:bg-primary-400 rounded shadow whitespace-nowrap text-white py-2 px-4"
                  >
                    {{ translate("va.actions.create") }}
                    {{
                      resource.singularName
                        ? resource.singularName
                        : resource.label
                    }}
                  </button>
                </slot>
              </button>
            </div>
          </div>
        </div>
      </slot>
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
  </DataView>
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
  <div v-if="!resource">
    <span>Missing resource prop</span>
  </div>
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
import { translate } from "../../../core/helpers/functions";
import { FilterMatchMode } from "@primevue/core/api";
import { useDebounce } from "../../../composables/useDebounce";
import { upperCaseFirst } from "../../../core/helpers/functions";
import ActionColumn from "./partials/ActionColumn.vue";
import CreateUpdateDialog from "../partials/CreateUpdateDialog.vue";
import ResourceType from "../../../core/types/ResourceConfigTypes";
import useResource from "../../../composables/useResource";
import useResourceStore from "../../../store/resource";

interface DataTableToolbar {
  bulkDeleteBtn: boolean;
  createBtn: boolean;
  search: boolean;
  simpleCreate: boolean;
}

interface Show {
  actions: boolean;
  actionDefaults: boolean;
  active: boolean;
  create: boolean;
  header: boolean;
  loading: boolean;
  toolbar: boolean;
  refresh: boolean;
  select: boolean;
}

interface Options {
  sortDesc: boolean;
  sortField: string;
}

interface Form {
  data: Object;
  hidden: Array<string>;
}

export default defineComponent({
  name: "AdvDataView",
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
    gridClass: {
      type: String,
      default:
        "border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-md flex flex-col",
    },
    listClass: {
      type: String,
      default: "flex flex-row w-full gap-3 border-b",
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
      type: Object as PropType<ResourceType>,
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
        create: true,
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
    const store = useResourceStore();

    /**
     * Reactive resource data
     */
    const resourceData = computed(() => store.getDataList(props.resource.name));

    /**
     * Filters
     * @type {Ref<Record<string, { value: any; matchMode: FilterMatchMode }>>}
     */
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ...props.resource.datatable?.filters,
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
      update,
    } = useResource(props.resource, filters, props);

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
          rows: 10,
        };
      }
      lazyParams.value.page = Math.fround(
        parseInt(lazyParams.value.first) / parseInt(lazyParams.value.rows || 10)
      );
    };

    const layout: any = ref("grid");
    const options: any = ref(["list", "grid"]);
    const dataViewStyle = ref({
      content: {
        class: [
          // Spacing
          "p-0",

          // Shape
          "border-0",

          // Color
          "text-surface-700 dark:text-white/80",
          "bg-surface-0 dark:bg-surface-800",
          // Scroll
          "overflow-scroll",
        ],
      },
      grid: {
        class: [
          // flex
          "flex flex-wrap",

          // Spacing
          "ml-0 mr-0 mt-0",

          // Color
          "bg-surface-0 dark:bg-surface-800",
        ],
      },
      header: {
        class: [
          "font-semibold",

          // Spacing
          "p-1",

          // Color
          // "text-surface-800 dark:text-white/80",
          // "bg-slate-100 dark:bg-surface-800",
          // "border-surface-200 dark:border-surface-700 border-b",
          "border-b border-x-0 bg-slate-100 dark:bg-slate-800 border-surface-300 dark:border-surface-600 text-surface-700 dark:text-white/80",
        ],
      },
    });

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

    watch(refresh, (val) => {
      getResourceData();
    });

    return {
      activeOptions,
      changeActive,
      debounce,
      dtOptions,
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
      selectedResources,
      showCreateEdit,
      showDeletePopup,
      showModal,
      stateKey,
      totalRecords,
      translate,
      upperCaseFirst,
      useDebounce,
      // new
      layout,
      options,
      dataViewStyle,
      resourceData,
    };
  },
});
</script>
