<template>
  <div
    class="bg-secondary-600 dark:bg-secondary-800 pb-16 relative"
    :class="[displayToolbar ? 'pt-8' : 'pt-[60px]']"
  >
    <div
      v-if="displayToolbar"
      id="vueadmin-toolbar"
      :class="{
        'w-full': contentWidth == 'fluid',
        container: contentWidth == 'fixed',
      }"
      class="px-6 mx-auto flex flex-row items-start lg:items-center justify-between"
    >
      <Breadcrumb
        v-if="displayBreadcrumbs"
        :title="title"
        :breadcrumbs="breadcrumbs"
        :currentPage="currentPage"
      />
      <div class="flex justify-end w-8/12 h-10 mt-auto">
        <div id="toolbar-actions" class="inline-flex" />
        <button
          @click="goBack()"
          class="flex items-center transition duration-150 ease-in-out rounded-xl bg-primary-500 hover:bg-primary-600 fill-white hover:fill-gray-300 text-sm ml-4 p-2 px-4"
        >
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z"
            />
            <path
              d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l-32-32l32-32H416C433.7 224 447.1 238.3 447.1 256z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  contentWidth,
  displayBreadcrumbs,
  displayToolbar,
} from "../../core/helpers/app";
import { goBack } from "../../core/helpers/functions";
import Breadcrumb from "./Breadcrumb.vue";
import Duotone from "../../components/ui/icons/Duotone.vue";

export default defineComponent({
  name: "Toolbar",
  props: {
    breadcrumbs: Array,
    currentPage: String,
    title: String,
  },
  components: {
    Breadcrumb,
    Duotone,
  },
  setup() {
    return {
      contentWidth,
      displayBreadcrumbs,
      displayToolbar,
      goBack,
    };
  },
});
</script>
