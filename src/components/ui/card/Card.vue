<template>
  <div
    class="rounded-lg bg-white overflow-hidden mb-4 py-4 shadow w-full dark:bg-slate-900"
    :class="getClasses"
    :style="style"
  >
    <Loading v-if="isLoading" />
    <div
      v-if="title || slots.toolbar"
      class="flex justify-between items-center flex-wrap border-b border-gray-200 pb-2 sm:flex-nowrap dark:border-gray-600"
      :class="{ hidden: isLoading }"
    >
      <div class="ml-6 my-2">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-600">
          {{ description }}
        </p>
      </div>
      <div class="mr-6 my-2 flex-shrink-0">
        <slot name="toolbar" />
      </div>
    </div>
    <div :class="getContentClasses">
      <slot />
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, useSlots } from "vue";
import Loading from "./partials/Loading.vue";

export default defineComponent({
  name: "Card",
  components: {
    Loading,
  },
  props: {
    contentClass: {
      type: String,
    },
    class: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    style: {
      type: String,
    },
  },
  setup(props) {
    const slots = useSlots();
    const headerEmpty = ref(true);
    const isMounted = ref(false);
    const getClasses = computed(() => {
      return props.class ? props.class : "";
    });
    const getContentClasses = computed(() => {
      const hidden = props.isLoading ? " hidden" : "";
      return props.contentClass
        ? props.contentClass + hidden
        : "px-4 py-5 sm:p-6 h-full" + hidden;
    });

    onMounted(async () => {
      if (props.title == null) {
        headerEmpty.value = false;
      }
      isMounted.value = true;
    });

    return {
      getClasses,
      getContentClasses,
      headerEmpty,
      isMounted,
      slots,
    };
  },
});
</script>

<style>
.panel-footer:empty {
  display: none;
}
</style>
