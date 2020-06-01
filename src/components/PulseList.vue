<template>
  <v-container>
    <v-row>
      <v-list class="flex-grow-1" v-if="pulses.length > 0">
        <div v-for="(pulse, index) in pulses" :key="index">
          <v-subheader
            v-if="
              index === 0 ||
                formatDate(pulse.time.seconds * 1000) !==
                  formatDate(pulses[index - 1].time.seconds * 1000)
            "
          >
            {{
              formatDate(new Date().getTime()) ===
              formatDate(pulse.time.seconds * 1000)
                ? "Today"
                : formatDate(pulse.time.seconds * 1000)
            }}
          </v-subheader>
          <Pulse :data="pulse"></Pulse>
          <v-divider></v-divider>
        </div>
      </v-list>
      <v-col v-else>
        <v-alert type="warning" outlined class="text-center">
          No pulses yet. Click the
          <v-btn x-small color="red" dark fab><v-icon>add</v-icon></v-btn>
          in the bottom right to add a pulse.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Pulse from "./Pulse";

export default {
  components: {
    Pulse
  },
  computed: {
    pulses() {
      return this.$store.state.pulses;
    }
  },
  methods: {
    formatDate(time) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const date = new Date(time);
      const year = date.getFullYear();
      const month = months[date.getMonth()];
      const day = String(date.getDate()).padStart(2, "0");
      return `${month} ${day}, ${year}`;
    }
  },
  created() {
    this.$store.dispatch("bindPulses");
  }
};
</script>
