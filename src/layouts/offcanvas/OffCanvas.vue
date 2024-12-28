<template>
  <Drawer v-model:visible="showCanvas">
    <template #container="{ closeCallback }">
      <div class="flex flex-row h-full">
        <TopMenu
          :tab="activeTab"
          @changeTab="switchTab"
          @close="closeCallback"
        />
        <SecondaryMenu :tab="activeTab" @close="closeCallback" />
      </div>
    </template>
  </Drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { translate } from "../../core/helpers/functions";
import Content from "./Content.vue";
import Header from "./Header.vue";
import SecondaryMenu from "./SecondaryMenu.vue";
import TopMenu from "./TopMenu.vue";

export default defineComponent({
  name: "OffCanvas",
  components: {
    Content,
    Header,
    SecondaryMenu,
    TopMenu,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const activeTab = ref(0);
    const showCanvas = ref(props.modelValue);

    /**
     * Switch the active tab
     */
    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        showCanvas.value = newValue;
      }
    );

    watch(showCanvas, (newValue) => {
      emit("update:modelValue", newValue);
    });

    return {
      activeTab,
      showCanvas,
      switchTab,
      translate,
    };
  },
});
</script>
