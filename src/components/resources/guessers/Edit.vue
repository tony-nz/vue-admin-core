<template>
  <div>Edit</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Edit",
  props: {
    title: {
      type: String,
    },
    resource: {
      type: Object,
    },
  },
  setup() {
    return {};
  },
});
</script>
