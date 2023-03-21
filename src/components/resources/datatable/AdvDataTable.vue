<template>
  <div>
    <Teleport v-if="!isLoading && resource" to="#toolbar-actions">
      <div
        v-if="showTeleportToolbar"
        id="toolbar-datatable"
        class="flex justify-end gap-4"
      >
        <span
          v-if="toolbar?.teleport?.search != false"
          class="p-input-icon-left w-full"
        >
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            class="w-full"
            placeholder="Search..."
          />
        </span>
        <slot name="toolbar"></slot>
        <button
          v-if="
            resource?.create?.modal && toolbar?.teleport?.createBtn != false
          "
          type="button"
          class="bg-primary-500 hover:bg-primary-400 text-white text-sm py-2 px-4 rounded shadow whitespace-nowrap"
          @click="showCreateEdit('dialog', 'create')"
        >
          Create {{ getSingularizedLabel(resource.label) }}
        </button>
        <router-link
          v-else-if="
            resource?.create?.page && toolbar?.teleport?.createBtn != false
          "
          to="/sms/classrooms/create"
          type="button"
          class="bg-primary-500 hover:bg-primary-400 text-white text-sm py-2 px-8 rounded shadow whitespace-nowrap"
        >
          Create {{ getSingularizedLabel(resource.label) }}
        </router-link>
      </div>
    </Teleport>
    <DataTable
      v-if="resource"
      :dataKey="idKey"
      :editMode="editMode"
      :globalFilterFields="globalFilterFields"
      :loading="isLoading"
      :paginator="showPaginator"
      :paginatorTemplate="paginatorTemplate"
      :rows="rows"
      :rowHover="true"
      :rowsPerPageOptions="[10, 20]"
      :value="resourceDataFiltered"
      @row-collapse="onLocalRowCollapse"
      @row-expand="onLocalRowExpand"
      @rowCollapse="onRowCollapse"
      @rowExpand="onRowExpand"
      v-bind="options"
      v-model:expandedRows="expandedRows"
      v-model:filters="filters"
      v-model:selection="selectedResources"
      currentPageReportTemplate="{totalRecords} Total"
      filterDisplay="menu"
      responsiveLayout="scroll"
      showGridlines
    >
      <template #header>
        <div
          v-if="showToolbar"
          class="flex flex-column md:flex-row md:justiify-content-between p-2 gap-4 dark:bg-transparent"
        >
          <span
            v-if="toolbar?.search != false"
            class="p-input-icon-left w-full"
          >
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="w-full"
              placeholder="Search..."
            />
          </span>
          <slot name="toolbar"></slot>
          <button
            v-if="showSelect && toolbar?.bulkDeleteBtn != false"
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
            class="bg-primary-500 hover:bg-primary-400 text-white py-2 px-4 rounded shadow whitespace-nowrap"
            @click="showCreateEdit('dialog', 'create')"
          >
            Create {{ getSingularizedLabel(resource.label) }}
          </button>
          <router-link
            v-else-if="resource?.create?.page && toolbar?.createBtn != false"
            to="/sms/classrooms/create"
            type="button"
            class="bg-primary-500 hover:bg-primary-400 text-white py-2 px-8 rounded shadow whitespace-nowrap"
          >
            Create {{ getSingularizedLabel(resource.label) }}
          </router-link>
        </div>
      </template>
      <Column
        v-if="showSelect"
        v-model:selection="selectedResources"
        selectionMode="multiple"
        headerStyle="width: 3em"
      />
      <slot name="columns">
        <!-- TODO:: rewrite this.. -->
        <div
          v-for="field in getResourceFields(stateList)"
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
      <Column v-if="showActions" :exportable="false">
        <template #body="{ data }">
          <ActionColumn
            :data="data"
            :resource="resource"
            :fields="resource.fields"
            :showDefaults="showActionDefaults"
            :flex="actionColFlex"
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
      <template #empty> No data found. </template>
    </DataTable>
    <span v-else>Missing resource prop</span>
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
    <!-- End:Delete popup -->
    <!-- Start:CreateUpdate dialog -->
    <CreateUpdateDialog
      v-if="showModal && resource"
      @close="closeModal"
      @create="create"
      @update="update"
      :data="modalData"
      :fields="getResourceFields(stateList, true)"
      :type="modalType"
      :primaryKey="resource.primaryKey ? resource.primaryKey : 'id'"
      :resource="resource"
      :stateList="stateList"
      :subId="params?.id ? params.id : null"
    />
    <!-- End:CreateUpdate dialog -->
    <!-- Start:CreateUpdate dialog -->
    <CreateUpdateSideBar
      v-if="resource"
      v-model="showSidebar"
      :value="showSidebar"
      @close="closeSidebar"
      @create="create"
      @update="update"
      :data="modalData"
      :fields="getResourceFields(stateList, true)"
      :type="modalType"
      :primaryKey="resource.primaryKey ? resource.primaryKey : 'id'"
      :resource="resource"
      :stateList="stateList"
      :subId="params?.id ? params.id : null"
    />
    <!-- End:CreateUpdate dialog -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import {
  upperCaseFirst,
  getSingularizedLabel,
} from "../../../core/helpers/functions";
import ActionColumn from "./partials/ActionColumn.vue";
import CreateUpdateDialog from "../partials/CreateUpdateDialog.vue";
import CreateUpdateSideBar from "../partials/CreateUpdateSideBar.vue";
import useResource from "../../../composables/useResource";

