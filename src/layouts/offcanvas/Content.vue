<template>
  <div class="sm:hidden lg:block p-8">
    <div
      class="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px"
    >
      <div
        v-for="(action, actionIdx) in actions"
        :key="action.title"
        :class="[
          actionIdx === 0
            ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
            : '',
          actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
          actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
          actionIdx === actions.length - 1
            ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
            : '',
          'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
        ]"
      >
        <div>
          <span
            :class="[
              action.iconBackground,
              action.iconForeground,
              'rounded-lg inline-flex p-3 ring-4 ring-white',
            ]"
          >
            <component :is="action.icon" class="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        <div class="mt-8">
          <h3 class="text-lg font-medium">
            <a :href="action.href" class="focus:outline-none">
              <span class="absolute inset-0" aria-hidden="true" />
              {{ action.title }}
            </a>
          </h3>
        </div>
        <span
          class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
          aria-hidden="true"
        >
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Content",
  setup() {
    const actions = [
      {
        title: "Analytics",
        href: "#",
        icon: "",
        iconBackground: "bg-indigo-500",
        iconForeground: "text-white",
      },
      {
        title: "Engagement",
        href: "#",
        icon: "",
        iconBackground: "bg-green-500",
        iconForeground: "text-white",
      },
      {
        title: "Security",
        href: "#",
        icon: "",
        iconBackground: "bg-yellow-500",
        iconForeground: "text-white",
      },
      {
        title: "Integrations",
        href: "#",
        icon: "",
        iconBackground: "bg-pink-500",
        iconForeground: "text-white",
      },
      {
        title: "Automations",
        href: "#",
        icon: "",
        iconBackground: "bg-blue-500",
        iconForeground: "text-white",
      },
    ];
    return {
      actions,
    };
  },
});
</script>
