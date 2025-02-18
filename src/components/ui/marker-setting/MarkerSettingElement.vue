<template>
  <component :is="elementLayout" :multiple="true" ref="container">
    <template #element>
      <div class="flex flex-col items-center">
        <svg
          @click="openColorPicker"
          :height="size"
          :width="size"
          viewBox="0 0 384 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pattern-checkers"
              x="0"
              y="0"
              width="150"
              height="150"
              patternUnits="userSpaceOnUse"
            >
              <rect width="150" height="150" fill="white"></rect>
              <rect
                class="checker"
                x="0"
                y="0"
                width="75"
                height="75"
                fill="#f97316"
              ></rect>
              <rect
                class="checker"
                x="75"
                y="75"
                width="75"
                height="75"
                fill="#f97316"
              ></rect>
            </pattern>
          </defs>
          <path
            :fill="value"
            class="shadow-lg"
            d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0s192 86 192 192"
            stroke-width="8"
          />
          <text
            alignment-baseline="middle"
            fill="white"
            font-family="Helvetica"
            font-size="200"
            text-anchor="middle"
            x="192"
            y="216"
          >
            {{ text }}
          </text>
        </svg>
        <!-- Color Input -->
        <div class="mt-2">
          <div :class="classes.inputWrapper">
            <input
              v-model="value"
              class="form-p-input !p-[0.5px] form-radius-input form-text with-floating:form-p-input-floating border-0 form-color-input group-hover:form-color-input-hover form-autofill-default"
              id="markerColor"
              ref="colorInput"
              type="color"
            />
          </div>
        </div>
        <span class="mt-1 block w-full text-center">{{ title }}</span>
      </div>
    </template>
  </component>
</template>

<script>
import { defineElement } from "@vueform/vueform";
import { ref } from "vue";

export default defineElement({
  name: "MarkerSettingElement",
  props: {
    size: { type: Number, default: 50 },
    text: { type: String, default: null },
    title: { type: String, default: null },
  },
  setup(props, { element }) {
    const { value } = element;
    const colorInput = ref(null);

    /**
     * Open color picker
     */
    const openColorPicker = () => {
      if (colorInput.value) {
        colorInput.value.click();
      }
    };

    return {
      ...element,
      ...props,
      colorInput,
      openColorPicker,
      value,
    };
  },
});
</script>
