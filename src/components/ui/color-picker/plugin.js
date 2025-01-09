import { toRefs, onMounted, ref, computed, watch, nextTick } from "vue";

export default (options = {}) => ({
  apply: ["TextElement"],
  props: {
    colorFormat: {
      type: String,
      default: null,
      validator: (value) => ["hex", "rgb", "hsl"].includes(value),
    },
    // Additional props for customization if needed
  },
  setup(props, context, component) {
    // Use context.attrs to access attributes if prop is not set
    const colorFormat = computed(
      () => props.colorFormat || context.attrs.colorFormat
    );

    const { value, el$, input } = component;

    // State for holding the color value
    const currentColor = ref(value.value || "#000000");

    // Computed property for formatting the color based on `colorFormat`
    const formattedColor = computed(() => {
      switch (colorFormat.value) {
        case "rgb":
          return hexToRgb(currentColor.value);
        case "hsl":
          return hexToHsl(currentColor.value);
        default:
          return currentColor.value; // hex
      }
    });

    const updateColor = (newColor) => {
      if (isValidColor(newColor)) {
        currentColor.value = newColor;
        value.value = formattedColor.value;
      }
    };

    const isValidColor = (color) => {
      // Simple color validation logic
      if (colorFormat.value === "hex") {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
      }
      // Add validation for other formats if needed
      return true;
    };

    const hexToRgb = (hex) => {
      // Convert hex to rgb
      // Implementation here or use an external library
      return hex;
    };

    const hexToHsl = (hex) => {
      // Convert hex to hsl
      // Implementation here or use an external library
      return hex;
    };

    // Initialize color picker on mount, but only if colorFormat is set
    onMounted(() => {
      if (el$.value && el$.value.input && colorFormat.value) {
        el$.value.input.type = "color";
        el$.value.input.value = currentColor.value;
        el$.value.input.addEventListener("input", (e) =>
          updateColor(e.target.value)
        );
      }
    });

    watch(value, (newValue) => {
      if (newValue !== formattedColor.value && colorFormat.value) {
        updateColor(newValue);
      }
    });

    return {
      ...component,
      currentColor,
      formattedColor,
      updateColor,
    };
  },
});
