<template>
  <div :class="flex" class="flex gap-2">
    <slot name="actionCol" :data="data" />
    <div v-if="resource.edit.sideBar && showDefaults">
      <ActionBtn
        @click="$emit('showCreateEdit', 'sidebar', 'update', data)"
        :ariaLabel="'Quick Edit'"
        :icon="'pen-to-square'"
      />
    </div>
    <div v-if="resource.edit.modal && showDefaults">
      <ActionBtn
        @click="$emit('showCreateEdit', 'dialog', 'update', data)"
        :ariaLabel="'Edit'"
        :icon="'pen-to-square'"
      />
    </div>
    <div v-if="resource.edit.page && showDefaults">
      <router-link :to="'/sms/' + resource.name + '/' + data.id">
        <ActionBtn :ariaLabel="'View'" :icon="'folder-open'" />
      </router-link>
    </div>
    <div v-if="resource.delete && showDefaults">
      <ActionBtn
        @click="$emit('deletePopup', { $event, data })"
        :ariaLabel="'Delete'"
        :icon="'trash-can'"
        type="delete"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import ActionBtn from "../../../ui/button/ActionBtn.vue";

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
    },
    resource: {
      type: Object,
      required: true,
    },
    length: {
      type: Number,
      required: false,
      default: 3,
    },
    flex: {
      type: String,
      default: "justify-end",
      required: false,
    },
    class: {
      type: String,
      required: false,
    },
    showDefaults: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ActionBtn,
  },
  setup(props) {
    const btnClass = computed(() => {
      return props.class
        ? props.class
        : "transition duration-150 ease-in-out btn bg-gray-100 border-gray-800 rounded-lg fill-gray-400 hover:bg-primary-400 hover:fill-white p-2 shadow";
    });
    const getData = computed(() => {
      return props.data.data;
    });
    const getGridColLength = computed(() => {
      return "grid gap-3 grid-cols-" + props.length;
    });
    return {
      btnClass,
      getData,
      getGridColLength,
    };
  },
});
</script>
