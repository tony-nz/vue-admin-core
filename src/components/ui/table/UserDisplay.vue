<template>
  <div v-if="isMounted && user">
    <router-link :to="'/main/users/' + user.id">
      <div class="flex items-center">
        <span class="flex-none inline-block relative">
          <img
            :class="getCss"
            v-bind:src="
              getBase64Avatar(
                user.avatar ? user.avatar : null
              )
            "
            alt=""
          />
          <span
            v-if="online"
            class="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white bg-green-400"
          />
        </span>
        <div class="ml-3 truncate">
          <div class="font-medium text-gray-900 truncate">
            {{ user.fullName }}
          </div>
          <div class="text-gray-500 truncate">{{ user.primaryEmail }}</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { getBase64Avatar } from "../../../core/helpers/functions";

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true,
    },
    css: {
      type: String,
      default: "inline-block rounded-md",
    },
    size: {
      type: String,
      default: "h-10 w-10",
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isMounted = ref(false);
    const getCss = computed(() => {
      return props.css + " " + props.size;
    });
    onMounted(async () => {
      isMounted.value = true;
    });
    return {
      getBase64Avatar,
      getCss,
      isMounted,
    };
  },
});
</script>
