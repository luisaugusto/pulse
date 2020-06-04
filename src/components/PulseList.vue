<template>
  <v-container>
    <v-row>
      <v-list class="flex-grow-1" v-if="pulses.length > 0" color="transparent">
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
            {{
              formatDate(new Date().getTime()) ===
              formatDate(pulse.time.seconds * 1000)
                ? "Today"
                : formatDate(pulse.time.seconds * 1000)
            }}
          </v-subheader>
          <Pulse :data="pulse"></Pulse>
        </div>
      </v-list>
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
  }
};
</script>
