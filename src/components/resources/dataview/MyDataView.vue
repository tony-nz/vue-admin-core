<template>
  <div>
    <DataView
      dataKey="id"
      :value="resourceDataFiltered"
      :layout="layout"
      :paginator="paginator"
      :rows="rows"
      :class="css"
    >
      <template #header="slotProps">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex justify-start">
            <slot name="header" v-bind:slotProps="slotProps" />
          </div>
          <div class="flex justify-end">
            <div class="flex flex-column md:flex-row md:justiify-content-between mr-2 gap-4 dark:bg-transparent">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input v-model="search" class="p-inputtext p-component w-full" placeholder="Search...">
              </span>
              <button @click="showCreateEdit('dialog', 'create', modalData)" type="button" class="bg-primary-500 hover:bg-primary-400 rounded shadow whitespace-nowrap text-white py-2 px-4">
                <span>Create</span>
              </button>
            </div>
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
                  @click="showCreateEdit('dialog', 'update', (slotProps as any)?.data)"
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
        <div class="grid grid-cols-2">
          <slot name="list" v-bind:slotProps="slotProps" />
          <div class="justify-end flex gap-2">
            <div class="self-center">
              <button
                @click="showCreateEdit('dialog', 'update', (slotProps as any)?.data)"
                class="transition duration-150 ease-in-out btn bg-gray-100 border-gray-800 rounded-lg fill-gray-400 hover:bg-primary-400 dark:bg-slate-800 hover:fill-white p-2 shadow"
              >
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66zM437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7L339.7 74.34L437.7 172.3z"></path>
                  <path class="opacity-40" d="M0 160C0 106.1 42.98 64 96 64H192C209.7 64 224 78.33 224 96C224 113.7 209.7 128 192 128H96C78.33 128 64 142.3 64 160V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V320C384 302.3 398.3 288 416 288C433.7 288 448 302.3 448 320V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V160z"></path>
                </svg>
              </button>
            </div>
            <div class="self-center">
              <button
                class="transition duration-150 ease-in-out btn bg-gray-100 border-gray-800 rounded-lg fill-gray-400 hover:bg-primary-400 dark:bg-slate-800 hover:fill-white p-2 shadow"
              >
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M572.6 270.3l-96 192C471.2 473.2 460.1 480 447.1 480H0l119.2-238.3C124.6 230.8 135.7 224 147.8 224h396.2C567.7 224 583.2 249 572.6 270.3z"></path>
                  <path class="opacity-40" d="M480 144V224H147.8C135.7 224 124.6 230.8 119.2 241.7L0 480V80C0 53.49 21.49 32 48 32h160l64 64h160C458.5 96 480 117.5 480 144z"></path>
                </svg>
              </button>
            </div>
            <div class="self-center">
              <button
                @click="showDeletePopup({ $event, slotProps })"
                class="transition duration-150 ease-in-out btn bg-red-100 border-gray-800 rounded-lg fill-red-400 hover:bg-red-400 hover:fill-white dark:bg-red-800 p-2 shadow"
              >
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M284.2 0C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2z"></path>
                  <path class="opacity-40" d="M416 448C416 483.3 387.3 512 352 512H96C60.65 512 32 483.3 32 448V96H416V448zM144 176C144 167.2 136.8 160 128 160C119.2 160 112 167.2 112 176V400C112 408.8 119.2 416 128 416C136.8 416 144 408.8 144 400V176zM240 176C240 167.2 232.8 160 224 160C215.2 160 208 167.2 208 176V400C208 408.8 215.2 416 224 416C232.8 416 240 408.8 240 400V176zM336 176C336 167.2 328.8 160 320 160C311.2 160 304 167.2 304 176V400C304 408.8 311.2 416 320 416C328.8 416 336 408.8 336 400V176z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
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
    <!-- End:Delete popup -->
    <!-- Start:CreateUpdate dialog -->
    <CreateUpdateDialog
      v-if="showModal && resource"
      @close="closeModal"
      @create="create"
      @update="update"
      :data="modalData"
      :hidden="formHidden"
      :fields="getResourceFields(stateList, true)"
      :type="modalType"
      :primaryKey="resource.primaryKey ? resource.primaryKey : 'id'"
      :resource="resource"
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
      :subId="params?.id ? params.id : null"
    />
    <!-- End:CreateUpdate dialog -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { upperCaseFirst } from "../../../core/helpers/functions";
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
    colWidth: {
      type: String,
    },
    css: {
      type: String,
      default: "grid-cols-4",
    },
    customLayout: {
      type: String,
    },
    dataFilters: {
      type: Object,
    },
    formHidden: {
      type: Array,
    },
    gridCols: {
      type: Number,
    },
    paginator: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
    },
    resource: {
      type: Object,
      required: true,
    },
    rows: {
      type: Number,
      default: 10,
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
    const layout: any = ref("grid");
    const search = ref("");

    /**
     * Get data filters
     */
    const dataFilters = computed(() => {
      const filters = props.dataFilters;

      if (filters && search.value) {
        filters["*"] = search.value;
      }
      
      return filters;
    });

    /**
     * Get grid cols
     */
    const getGridCols = computed(() => {
      if (layout.value === "grid") {
        // TODO:: prop for col count
        return props.gridCols ? props.gridCols : 3;
      }
      // return one col, layout is in list view
      return 1;
    });

    /**
     * Get resource helpers
     */
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

    onMounted(async () => {
      // set state lists
      stateList.value = props.stateList;
      stateUser.value = props.stateUser;

      // get resource data
      try {
        getResourceData();
      } catch (e) {
        console.log(e);
      }

      // Finish loading
      isLoading.value = false;
    });

    return {
      bulkRemove,
      closeModal,
      closeSidebar,
      create,
      getGridCols,
      getResourceFields,
      isLoading,
      layout,
      modalData,
      modalType,
      remove,
      resourceData,
      resourceDataFiltered,
      search,
      showCreateEdit,
      showDeletePopup,
      showModal,
      showSidebar,
      update,
      upperCaseFirst,
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
  grid-template-columns: repeat(v-bind(getGridCols), minmax(0, 1fr)) !important;
}
.p-dataview-content .grid {
  display: grid !important;
  flex-flow: row wrap;
}
</style>
