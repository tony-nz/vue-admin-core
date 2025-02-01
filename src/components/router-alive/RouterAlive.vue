<template>
  <KeepAlive v-if="!resetting" :include="cache.keys" :max="max">
    <Component
      :is="resolveComponent(Component)"
      v-if="!refreshing"
      ref="current"
      :key="currentKey"
    />
  </KeepAlive>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
  computed,
  defineComponent,
  nextTick,
  PropType,
  reactive,
  Ref,
  ref,
  toRefs,
  TransitionProps,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useTabsStore } from "../../store/tabs";

/**
 * Transition effect
 * @param {string | TransitionProps} opt Transition effect
 */
function resolveTransition(opt: string | TransitionProps) {
  return typeof opt === "string" ? { name: opt } : opt;
}

/**
 * Cache control
 * @param {Ref<string>} currentKey Current key
 */
function useCache(currentKey: Ref<string>, max: number) {
  /** Set of keys for cached components */
  const keys: Ref<string[]> = ref([]);

  return reactive({
    keys,

    /**
     * Remove from cache
     * @param {string} key Cache key
     */
    remove(key: string = currentKey.value) {
      if (!key) return;

      const idx = keys.value.indexOf(key);

      idx > -1 && keys.value.splice(idx, 1);
    },

    /**
     * Add to cache
     * @param {string} key Cache key
     */
    add(key: string = currentKey.value) {
      if (!keys.value.includes(key)) {
        if (keys.value.length >= max && max > 0) {
          keys.value.shift(); // Remove the oldest entry
        }
        keys.value.push(key);
      }
    },
  });
}

/**
 * Operations
 * @param {object} cache Cache control
 * @param {map} componentMap Component collection
 */
function useOperate(
  cache: ReturnType<typeof useCache>,
  componentMap: Map<string, ComponentInternalInstance>
) {
  /** Refreshing status */
  const refreshing = ref(false);

  /** Trigger refresh */
  async function triggerRefresh() {
    refreshing.value = true;
    await nextTick();
    refreshing.value = false;
  }

  /** Resetting status */
  const resetting = ref(false);

  /** Trigger reset */
  async function triggerReset() {
    resetting.value = true;
    cache.keys = [];
    componentMap.clear();

    await nextTick();
    resetting.value = false;
  }

  return reactive({
    refreshing,

    triggerRefresh,

    /** Refresh */
    async refresh() {
      cache.remove();
      await triggerRefresh();
      cache.add();
    },

    resetting,

    triggerReset,

    /** Reset cache */
    async reset() {
      await triggerReset();
      cache.add();
    },
  });
}

/** Route cache control */
export default defineComponent({
  name: "RouterAlive",
  provide() {
    /** Provide instance for child components to call */
    return {
      RouterAlive: this,
    };
  },
  props: {
    Component: {
      type: Object as PropType<any>,
      required: true,
    },
    /** Whether to enable caching by default */
    keepAlive: {
      type: Boolean,
      default: false,
    },
    viewKey: {
      type: String,
      default: "",
    },
    /** Whether to reuse route components */
    reuse: {
      type: Boolean,
      default: false,
    },
    /** Maximum number of caches, 0 means unlimited */
    max: {
      type: Number,
      default: 0,
    },
    /** Page class */
    pageClass: {
      type: [Array, Object, String],
      default: "router-alive-page",
    },
    /** Page scroll element selector */
    pageScroller: {
      type: String,
      default: "",
    },
    /** Transition effect */
    transition: {
      type: [String, Object] as PropType<string | TransitionProps>,
      default: () => ({
        name: "router-page-swap",
        mode: "out-in",
      }),
    },
  },
  setup(props) {
    /** Current page component */
    const current: Ref<null | ComponentPublicInstance> = ref(null);
    /** Current route */
    const route = useRoute();
    /** Current page component cache key */
    const currentKey = computed(() => route.fullPath);
    // const currentKey = computed(() => props.viewKey || route.fullPath);

    /** Cache control */
    const cache = useCache(currentKey, props.max);

    watch(
      currentKey,
      (val) => {
        /** Record components to be cached */
        val && cache.add(val);
      },
      { immediate: true }
    );

    const tabsStore = useTabsStore();

    watch(
      () => structuredClone(tabsStore.getTabs),
      (newTabs, oldTabs) => {
        if (!oldTabs) return;
        // Detect removed tabs
        const removedTabs = oldTabs.filter(
          (oldTab) => !newTabs.some((newTab) => newTab.path === oldTab.path)
        );
        // Remove cache for removed tabs
        removedTabs.forEach((tab) => {
          removeCache(tab.path);
        });
      },
      { deep: true }
    );

    /**
     * Remove cache for a specific route by its key
     * @param {string} key - The cache key to remove
     */
    function removeCache(key: string) {
      cache.remove(key);
      componentMap.delete(key);
    }

    /** Component collection */
    const componentMap: Map<string, ComponentInternalInstance> = new Map();

    return {
      current,
      currentKey,

      /**
       * Handle route component
       * @description
       * Change the component name to the cache key to control caching with `KeepAlive`'s `include`
       */
      resolveComponent(component: ComponentInternalInstance) {
        if (component) {
          const key = currentKey.value;
          let target = componentMap.get(key);

          if (!target) {
            /** Copy component for multiple cache instances */
            target = {
              ...component,
              type: { ...component.type, name: key },
            };
            componentMap.set(key, target);
          }

          return target;
        }

        return component;
      },

      cache,

      /** Operations */
      ...toRefs(useOperate(cache, componentMap)),

      /** Page transition effect */
      pageTransition: computed(() => resolveTransition(props.transition)),

      /** Remove cache */
      removeCache,
    };
  },
});
</script>

<style lang="scss">
// Transition styles
.router-tab-zoom {
  &-enter-active,
  &-leave-active {
    transition: all 0.4s;
  }

  &-enter,
  &-leave-to {
    transform: scale(0);
    opacity: 0;
  }
}

// Page swap
.router-page-swap {
  $trans: 30px; // Move distance

  &-enter-active,
  &-leave-active {
    transition: all 0.5s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-enter {
    transform: translateX(-$trans);
  }

  &-leave-to {
    transform: translateX($trans);
  }
}
</style>
