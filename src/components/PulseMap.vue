<template>
  <div
    :id="mapId"
    class="map"
    ref="map"
    :class="{ interactive, 'mt-3': !interactive }"
  ></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    coords: {
      type: Object,
      default: null
    },
    interactive: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    map: null,
    mapMarker: null
  }),
  computed: {
    darkMode() {
      return this.$vuetify.theme.dark;
    },
    mapId() {
      return "map-" + this.id + (this.interactive ? "-interactive" : "");
    }
  },
  watch: {
    darkMode() {
      if (!this.map) return;

      const lngLat = [this.coords.longitude, this.coords.latitude];

      this.map.setStyle(
        "mapbox://styles/mapbox/" + (this.darkMode ? "dark-v10" : "streets-v11")
      );

      this.mapMarker.remove();
      this.createMapMarker(lngLat);
    },
    mapId() {
      this.setupMap();
    }
  },
  methods: {
    createMapMarker(lngLat) {
      if (!this.map) return;

      this.mapMarker = new mapboxgl.Marker({
        color: this.darkMode ? "#009688" : "#1976d2"
      })
        .setLngLat(lngLat)
        .addTo(this.map);
    },
    setupMap() {
      this.$refs.map.innerHTML = "";
      if (!this.coords) return;

      const lngLat = [this.coords.longitude, this.coords.latitude];

      setTimeout(() => {
        mapboxgl.accessToken =
          "pk.eyJ1IjoibHVpc2F1Z3VzdG8iLCJhIjoiY2tiOHNvZ3V2MDFmaTJ3bW5pNGdmcGVpayJ9.QYZWzTlMuR8gXw1kLE1sLA";
        this.map = new mapboxgl.Map({
          container: this.mapId,
          center: lngLat,
          style:
            "mapbox://styles/mapbox/" +
            (this.darkMode ? "dark-v10" : "streets-v11"),
          zoom: 15
        });

        if (!this.interactive) {
          this.map.scrollZoom.disable();
          this.map.dragRotate.disable();
          this.map.dragPan.disable();
          this.map.touchZoomRotate.disableRotation();
          this.map.doubleClickZoom.disable();
          this.map.boxZoom.disable();
          this.map.keyboard.disable();
          this.map.getCanvas().style.cursor = "pointer";
        }

        this.createMapMarker(lngLat);
      }, 500);
    }
  },
  mounted() {
    this.setupMap();
  }
};
</script>

<style lang="scss">
.mapboxgl-control-container {
  display: none;
}
.map {
  height: 200px;

  &.interactive {
    height: 100%;
  }
}
</style>
