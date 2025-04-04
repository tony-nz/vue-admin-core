<template>
  <slot name="header_left" />
  <div class="flex flex-col w-full bg-gray-300">
    <div class="flex flex-row w-full p-2 bg-primary-600">
      <slot name="header_icon" />
      <div class="px-2 py-1 w-full">
        <h3
          class="text-lg leading-6 font-medium text-gray-900 dark:text-white transition ease-in-out duration-200 text-white"
        >
          {{
            toolbar?.title
              ? toolbar.title
              : typeof resource.label === "function"
              ? resource.label({}, "list")
              : resource.label || resource.singularName
          }}
        </h3>
        <p
          class="mt-1 text-sm text-gray-500 dark:text-gray-600 transition ease-in-out duration-200 text-white text-opacity-60 dark:text-white"
        >
          {{
            toolbar?.description
              ? toolbar.description
              : typeof resource.label === "function"
              ? resource.label({}, "list").toLowerCase()
              : `List of ${
                  resource.label?.toLowerCase() || resource.singularName
                }`
          }}
        </p>
      </div>
      <div
        class="flex flex-column items-center w-full justify-end md:flex-row md:justiify-content-between gap-2 dark:bg-transparent"
      >
        <div
          v-if="showSearch || filters['global'].value"
          class="flex w-full justify-end p-1.5"
        >
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
              @click="clearSearch"
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
        <slot></slot>
        <Button
          v-if="
            toolbar?.buttons?.bulkDelete &&
            canAction('delete') &&
            selectedResources &&
            selectedResources.length > 0
          "
          @click="showDeletePopup({ $event, selectedResources })"
          :disabled="selectedResources?.length === 0 || !selectedResources"
          :label="
            typeof resource.label === 'function'
              ? resource.label({}, 'bulkDelete')
              : translate('va.actions.bulkDelete') + ' ' + resource.label ||
                resource.singularName
          "
          class="whitespace-nowrap overflow-visible"
          icon="pi pi-delete"
          severity="danger"
        />
        <Button
          v-if="
            resource?.create?.modal &&
            toolbar?.buttons?.create &&
            canAction('create') &&
            typeof resource.create === 'function'
          "
          @click="resource.create(formData)"
          :label="
            typeof resource.label === 'function'
              ? resource.label({}, 'create')
              : translate('va.actions.create') + ' ' + resource.label ||
                resource.singularName
          "
          class="whitespace-nowrap overflow-visible"
          icon="pi pi-plus"
          severity="info"
        />
        <Button
          v-if="
            resource?.create?.modal &&
            toolbar?.buttons?.create &&
            canAction('create')
          "
          @click="showCreateEdit('dialog', 'create', formData)"
          :label="
            typeof resource.label === 'function'
              ? resource.label({}, 'create')
              : translate('va.actions.create') + ' ' + resource.label ||
                resource.singularName
          "
          class="whitespace-nowrap overflow-visible"
          icon="pi pi-plus"
          severity="info"
        />
        <router-link
          v-else-if="
            resource?.create?.page &&
            toolbar?.buttons?.create &&
            canAction('create')
          "
          :to="resource.url + '/create'"
        >
          <Button
            :label="
              typeof resource.label === 'function'
                ? resource.label({}, 'create')
                : translate('va.actions.create') + ' ' + resource.label ||
                  resource.singularName
            "
            class="whitespace-nowrap overflow-visible"
            icon="pi pi-plus"
            severity="info"
          />
        </router-link>
        <Button
          v-if="toolbar?.buttons?.search"
          @click="toggleSearch"
          class="px-4"
          icon="pi pi-search"
          severity="info"
        />
        <Button
          v-if="toolbar?.buttons?.refresh"
          @click="refreshData"
          class="px-4"
          icon="pi pi-refresh"
          severity="info"
        />
        <Button
          v-if="toolbar?.buttons?.export"
          @click="exportCSV"
          class="px-4"
          icon="pi pi-download"
          severity="info"
        />
      </div>
    </div>
  </div>
  <slot name="header_right" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ToolbarOptions } from "../../../../core/types/DatatableTypes";
import { translate } from "../../../../core/helpers/functions";
import { useDebounce } from "../../../../composables/useDebounce";

export default defineComponent({
  name: "AdvToolbar",
  props: {
    filters: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: false,
    },
    modalData: {
      type: Object,
      required: false,
    },
    onFilter: {
      type: Function,
      required: true,
    },
    toolbar: {
      type: Object as () => ToolbarOptions,
      required: true,
    },
    resource: {
      type: Object,
      required: true,
    },
    selectedResources: {
      type: Array,
      required: false,
    },
  },
  setup(_props, { emit }) {
    const debounce = useDebounce();
    const showSearch = ref(false);
    const { canAction } = _props.resource;

    /**
     * Clear search
     */
    const clearSearch = () => {
      emit("clearSearch");
      refreshData();
    };

    /**
     * Export CSV
     */
    const exportCSV = () => {
      emit("export");
    };

    /**
     * Refresh resource data
     * @description Emit refresh event
     */
    const refreshData = () => {
      emit("refresh");
    };

    /**
     * Show create/edit modal
     * @param {string} type
     * @param {Object} data
     * @param {Object} modalData
     */
    const showCreateEdit = (type, data, modalData) => {
      emit("createEdit", type, data, modalData);
    };

    /**
     * Show delete popup
     * @param {Event} event
     */
    const showDeletePopup = (event) => {
      emit("delete", event);
    };

    /**
     * Toggle search
     */
    const toggleSearch = () => {
      showSearch.value = !showSearch.value;
    };

    return {
      canAction,
      clearSearch,
      debounce,
      exportCSV,
      refreshData,
      showCreateEdit,
      showDeletePopup,
      showSearch,
      toggleSearch,
      translate,
    };
  },
});
</script>
