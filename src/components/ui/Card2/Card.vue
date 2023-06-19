<template>
  <div :class="mergedClass.base">
    <div :class="mergedClass.card">
      <div v-if="isHeaderVisible" :class="mergedClass.header">
        <div class="flex items-center mr-4">
          <!-- Icon -->
          <div v-if="isIconVisible" :class="mergedClass.icon">
            <slot name="icon"></slot>
          </div>

          <!-- Title and description -->
          <div>
            <h3 :class="mergedClass.title">{{ title }}</h3>
            <p :class="mergedClass.description">{{ description }}</p>
          </div>
        </div>
        <div v-if="isHeaderLeftVisible" class="grow">
          <slot name="header_left"></slot>
        </div>
        <!-- Right slot with dropdown menu -->
        <div v-if="isHeaderRightVisible" class="relative flex items-center">
          <slot name="header_right"></slot>
          <Dropdown
            v-if="menuItems.length > 0"
            :menuItems="menuItems"
            class="ml-4"
          />
        </div>
      </div>

      <!-- Content section -->
      <div :class="mergedClass.content">
        <Loading v-if="isLoading" />
        <slot />
        <slot name="content"></slot>
      </div>

      <!-- Footer with 3 columns -->
      <div v-if="isFooterVisible" :class="mergedClass.footer">
        <div class="w-3/12">
          <slot name="footer_left"></slot>
        </div>

        <div class="w-6/12">
          <slot name="footer_middle"></slot>
        </div>

        <div class="w-3/12">
          <slot name="footer_right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Dropdown from "./partials/Dropdown.vue";
import Loading from "./partials/Loading.vue";

interface Class {
  base?: Array<string>;
  card?: Array<string>;
  content?: string[];
  description?: Array<string>;
  footer?: string[];
  header?: Array<string>;
  icon?: Array<string>;
  title?: Array<string>;
}

interface MenuItem {
  action: () => void;
  label: string;
}

export default defineComponent({
  name: "Card",
  components: {
    Dropdown,
    Loading,
  },
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    classes: {
      type: Object as () => Class,
      default: () => ({}),
    },
    clearCss: {
      type: Array as () => string[],
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    menuItems: {
      type: Array as () => MenuItem[],
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const transitions = ["transition", "ease-in-out", "duration-200"];
    const defaultClass = {
      base: ["relative", "h-full"],
      card: [
        "flex",
        "flex-col",
        "rounded-lg",
        "bg-white",
        "shadow-lg",
        "dark:bg-slate-900",
        "transition",
        "duration-150",
        "ease-in-out",
        ...transitions,
      ],
      header: [
        "flex",
        "justify-between",
        "items-center",
        "rounded-t-lg",
        "px-6",
        "py-4",
      ],
      icon: [
        "h-6",
        "w-6",
        "text-gray-500",
        "mr-2",
        "dark:text-gray-400",
        ...transitions,
      ],
      title: [
        "text-lg",
        "leading-6",
        "font-medium",
        "text-gray-900",
        "dark:text-white",
        ...transitions,
      ],
      description: [
        "mt-1",
        "text-sm",
        "text-gray-500",
        "dark:text-gray-600",
        ...transitions,
      ],
      content: [
        "px-6",
        "py-4",
        "mb-4",
        "flex-1",
        "text-gray-800",
        "dark:text-white",
        ...transitions,
      ],
      footer: [
        "flex",
        "justify-between",
        "bg-gray-200",
        "px-6",
        "py-4",
        "rounded-b-lg",
        "dark:bg-gray-700",
        ...transitions,
      ],
    };

    const mergedClass = computed(() => {
      const merged: Class = { ...defaultClass };


      for (const key of props.clearCss) {
        if (merged[key] && Array.isArray(merged[key])) {
          merged[key] = [];
        }
      }

      for (const key in props.classes) {
        if (merged[key] && Array.isArray(props.classes[key])) {
          merged[key] = [...merged[key], ...props.classes[key]];
        }
      }

      return merged;
    });

    const hasSlot = (name) => {
      return slots[name] !== undefined;
    };

    const isFooterVisible = computed(() => {
      return (
        hasSlot("footer_left") ||
        hasSlot("footer_middle") ||
        hasSlot("footer_right")
      );
    });

    const isHeaderVisible = computed(() => {
      return (
        hasSlot("header_left") ||
        hasSlot("header_right") ||
        props.title ||
        props.description
      );
    });

    const isHeaderLeftVisible = computed(() => {
      return hasSlot("header_left");
    });

    const isHeaderRightVisible = computed(() => {
      return hasSlot("header_right") || props.menuItems.length > 0;
    });

    const isIconVisible = computed(() => {
      return hasSlot("icon");
    });

    return {
      isHeaderVisible,
      isHeaderLeftVisible,
      isHeaderRightVisible,
      isFooterVisible,
      isIconVisible,
      defaultClass,
      mergedClass,
    };
  },
});
</script>
