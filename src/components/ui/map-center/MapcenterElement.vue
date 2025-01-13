<template>
  <component :is="elementLayout" :multiple="true" ref="container">
    <template #element>
      <div :style="{ height: '300px', width: '100%' }" ref="mapElement" />
      <div class="mt-2">
        <label for="coordinates" class="mr-2">Coordinates:</label>
        <div :class="classes.inputWrapper">
          <input
            id="coordinates"
            type="text"
            :value="formattedCoordinates"
            :class="classes.input"
            @input="updateCoordinates"
            placeholder="e.g., 0, 0"
          />
        </div>
      </div>
    </template>
    <template v-for="(component, slot) in elementSlots" #[slot]>
      <slot :name="slot" :element="el$">
        <component :is="component" :element="el$" />
      </slot>
    </template>
  </component>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { defineElement } from "@vueform/vueform";

export default defineElement({
  name: "MapcenterElement",
  setup(_props, { element }) {
    const { value } = element;
    const mapElement = ref(null);
    let map = null;
    let marker = null;

    /**
     * Default classes for the element
     */
    const defaultClasses = ref({
      container: "",
      inputWrapper:
        "w-full flex flex-1 transition-input duration-200 border-solid form-border-width-input form-shadow-input form-input-group group form-radius-input form-h-input-height form-bg-input form-color-input form-border-color-input hover:form-bg-input-hover hover:form-color-input-hover hover:form-border-color-input-hover hover:form-shadow-input-hover focused:form-bg-input-focus focused:form-color-input-focus focused:form-border-color-input-focus focused:form-shadow-input-focus focused:form-ring focused-hover:form-shadow-input-hover",
      input:
        "w-full bg-transparent h-full form-p-input form-radius-input form-text with-floating:form-p-input-floating border-0 form-color-input group-hover:form-color-input-hover form-autofill-default",
      input_sm: "text-sm",
      input_md: "text-base",
      input_lg: "text-lg",
      $input: (classes, { Size }) => [classes.input, classes[`input_${Size}`]],
    });

    /**
     * Format the coordinates for display
     * @returns {string}
     */
    const formattedCoordinates = computed(() => {
      if (element.value.value) {
        return `${element.value.value.lat.toFixed(
          6
        )}, ${element.value.value.lng.toFixed(6)}`;
      }
      return "0, 0";
    });

    /**
     * Load the Google Maps API and initialize the map
     * If the value is set, place a marker at the coordinates
     * If the map is clicked, place a marker at the clicked location
     */
    const loadMap = () => {
      map = new window.google.maps.Map(mapElement.value, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      window.google.maps.event.addListener(map, "click", (event) => {
        placeMarker(event.latLng);
      });

      // if value is set, place marker at the coordinates
      if (value.value) {
        const data = JSON.parse(value.value);
        const location = new window.google.maps.LatLng(data.lat, data.lng);
        placeMarker(location);
      }
    };

    /**
     * Place a marker at the given location
     * @param location {google.maps.LatLng}
     */
    const placeMarker = (location) => {
      // Remove previous marker if it exists
      if (marker) {
        marker.setMap(null);
      }
      // Create a new marker at the clicked location
      marker = new window.google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
      });

      // Update the map center to the marker's position
      map.setCenter(location);

      // Update form model with the new center coordinates
      element.value.value = { lat: location.lat(), lng: location.lng() };
    };

    /**
     * Update the map center based on the input coordinates
     * @param event {Event}
     */
    const updateCoordinates = (event) => {
      const parts = event.target.value.split(",");
      if (parts.length === 2) {
        const [latStr, lngStr] = parts;
        const lat = parseFloat(latStr.trim());
        const lng = parseFloat(lngStr.trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          const newLocation = new window.google.maps.LatLng(lat, lng);
          placeMarker(newLocation);
        } else {
          console.warn("Invalid coordinates format");
        }
      } else {
        console.warn('Coordinates should be in the format "lat, lng"');
      }
    };

    onMounted(() => {
      // Ensure Google Maps API is loaded before initializing the map
      if (window.google && window.google.maps) {
        loadMap();
      } else {
        // Here we could implement a retry mechanism or show an error message
        console.error("Google Maps API not loaded");
      }
    });

    return {
      defaultClasses,
      formattedCoordinates,
      mapElement,
      updateCoordinates,
      ...element,
    };
  },
});
</script>
