<template>
  <div class="flex-col flex lg:flex-row items-start lg:items-center w-4/12">
    <div>
      <h4 class="text-2xl font-bold leading-tight text-white mb-2">
        {{ title }}
      </h4>
      <p
        class="flex items-center text-gray-300 text-xs bg-emerald-700 bg-opacity-30 rounded-xl p-2 px-4"
      >
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <router-link :to="generatePath(breadcrumbs, index)">
            <span class="cursor-pointer text-xs"> {{ item }} </span>
          </router-link>
          <span class="mx-2"> &gt; </span>
        </template>
        <span v-if="currentPage" class="cursor-pointer">
          {{ currentPage }}
        </span>
        <span v-else class="cursor-pointer text-xs"> {{ title }} </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Breadcrumb",
  props: {
    breadcrumbs: Array,
    currentPage: String,
    title: String,
  },
  setup() {
    const generatePath = (breadcrumbs: any, index: number) => {
      let path = "";
      for (let i = 0; i <= index; i++) {
        path += "/" + breadcrumbs[i];
      }
      return path.toLowerCase();
    };
    // const generatePath = (breadcrumbs: Array, index: number) => {
    //   let path = "";
    //   for (let i = 0; i <= index; i++) {
    //     path += "/" + breadcrumbs[i];
    //   }
    //   return path;
    // };
    return {
      generatePath,
    };
  },
});
</script>
