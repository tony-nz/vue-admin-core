<template>
  <div>
    <div>
      <div class="p-inputgroup">
        <InputText
          v-model="colorSelected"
          @change="updateValue"
          placeholder="Keyword"
          readonly
        />
        <Button
          @click="isOpen = !isOpen"
          icon="pi pi-search"
          :class="`${colorSelected}`"
        />
        <div
          v-if="isOpen"
          @click="isOpen = false"
          class="origin-top-right absolute right-4 mt-16 w-40 rounded-md shadow-lg"
        >
          <div class="rounded-md bg-white shadow-xs px-4 py-3">
            <div class="flex flex-wrap -mx-2">
              <div v-for="(color, index) in colors" :key="index">
                <div class="px-2">
                  <template v-if="colorSelected === color">
                    <div
                      class="w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white"
                      style="box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2)"
                      :class="`${color}`"
                    ></div>
                  </template>

                  <template v-if="colorSelected != color">
                    <div
                      @click="updateValue(color)"
                      @keydown.enter="colorSelected = color"
                      role="checkbox"
                      tabindex="0"
                      :aria-checked="colorSelected"
                      class="w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white focus:outline-none focus:shadow-outline"
                      :class="`${color}`"
                    ></div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: ["modelValue"],
  methods: {
    updateValue(color) {
      this.colorSelected = color;
      this.$emit("update:modelValue", color);
    },
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const colors = [
      "bg-primary-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-black",
      "bg-orange-500",
    ];
    const colorSelected = ref();
    onMounted(() => {
      colorSelected.value = props.modelValue;
    });

    return { isOpen, colors, colorSelected };
  },
});
</script>
