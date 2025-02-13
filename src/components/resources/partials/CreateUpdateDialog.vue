<template>
  <div v-if="isMounted">
    <Dialog
      :header="getTitle()"
      v-model:visible="showModal"
      :closeOnEscape="true"
      :modal="true"
      :style="{ width: '50rem' }"
      @hide="onClose"
    >
      <div class="p-4 mb-4 bg-gray-100 rounded-lg">
        <Vueform
          v-bind="getFormProps()"
          v-model="modalData"
          :endpoint="submitForm"
          sync
          ref="vueForm"
        />
      </div>
      <template v-if="errors.length > 0">
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
      </template>
      <template #footer>
        <Button
          @click="onClose"
          label="Close"
          icon="pi pi-times"
          severity="secondary"
        />
        <Button
          @click="onSubmit"
          :label="type === 'create' ? 'Create' : 'Save'"
          :icon="type === 'create' ? 'pi pi-plus' : 'pi pi-save'"
          severity="info"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onActivated,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import ResourceType from "../../../core/types/ResourceConfigTypes";
import useResource from "../../../composables/useResource";

export default defineComponent({
  name: "CreateUpdateDialog",
  props: {
    data: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
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
      type: Object as PropType<ResourceType>,
      required: true,
    },
    subId: {
      type: Number,
      default: null,
    },
  },
  setup(props, { emit }) {
    const dataId = ref();
    const errors: any = ref([]);
    const isMounted = ref(false);
    const modalData = ref();
    const modalType = ref(props.type);
    const showModal = ref(false);
    const submit = ref(false);
    const vueForm: any = ref();

    /**
     * Use resource
     */
    const { create, update, routeId } = useResource(props.resource, props);

    /**
     * Get Form props
     * @returns {Object}
     */
    const getFormProps = () => {
      const fields = props.fields;
      const data = props.data;

      // Deep search through the schema to find 'items' keys
      const replaceInSchema = (schema) => {
        for (let key in schema) {
          if (typeof schema[key] === "object" && schema[key] !== null) {
            if (schema[key].items) {
              let items = schema[key].items;
              if (typeof items === "string") {
                const regex = /\{(\w+)\}/g;
                let match;
                while ((match = regex.exec(items)) !== null) {
                  const variableName = match[1];
                  if (data[variableName]) {
                    items = items.replace(
                      `{${variableName}}`,
                      data[variableName]
                    );
                  }
                }
                schema[key].items = items;
              }
            }
            // Recursively check nested objects
            if (schema[key].schema) {
              replaceInSchema(schema[key].schema);
            }
          }
        }
      };

      // Apply the replacement logic to the main schema
      replaceInSchema(fields.schema);

      return fields;
    };

    /**
     * Get title
     * @returns {string}
     */
    const getTitle = () => {
      // check to see if props.resource.label is a function or string
      if (typeof props.resource.label === "function") {
        return props.resource.label({}, modalType.value);
      }

      return modalType.value == "create"
        ? "Create " + props.resource.label
        : "Update " + props.resource.label;
    };

    /**
     * Submit form
     */
    const submitForm = async (FormData, form$) => {
      // update modalData
      modalData.value = form$.data;
      // clear errors
      errors.value = [];

      if (modalType.value == "create") {
        await create(modalData.value, dataId.value)
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
        await update(modalData.value, dataId.value)
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
    };

    /**
     * On close
     * @returns {void}
     */
    const onClose = () => {
      emit("close");
    };

    /**
     * On submit
     * @returns {void}
     */
    const onSubmit = () => {
      submit.value = true;
      if (!vueForm.value) {
        return;
      }
      vueForm.value.submit();
    };

    const setup = async () => {
      // Set dataId
      dataId.value = props.data[props.primaryKey];
      // Reset errors
      modalData.value = {};
      // Set modalData if provided
      if (props.data) {
        modalData.value = props.data;
      }
      // Set routeId if provided
      if (props.subId) {
        routeId.value = props.subId.toString();
      }
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

    onActivated(async () => {
      await setup();
    });

    onMounted(async () => {
      await setup();
      showModal.value = true;
      isMounted.value = true;
    });

    return {
      errors,
      getFormProps,
      getTitle,
      isMounted,
      modalData,
      modalType,
      onClose,
      onSubmit,
      showModal,
      submit,
      submitForm,
      vueForm,
    };
  },
});
</script>
