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
import { computed, defineComponent, onMounted, watch, ref } from "vue";
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
    const dataValues = ref();
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
        if (dataValues.value) {
          // add dataValues to modalData
          modalData.value = { ...modalData.value, ...dataValues.value };
        }

        if (modalType.value == "create") {
          // emit("create", modalData.value, dataId.value, props.subId).then(() => {
          await create(modalData.value, dataId.value, props.subId)
            .then((repsonse) => {
              console.log("repsonse", repsonse);
              emit("close");
            })
            .catch((e) => {
              Object.keys(e.response.data.errors).forEach((key, index) => {
                errors.value[index] = e.response.data.errors[key][0];
              });
            });
        } else if (modalType.value == "update") {
          await update(modalData.value, dataId.value, props.subId)
            .then((repsonse) => {
              console.log("repsonse", repsonse);
              emit("close");
            })
            .catch((e) => {
              Object.keys(e.response.data.errors).forEach((key, index) => {
                errors.value[index] = e.response.data.errors[key][0];
              });
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

    onMounted(() => {
      dataId.value = props.data[props.primaryKey];
      dataValues.value = props.data;

      // set modalData
      if (props.type == "update") {
        modalData.value = props.data;
      } else {
        modalData.value = {};
      }

      // show modal
      showModal.value = true;
    });

    return {
      dataId,
      dataValues,
      errors,
      fetchData,
      getSingularizedLabel,
      modalData,
      modalType,
      showModal,
      submit,
      validated,
    };
  },
});
</script>
