<template>
  <div
    class="bg-emerald-600 bg-breadcrumb-hero pt-8 pb-16 relative"
  >
    <div
      id="vueadmin-toolbar"
      :class="{
        'container-fluid': toolbarWidthFluid == 'fluid',
        container: toolbarWidthFluid == 'fixed',
      }"
      class="px-6 mx-auto flex flex-row items-start lg:items-center justify-between"
    >
      <!-- Breadcrumbs starts -->
      <Breadcrumb
        :title="title"
        :breadcrumbs="breadcrumbs"
        :currentPage="currentPage"
      />
      <!-- Breadcrumbs ends -->
      <div class="flex justify-end w-8/12 h-10 mt-auto">
        <div id="toolbar-actions" class="inline-flex" />
        <button
          @click="goBack()"
          class="flex items-center transition duration-150 ease-in-out rounded-xl bg-opacity-30 bg-primary-700 hover:bg-gray-100 fill-white fill-gray-300 text-sm ml-4 p-2 px-4"
        >
          <Duotone name="arrow-left" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { goBack } from "../../core/helpers/functions";
import { toolbarWidthFluid } from "../../core/helpers/config";
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
      goBack,
      toolbarWidthFluid,
    };
  },
});
</script>
