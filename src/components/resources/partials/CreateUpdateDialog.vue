<template>
  <div>
    <Dialog
      :header="
        type == 'create'
          ? 'Create ' + resource.label
          : 'Update ' + resource.label
      "
      v-model:visible="showModal"
      :modal="true"
      :maximizable="true"
      :breakpoints="{ '1280px': '75vw' }"
      :style="{ width: '50vw' }"
      :closeOnEscape="true"
      @hide="close"
    >
      <div class="m-0">
        <VueFormGenerator
          @updateData="updateData"
          @validated="validated"
          @onChange="onChange"
          :allowedFields="allowedFields"
          :data="modalData"
          :fetchData="fetchData"
          :form="fields"
          :hiddenFields="hidden"
          :type="'form'"
          :submit="submit"
        />
      </div>
      <div v-if="errors.length > 0">
        <div class="bg-red-100 border-red-600 p-4">
          <ul class="mb-0">
            <li v-for="(error, key) in errors" :key="key">
              <ul>
                <li>
                  {{ error }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="close"
          class="p-button-text"
        />
        <Button
          :disabled="submit"
          :label="type === 'create' ? 'Create' : 'Update'"
          icon="pi pi-check"
          class="btn bg-primary-500"
          @click="onSubmit"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import useResource from "../../../composables/useResource";
import { defineComponent, onMounted, ref, watch } from "vue";
import ApiService from "../../../core/services/ApiService";
import useAppStore from "../../../store/app";
import useResourceStore from "../../../store/resource";
import { getSingularizedLabel } from "../../../core/helpers/functions";

export default defineComponent({
  name: "CreateUpdateDialog",
  methods: {
    close() {
      this.$emit("close");
    },
    onSubmit() {
      this.submit = true;
    },
    updateData(data) {
      this.modalData = data;
    },
  },
  props: {
    allowedFields: {
      type: Array,
      required: false,
    },
    data: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
    },
    fieldFilters: {
      type: Object,
      required: false,
    },
    fieldValues: {
      type: Object,
      required: false,
    },
    hidden: {
      type: Array,
    },
    type: {
      type: String,
    },
    primaryKey: {
      type: String,
      default: "id",
    },
    resource: {
      type: Object,
      required: true,
    },
    subId: {
      type: Number,
      default: null,
    },
  },
  setup(props, { emit }) {
    const dataId = ref();
    const fieldValues = ref();
    const modalData = ref();
    const modalType = ref(props.type);
    const showModal = ref(false);
    const submit = ref(false);
    const resource = ref();
    const errors = ref([]);
    const { create, update } = useResource(props.resource);

    const validated = async (valid, data = null) => {
      modalData.value = data;
      // clear errors
      errors.value = [];

      if (valid) {
        if (fieldValues.value) {
          // add fieldValues to modalData
          modalData.value = { ...modalData.value, ...fieldValues.value };
        }

        if (modalType.value == "create") {
          // emit("create", modalData.value, dataId.value, props.subId).then(() => {
          await create(modalData.value, dataId.value, props.subId)
            .then((repsonse) => {
              emit("close");
            })
            .catch((e) => {
              if (e.response.errors) {
                Object.keys(e.response.data.errors).forEach((key, index) => {
                  errors.value[index] = e.response.data.errors[key][0];
                });
              } else if (e.message) {
                errors.value[0] = e.message;
              }
              submit.value = false;
            });
        } else if (modalType.value == "update") {
          await update(modalData.value, dataId.value, props.subId)
            .then((repsonse) => {
              emit("close");
            })
            .catch((e) => {
              if (e.response.errors) {
                Object.keys(e.response.data.errors).forEach((key, index) => {
                  errors.value[index] = e.response.data.errors[key][0];
                });
              } else if (e.message) {
                errors.value[0] = e.message;
              }
              submit.value = false;
            });
        }
        // this.$emit("close");
      }
      submit.value = false;
    };

    function fetchData(params) {
      const appStore = useAppStore();
      const resources = appStore.getResources;

      if (params.resource) {
        try {
          for (const [key, value] of Object.entries(resources)) {
            if (value.name == params.resource.name) {
              resource.value = value;
            }
          }
          const resourceStore = useResourceStore(resource.value)();
          return resourceStore
            .getList({
              subId: props.subId,
            })
            .then(({ data }) => {
              if (typeof data == "undefined") {
                return null;
              }
              return data;
            });
        } catch (e) {
          // TODO ERROR LOG
          console.log(e);
        }
      }
      return ApiService.get(params.url).then((res) => {
        // state.value.options[fieldId] = res.data.data;
        return res.data.data;
      });
    }

    /**
     * Emit liveData event
     * @param data
     */
    const onChange = (data) => {
      emit("liveData", data);
    };

    /**
     * Watch for new prop data
     */
    watch(
      () => props.data,
      async (newData) => {
        modalData.value = newData;
      },
      { deep: true }
    );

    onMounted(() => {
      dataId.value = props.data[props.primaryKey];
      fieldValues.value = props.fieldValues;

      modalData.value = props.data;

      // show modal
      showModal.value = true;
    });

    return {
      dataId,
      errors,
      fetchData,
      getSingularizedLabel,
      modalData,
      modalType,
      onChange,
      showModal,
      submit,
      validated,
    };
  },
});
</script>
