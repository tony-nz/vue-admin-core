<template>
  <header class="sticky top-0 z-10">
    <TopMenu :tab="activeTab" @changeTab="switchTab" />
    <SecondaryMenu :tab="activeTab" />
  </header>
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
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
  },
  setup() {
    const activeTab = ref(0);
    return {
      activeTab,
    };
  },
});
</script>

<style scoped>
/* TODO move to css file */
.p-menubar {
  padding: 1rem 0;
  background: none;
  border: none;
}
</style>
