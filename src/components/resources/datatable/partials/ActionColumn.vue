<template>
  <div :class="flex" class="flex gap-2">
    <slot name="actionCol" :data="data" />
    <template v-if="resource.lock && showDefaults && canAction('update')">
      <button
        @click.stop="$emit('changeLock', data)"
        v-tooltip="
          data.locked
            ? 'Unlock ' + resource.singularName.toLowerCase()
            : 'Lock ' + resource.singularName.toLowerCase()
        "
        :class="btnLockClass"
      >
        <svg
          v-if="data.locked"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.6274517,4.55882251 L14.4693753,6.2959371 C13.9280401,5.51296885 13.0239252,5 12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L14,10 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C13.4280904,3 14.7163444,3.59871093 15.6274517,4.55882251 Z"
          />
        </svg>
        <svg
          v-else
          class="h-4 w-4"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 Z M12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L15,10 L15,8 C15,6.34314575 13.6568542,5 12,5 Z"
          />
        </svg>
      </button>
    </template>
    <template v-if="resource.edit.modal && showDefaults && canAction('update')">
      <button
        @click.stop="$emit('showCreateEdit', 'dialog', 'update', data)"
        v-tooltip="'Edit ' + resource.singularName.toLowerCase()"
        :disabled="data.locked"
        :class="btnClass"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            :class="data.locked ? 'opacity-30' : ''"
            d="M392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66zM437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7L339.7 74.34L437.7 172.3z"
          />
          <path
            :class="data.locked ? 'opacity-30' : 'opacity-40'"
            d="M0 160C0 106.1 42.98 64 96 64H192C209.7 64 224 78.33 224 96C224 113.7 209.7 128 192 128H96C78.33 128 64 142.3 64 160V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V320C384 302.3 398.3 288 416 288C433.7 288 448 302.3 448 320V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V160z"
          />
        </svg>
      </button>
    </template>
    <template v-if="resource.show.page && showDefaults && canAction('update')">
      <router-link
        :to="{ name: resource.label + 'Show', params: { id: data.id } }"
        v-tooltip="'Open ' + resource.singularName.toLowerCase()"
      >
        <button :class="btnClass">
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              d="M572.6 270.3l-96 192C471.2 473.2 460.1 480 447.1 480H0l119.2-238.3C124.6 230.8 135.7 224 147.8 224h396.2C567.7 224 583.2 249 572.6 270.3z"
            />
            <path
              class="opacity-40"
              d="M480 144V224H147.8C135.7 224 124.6 230.8 119.2 241.7L0 480V80C0 53.49 21.49 32 48 32h160l64 64h160C458.5 96 480 117.5 480 144z"
            />
          </svg>
        </button>
      </router-link>
    </template>
    <template v-if="resource.delete && showDefaults && canAction('delete')">
      <button
        @click="$emit('deletePopup', { $event, data })"
        v-tooltip="'Delete ' + resource.singularName.toLowerCase()"
        :disabled="data.locked"
        :class="btnDelClass"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            :class="data.locked ? 'opacity-30' : ''"
            d="M284.2 0C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2z"
          />
          <path
            :class="data.locked ? 'opacity-30' : 'opacity-40'"
            d="M416 448C416 483.3 387.3 512 352 512H96C60.65 512 32 483.3 32 448V96H416V448zM144 176C144 167.2 136.8 160 128 160C119.2 160 112 167.2 112 176V400C112 408.8 119.2 416 128 416C136.8 416 144 408.8 144 400V176zM240 176C240 167.2 232.8 160 224 160C215.2 160 208 167.2 208 176V400C208 408.8 215.2 416 224 416C232.8 416 240 408.8 240 400V176zM336 176C336 167.2 328.8 160 320 160C311.2 160 304 167.2 304 176V400C304 408.8 311.2 416 320 416C328.8 416 336 408.8 336 400V176z"
          />
        </svg>
      </button>
    </template>
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
      type: [String, undefined],
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
    const { canAction } = props.resource;

    const btnClass = computed(() => {
      return "p-button transition duration-150 ease-in-out btn bg-gray-100 border-gray-800 rounded-lg fill-gray-400 disabled:hover:fill-gray-400 hover:bg-primary-400 disabled:hover:bg-gray-100 dark:bg-slate-700 hover:fill-white p-2 shadow";
    });
    const btnDelClass = computed(() => {
      return "p-button transition duration-150 ease-in-out btn bg-red-100 border-gray-800 rounded-lg fill-red-400 disabled:hover:fill-gray-400 hover:bg-red-400 hover:fill-white disabled:hover:bg-gray-100 dark:bg-red-800 p-2 shadow";
    });
    const btnLockClass = computed(() => {
      return "p-button transition duration-150 ease-in-out btn bg-gray-100 border-gray-800 rounded-lg fill-gray-400 disabled:hover:fill-gray-400 hover:bg-orange-300 hover:fill-white disabled:hover:bg-gray-100 dark:bg-slate-700 p-2 shadow";
    });
    const getData = computed(() => {
      return props.data.data;
    });
    const getGridColLength = computed(() => {
      return "grid gap-3 grid-cols-" + props.length;
    });
    return {
      btnClass,
      btnDelClass,
      btnLockClass,
      canAction,
      getData,
      getGridColLength,
    };
  },
});
</script>
