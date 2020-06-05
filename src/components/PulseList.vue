<template>
  <div class="pulse-list">
    <v-container>
      <v-row>
        <v-col v-if="pulses.length > 0">
          <v-list class="flex-grow-1 pb-12 mb-6" color="transparent">
            <div v-for="(pulse, index) in pulses" :key="index">
              <v-divider
                v-if="
                  index > 0 &&
                    formatDate(pulse.time.seconds * 1000) ===
                      formatDate(pulses[index - 1].time.seconds * 1000)
                "
              ></v-divider>
              <v-subheader
                v-if="
                  index === 0 ||
                    formatDate(pulse.time.seconds * 1000) !==
                      formatDate(pulses[index - 1].time.seconds * 1000)
                "
              >
                {{ getDateText(pulse.time.seconds) }}
              </v-subheader>
              <div @click.stop="openPulseOptions(pulse)">
                <Pulse :data="pulse" :clickable="clickable(pulse)"></Pulse>
              </div>
            </div>
          </v-list>
        </v-col>
        <v-col v-else>
          <v-banner single-line>
            <v-icon slot="icon" color="red" size="36">
              report_problem
            </v-icon>
            Unable to access pulse data.
          </v-banner>
        </v-col>
      </v-row>
    </v-container>
    <PulseOptionsDrawer></PulseOptionsDrawer>
    <PulseMapDrawer></PulseMapDrawer>
  </div>
</template>

<script>
import timeFormatting from "../modules/timeFormatting";
import Pulse from "./Pulse";
import PulseOptionsDrawer from "./PulseOptionsDrawer";
import PulseMapDrawer from "./PulseMapDrawer";
import { mapState } from "vuex";

export default {
  mixins: [timeFormatting],
  components: {
    Pulse,
    PulseOptionsDrawer,
    PulseMapDrawer
  },
  data: () => ({
    mapDrawerOpen: false
  }),
  computed: {
    ...mapState(["user", "activePulse"]),
    pulses() {
      return this.$store.state.pulses;
    }
  },
  methods: {
    getDateText(time) {
      const currentDate = new Date().setHours(0, 0, 0, 0);
      const publishedDate = new Date(time * 1000).setHours(0, 0, 0, 0);
      const day = 24 * 60 * 60 * 1000;

      if (currentDate === publishedDate) {
        return "Today";
      }

      if (publishedDate + day === currentDate) {
        return "Yesterday";
      }

      return this.formatDate(publishedDate);
    },

    clickable(pulse) {
      const isAuthor = this.user.data.uid === pulse.author.uid;
      const oneDay = 24 * 60 * 60 * 1000;
      const withinDay =
        new Date() - new Date(pulse.time.seconds * 1000) < oneDay;

      return isAuthor && withinDay;
    },
    openPulseOptions(pulse) {
      this.$store.dispatch("setDrawer", {
        drawer: "pulseOptions",
        open: this.clickable(pulse)
      });
      this.$store.dispatch("setActivePulse", pulse);
    }
  }
};
</script>
