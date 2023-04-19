<template>
  <div>
    <Teleport v-if="!isLoading && resource" to="#toolbar-actions">
      <Button
        type="button"
        class="btn bg-primary-500 hover:bg-primary-400 py-2 px-6 border-0 ml-4 whitespace-nowrap"
      >
        <slot name="teleport" />
        Create {{ resource.label }}
      </Button>
    </Teleport>
    <!-- 
      :sortOrder="sortOrder"
      :sortField="sortField"
     -->
    <DataView
      dataKey="id"
      :value="resourceDataFiltered"
      :layout="layout"
      :paginator="true"
      :rows="9"
      class="grid-cols-4"
    >
      <template #header="slotProps">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex justify-start">
            <slot name="header" v-bind:slotProps="slotProps" />
          </div>
          <div class="flex justify-end">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </div>
      </template>
      <template #grid="slotProps">
        <div
          v-if="!customLayout"
          class="col-span-1 bg-white rounded-lg shadow-lg divide-y divide-gray-200 mt-4"
          :class="colWidth"
        >
          <div>
            <slot name="grid" v-bind:slotProps="slotProps" />
            <div class="-mt-px flex divide-x divide-gray-200">
              <div class="w-0 flex-1 flex">
                <button
                  @click="showCreateEdit('dialog', 'update', slotProps.data)"
                  class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <span class="ml-3">Edit</span>
                </button>
              </div>
              <div class="-ml-px w-0 flex-1 flex">
                <button
                  @click="showDeletePopup({ $event, slotProps })"
                  class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <span class="ml-3">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <slot name="grid" v-bind:slotProps="slotProps" />
        </div>
      </template>
      <template #list="slotProps">
        <slot name="list" v-bind:slotProps="slotProps" />
      </template>
    </DataView>
    <!-- Start:Delete popup -->
    <div v-if="resource">
      <ConfirmPopup :group="'DV_' + upperCaseFirst(resource.name)">
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
      :stateList="stateList"
      :subId="params?.id ? params.id : null"
    />
    <!-- End:CreateUpdate dialog -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { upperCaseFirst } from "../../../core/helpers/functions";
import { useConfirm } from "primevue/useconfirm";
import { useRoute } from "vue-router";
import CreateUpdateDialog from "../partials/CreateUpdateDialog.vue";
import CreateUpdateSideBar from "../partials/CreateUpdateSideBar.vue";
import useResource from "../../../composables/useResource";

export default defineComponent({
  name: "MyDataView",
  components: {
    CreateUpdateDialog,
    CreateUpdateSideBar,
  },
  props: {
    apiUrl: {
      type: String,
    },
    params: {
      type: Object,
    },
    resource: {
      type: Object,
      required: true,
    },
    dataFilters: {
      type: Object,
    },
    gridCols: {
      type: Number,
    },
    colWidth: {
      type: String,
    },
    customLayout: {
      type: String,
    },
    stateList: {
      type: String,
    },
    stateUser: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // layout with grid or list
    const layout = ref();
    const sortKey = ref();
    const sortOrder = ref();
    const sortField = ref();
    const sortOptions = ref([
      { label: "Price High to Low", value: "!price" },
      { label: "Price Low to High", value: "price" },
    ]);
    const onSortChange = (event) => {
      const value = event.value.value;
      const sortValue = event.value;

      if (value.indexOf("!") === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
      } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
      }
    };
    // const modalData = ref({});
    // const modalType = ref();
    const confirmDelete = useConfirm();
    const columnCount = ref(0);
    const route = useRoute();
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
    } = useResource(props.resource);

    const getGridCols = computed(() => {
      if (layout.value == "grid") {
        // TODO:: prop for col count
        return props.gridCols ? props.gridCols : 3;
      }
      // return one col, layout is in list view
      return 1;
    });
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
      layout,
      sortKey,
      sortOrder,
      sortField,
      sortOptions,
      onSortChange,
      getGridCols,

      bulkRemove,
      columnCount,
      confirmDelete,
      create,
      // dsiplayHeader,
      // expandedRows,
      // filters,
      // globalFilterFields,
      isLoading,
      modalData,
      modalType,
      remove,
      resourceData,
      resourceDataFiltered,
      route,
      // selectedResources,
      showModal,
      // showSidebar,
      upperCaseFirst,
      update,
      getResourceFields,
      closeModal,
      closeSidebar,
      showCreateEdit,
      showDeletePopup,
      showSidebar,
    };
  },
});
</script>

<style>
/* Horrible hack to force the grid layout on DataView
 * TODO:: use prop for grid size
 */
.p-nogutter {
  gap: 1rem;
  /* grid-template-columns: v-bind(getGridCols); */
  grid-template-columns: repeat(v-bind(getGridCols), minmax(0, 1fr));
}
.p-dataview-content .grid {
  display: grid !important;
  flex-flow: row wrap;
}
</style>
