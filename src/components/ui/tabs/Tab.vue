<script>
import { computed, inject, watchEffect, getCurrentInstance } from "vue";

export default {
  name: "UITab",
  props: {
    activeClass: [String],
    inActiveClass: [String],
    isRoute: {
      type: Boolean,
      default: false,
    },
    classValue: [String],
  },
  setup(props) {
    const instance = getCurrentInstance();
    const { tabs, selectTab, active } = inject("tabsState", {
      tabs: [],
      selectTab: () => {},
    });
    const index = computed(() =>
      tabs.value.findIndex((target) => target.uid === instance.uid)
    );
    const isActive = computed(() => index.value === active.value);

    const activeteTab = () => {
      if (!props.isRoute) {
        selectTab(index.value);
      }
    };

    watchEffect(() => {
      if (index.value === -1) {
        tabs.value.push(instance);
      }
    });

    return {
      activeteTab,
      isActive,
    };
  },
};
</script>

<template>
  <div :class="isActive ? activeClass : inActiveClass" @click="activeteTab">
    <slot name="item" :isActive="isActive" />
  </div>
</template>
