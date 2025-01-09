import { ref, computed, watch, onMounted, h } from "vue";

export default (options = {}) => ({
  apply: ["TextElement"],
  props: {
    step: {
      type: Number,
      default: 1, // Default step size
    },
    min: {
      type: Number,
      default: null, // No minimum limit by default
    },
    max: {
      type: Number,
      default: null, // No maximum limit by default
    },
  },
  setup(props, context, component) {
    const { value, el$ } = component;

    // State to track the current value
    const currentValue = ref(Number(value.value || 0));

    // Determine if buttons should be added
    const shouldAddButtons = computed(() => {
      return (
        context.attrs.buttons === true // Only add buttons when explicitly requested
      );
    });

    // Watch the `value` to sync with external updates
    watch(value, (newValue) => {
      const numericValue = Number(newValue);
      if (!isNaN(numericValue)) {
        currentValue.value = numericValue;
      }
    });

    // Update the value and ensure it's within bounds
    const updateValue = (newValue) => {
      if (!isNaN(newValue)) {
        let clampedValue = newValue;

        if (props.min !== null)
          clampedValue = Math.max(clampedValue, props.min);
        if (props.max !== null)
          clampedValue = Math.min(clampedValue, props.max);

        currentValue.value = clampedValue;
        value.value = clampedValue; // Update the component value
      }
    };

    // Increment/Decrement Handlers
    const increment = () => updateValue(currentValue.value + props.step);
    const decrement = () => updateValue(currentValue.value - props.step);

    // Initialize the buttons and logic on mount
    onMounted(() => {
      if (!shouldAddButtons.value) return;

      const inputElement = el$.value?.input;

      if (inputElement) {
        inputElement.value = currentValue.value;

        // Watch for direct input changes
        inputElement.addEventListener("input", (e) => {
          const numericValue = Number(e.target.value);
          if (!isNaN(numericValue)) {
            updateValue(numericValue);
          }
        });
      }
    });

    return {
      ...component,
      currentValue,
      increment,
      decrement,
      shouldAddButtons,
    };
  },
  render() {
    // Render increment/decrement buttons if `buttons` attribute is true
    if (this.shouldAddButtons) {
      return h("div", { class: "increment-input" }, [
        h(
          "button",
          {
            type: "button",
            class: "decrement-btn",
            onClick: this.decrement,
          },
          "-"
        ),
        h("input", {
          value: this.currentValue,
          onInput: (event) => this.updateValue(Number(event.target.value)),
        }),
        h(
          "button",
          {
            type: "button",
            class: "increment-btn",
            onClick: this.increment,
          },
          "+"
        ),
      ]);
    }

    // If `buttons` attribute is not set, render the default TextElement
    return h(
      "div",
      { class: "text-element-wrapper" },
      this.$slots.default ? this.$slots.default() : null
    );
  },
});
