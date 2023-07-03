<template>
  <button
    class="block px-4 py-2 hover:bg-gray-200 w-full text-left"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DropdownItem",
  props: {
    label: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      props.onClick();
      emit("close");
    };

    return {
      handleClick,
    };
  },
});
</script>
