<script>
import { provide, computed, ref } from "vue";

export default {
  name: "UITabs",
  props: {
    childClass: {
      type: String,
      default: "flex h-full",
    },
    modelValue: {
      type: [String, Number],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { slots, emit }) {
    const active = computed(() => props.modelValue);
    const tabs = ref([]);

    function selectTab(tab) {
      emit("update:modelValue", tab);
    }

    provide("tabsState", {
      active,
      tabs,
      selectTab,
    });
  },
};
</script>

<template>
  <div :class="childClass">
    <slot />
  </div>
  <div class="bg-gray-300 -m-1 h-1"></div>
</template>
