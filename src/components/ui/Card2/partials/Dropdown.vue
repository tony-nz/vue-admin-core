<template>
  <div>
    <button @click="toggleMenu" class="flex items-center focus:outline-none">
      <svg
        class="h-5 w-5 dark:fill-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 512"
      >
        <path
          d="M64 472C33.07 472 8 446.9 8 416C8 385.1 33.07 360 64 360C94.93 360 120 385.1 120 416C120 446.9 94.93 472 64 472zM64 152C33.07 152 8 126.9 8 96C8 65.07 33.07 40 64 40C94.93 40 120 65.07 120 96C120 126.9 94.93 152 64 152z"
        />
        <path
          class="opacity-40"
          d="M64 200C94.93 200 120 225.1 120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200z"
        />
      </svg>
    </button>

    <div
      v-if="isMenuOpen"
      ref="menuRef"
      class="absolute right-0 mt-2 w-48 rounded-lg border bg-white py-2 shadow-lg"
    >
      <template v-for="(item, index) in menuItems" :key="index">
        <DropdownItem
          :icon="item.icon"
          :label="item.label"
          :onClick="item.action"
          @close="toggleMenu"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, Ref } from "vue";
import DropdownItem from "./DropdownItem.vue";

interface MenuItem {
  label: string;
  icon?: string;
  action: () => void;
}

export default defineComponent({
  name: "Dropdown",
  components: {
    DropdownItem,
  },
  props: {
    menuItems: {
      type: Array as () => MenuItem[],
      default: () => [],
    },
  },
  setup() {
    const isMenuOpen = ref(false);
    const menuRef: Ref<HTMLElement | null> = ref(null);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const handleClickOutside = (event) => {
      if (
        isMenuOpen.value &&
        menuRef.value &&
        !menuRef.value.contains(event.target)
      ) {
        isMenuOpen.value = false;
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        isMenuOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyPress);
    });

    onUnmounted(() => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    });

    return {
      isMenuOpen,
      toggleMenu,
      menuRef,
    };
  },
});
</script>
