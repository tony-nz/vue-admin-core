<template>
  <header class="sticky top-0 z-10">
    <TopMenu
      :tab="activeTab"
      @changeTab="switchTab"
      @openCanvas="showCanvas = true"
      @closeCanvas="showCanvas = false"
    />
    <SecondaryMenu :tab="activeTab" />
  </header>
  <OffCanvas v-model="showCanvas" @close="showCanvas = false" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TopMenu from "./TopMenu.vue";
import SecondaryMenu from "./SecondaryMenu.vue";

export default defineComponent({
  name: "Header",
  components: {
    SecondaryMenu,
    TopMenu,
  },
  setup() {
    const activeTab = ref(0);
    const showCanvas = ref(false);

    /**
     * Switch the active tab
     */
    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    return {
      activeTab,
      showCanvas,
      switchTab,
    };
  },
});
</script>
