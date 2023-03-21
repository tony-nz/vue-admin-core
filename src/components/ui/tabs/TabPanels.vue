<script>
import { ref, provide, computed } from "vue";

export default {
  name: "UITabPanels",
  props: {
    modelValue: [String, Number],
    classValue: [String],
  },
  setup(props) {
    provide("tabsPanelState", {
      active: computed(() => props.modelValue),
      panels: ref([]),
    });
  },
};
</script>

<template>
  <div :class="classValue">
    <slot />
  </div>
</template>
