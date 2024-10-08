<template>
  <div v-on:mouseover="isOpen = true" v-on:mouseleave="isOpen = false">
    <router-link v-if="item.to" :to="item.to" v-slot="{ isActive }" custom>
      <button
        class="flex flex-row items-center mx-auto px-4 py-2 text-sm text-left rounded-md dark:focus:text-white dark:hover:text-white dark:focus:bg-gray-600 dark:hover:bg-gray-600 md:w-auto md:inline md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
        @click="isOpen = !isOpen"
        :class="{
          'text-gray-900 bg-gray-200': isActive,
        }"
      >
        <div class="flex flex-row items-center justify-center">
          <div v-if="item.icon" class="mr-2">
            <inline-svg :src="item.icon" class="h-4 w-4" />
          </div>
          {{ translate(item.label) }}
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            :class="{ 'rotate-180': isOpen, 'rotate-0': !isOpen }"
            class="inline w-4 h-4 ml-1 transition-transform duration-200 transform"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </button>
    </router-link>
    <div
      v-show="isOpen"
      class="absolute left-0 origin-top-right z-30"
      :class="{
        'rounded-md shadow-lg md:w-52': item.type === 'list',
        'md:max-w-screen-sm md:w-screen': item.type === 'grid',
      }"
    >
      <div
        class="mx-auto px-2 py-2 bg-white rounded-md shadow dark:bg-gray-800"
      >
        <div
          :class="{
            'grid grid-cols-1 grid-cols-2 gap-4': item.type === 'grid',
          }"
        >
          <div v-for="child in item.items" :key="child.label">
            <router-link
              v-if="item.type === 'list'"
              :to="child.to"
              v-slot="{ isActive, isExactActive, navigate }"
              custom
            >
              <button
                @click="changeRoute(navigate)"
                class="w-full block px-4 py-2 text-sm text-left text-gray-700 transition-colors duration-200 transform rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="[
                  defaultClass,
                  (isActive || isExactActive) && activeClass,
                ]"
              >
                <div class="flex flex-row items-center justify-left">
                  <div v-if="item.icon" class="mr-2">
                    <inline-svg :src="item.icon" class="h-4 w-4" />
                  </div>
                  {{ translate(child.label) }}
                </div>
              </button>
            </router-link>
            <router-link
              v-if="item.type === 'grid'"
              :to="child.to"
              v-slot="{ isActive, isExactActive, navigate }"
              custom
            >
              <button
                @click="changeRoute(navigate)"
                class="flex flex row w-full text-left items-start rounded-lg p-2 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                :class="[
                  defaultClass,
                  (isActive || isExactActive) && activeClass,
                ]"
              >
                <div v-if="item.icon" class="rounded-lg p-3">
                  <inline-svg :src="item.icon" class="md:h-6 md:w-6 h-4 w-4" />
                </div>
                <div class="ml-3">
                  <p class="font-semibold">{{ translate(child.label) }}</p>
                  <p class="text-sm">{{ translate(child.description) }}</p>
                </div>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { translate } from "../../../core/helpers/functions";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "DropdownMenu",
  components: {
    InlineSvg,
  },
  props: {
    activeClass: {
      type: String,
      default: "text-gray-900 bg-gray-200",
    },
    defaultClass: {
      type: String,
      default: "text-gray-700 hover:text-gray-900 hover:bg-gray-200",
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const isOpen = ref(false);
    const changeRoute = (navigate: any) => {
      navigate();
      isOpen.value = false;
    };
    return { changeRoute, isOpen, translate };
  },
});
</script>