interface TeleportToolbar {
  search?: boolean;
  bulkDeleteBtn?: boolean;
  createBtn?: boolean;
}

interface DataTableToolbar {
  createBtn: boolean;
  bulkDeleteBtn: boolean;
  search: boolean;
  teleport: TeleportToolbar;
}

type DataTableEditModeType = "cell" | "row";

export default defineComponent({
  name: "AdvDataTable",
  components: {
    ActionColumn,
    CreateUpdateDialog,
    CreateUpdateSideBar,
  },
  props: {
    actionColFlex: {
      type: String,
    },
    apiUrl: {
      type: String,
    },
    params: {
      type: Object,
    },
    dataFilters: {
      type: Object,
    },
    editMode: {
      type: String as PropType<DataTableEditModeType>,
      default: "cell",
    },
    idKey: {
      type: String,
    },
    options: {
      type: Object,
      required: false,
    },
    onRowExpand: {
      type: Function,
      default: () => 1,
    },
    onRowCollapse: {
      type: Function,
      default: () => 1,
    },
    paginatorTemplate: {
      type: String,
      default:
        "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
      // "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
    },
    resource: {
      type: Object,
      required: true,
    },
    rows: {
      type: Number,
      default: 10,
    },
    routeId: {
      type: String,
    },
    showActive: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    showActionDefaults: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showPaginator: {
      type: Boolean,
      default: true,
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    showTeleportToolbar: {
      type: Boolean,
      default: false,
    },
    stateList: {
      type: String,
      default: "",
    },
    stateUser: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Object as PropType<DataTableToolbar>,
    },
  },
  setup(props) {
    const globalFilterFields = ref();
    const expandedRows = ref([] as unknown[]);
    const selectedResources = ref();
    const displayHeader = ref(props.showHeader ? "table-header-group" : "none");
    const dataFilters = computed(() => {
      return props.dataFilters;
    });
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const {
      bulkRemove,
      closeModal,
      closeSidebar,
      create,
      isLoading,
      getResourceData,
      getResourceFields,
      modalData,
      modalType,
      remove,
      resourceData,
      resourceDataFiltered,
      showCreateEdit,
      showDeletePopup,
      showModal,
      showSidebar,
      stateList,
      stateUser,
      update,
    } = useResource(props.resource, {
      dataFilters,
      params: props.params,
    });

    const onLocalRowExpand = (event) => {
      const resource = resourceData.value.find(
        (item) => item.id == event.data.id
      );
      expandedRows.value = [resource];
    };

    const onLocalRowCollapse = (event) => {
      //
    };
    // possibly redundant
    function setupFilters() {
      if (resourceData.value[0]) {
        globalFilterFields.value = Object.keys(resourceData.value[0]);
        globalFilterFields.value.forEach((valueName) => {
          Object.assign(filters.value, {
            [valueName]: {
              operator: FilterOperator.AND,
              constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
              ],
            },
          });
        });
      }
    }

    onMounted(async () => {
      stateList.value = props.stateList;
      stateUser.value = props.stateUser;
      try {
        getResourceData();
      } catch (e) {
        console.log(e);
      }
      isLoading.value = false;
    });

    return {
      onLocalRowExpand,
      onLocalRowCollapse,
      bulkRemove,
      create,
      displayHeader,
      expandedRows,
      filters,
      globalFilterFields,
      isLoading,
      modalData,
      modalType,
      remove,
      resourceData,
      resourceDataFiltered,
      selectedResources,
      showModal,
      showSidebar,
      upperCaseFirst,
      update,
      getResourceFields,
      closeModal,
      closeSidebar,
      showCreateEdit,
      showDeletePopup,
      getSingularizedLabel,
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
</style>
