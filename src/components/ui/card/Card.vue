<template>
  <div :class="mergedClass.base">
    <div :class="mergedClass.card">
      <div v-if="isHeaderVisible" :class="mergedClass.header">
        <div class="flex justify-between w-full">
          <div class="flex items-center gap-2">
            <div v-if="isIconVisible" :class="mergedClass.icon">
              <slot name="icon"></slot>
            </div>
            <div v-if="title || description">
              <h3 v-if="title" :class="mergedClass.title">{{ title }}</h3>
              <p v-if="description" :class="mergedClass.description">
                {{ description }}
              </p>
            </div>
          </div>
          <div v-if="isHeaderLeftVisible" class="grow">
            <slot name="header_left"></slot>
          </div>
          <div v-if="isHeaderRightVisible" class="relative flex items-center">
            <slot name="header_right"></slot>
          </div>
        </div>
        <slot name="header_extend"></slot>
      </div>
      <div :class="mergedClass.content">
        <Loading v-if="isLoading" />
        <slot />
        <slot name="content"></slot>
      </div>
      <div v-if="isFooterVisible" :class="mergedClass.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Loading from "./partials/Loading.vue";

// Export the interfaces so they can be used in other components
export interface Class {
  base?: Array<string>;
  card?: Array<string>;
  content?: string[];
  description?: Array<string>;
  footer?: string[];
  header?: Array<string>;
  icon?: Array<string>;
  title?: Array<string>;
}

export default defineComponent({
  name: "Card",
  components: {
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
        "py-6",
        "border-b",
        "border-gray-200",
        "dark:border-gray-600",
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
      return hasSlot("footer");
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
      return hasSlot("header_right");
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
