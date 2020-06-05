<template>
  <div class="map-drawer">
    <v-bottom-sheet v-model="isOpen" fullscreen>
      <v-sheet height="100%">
        <PulseMap
          :id="pulse.id"
          :coords="pulse.geoData"
          v-if="pulse"
          :interactive="true"
        ></PulseMap>
      </v-sheet>
    </v-bottom-sheet>

    <v-fab-transition>
      <v-btn
        dark
        fixed
        fab
        bottom
        right
        :color="darkMode ? 'teal' : 'red'"
        @click.stop="isOpen = false"
        style="z-index: 1000"
        v-show="isOpen"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PulseMap from "./PulseMap";

export default {
  components: {
    PulseMap
  },
  data: () => ({
    isOpen: false
  }),
  computed: {
    ...mapState({
      open: state => state.drawers.pulseMap,
      pulse: state => state.activePulse
    }),
    darkMode() {
      return this.$vuetify.theme.dark;
    }
  },
  watch: {
    isOpen() {
      if (!this.isOpen) {
        this.$store.dispatch("setDrawer", {
          drawer: "pulseMap",
          open: false
        });
      }
    },
    open() {
      this.isOpen = this.open;
    }
  }
};
</script>
