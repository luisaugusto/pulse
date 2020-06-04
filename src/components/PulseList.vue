<template>
  <div class="pulse-list">
    <v-container>
      <v-row>
        <v-list
          class="flex-grow-1 pb-12 mb-6"
          v-if="pulses.length > 0"
          color="transparent"
        >
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
            <div @click="openPulseOptions(pulse)">
              <Pulse :data="pulse" :clickable="clickable(pulse)"></Pulse>
            </div>
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
    <v-dialog v-model="deleteConfirm" max-width="400">
      <v-card>
        <v-list-item v-if="activePulse">
          <v-list-item-content>
            <div class="overline">Deleting Pulse</div>
            <div class="subtitle-1">
              Are you sure you want to delete this pulse?
            </div>

            <hr class="mt-3" />

            <v-row>
              <v-col>
                <v-list-item-title>{{
                  activePulse.author.name
                }}</v-list-item-title>
                <v-list-item-subtitle v-if="activePulse.action.name"
                  >is {{ activePulse.action.name }}
                  {{ activePulse.message }}</v-list-item-subtitle
                >
              </v-col>
              <v-col sm="auto" class="text-right">
                <v-list-item-action-text>
                  {{ formatDate(activePulse.time.seconds * 1000) }}
                  <br />
                  {{ formatTime(activePulse.time.seconds * 1000) }}
                </v-list-item-action-text>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey" text @click="closePulseOptions">
            Cancel
          </v-btn>

          <v-btn color="red" text @click="deletePulse" :loading="deleteLoading">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="options">
      <v-sheet>
        <v-container>
          <v-row>
            <v-col>
              <v-btn
                block
                color="red"
                outlined
                @click.stop="deleteConfirm = true"
              >
                <v-icon left>delete_forever</v-icon>
                Delete Pulse
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import timeFormatting from "../modules/timeFormatting";
import Pulse from "./Pulse";
import { mapState } from "vuex";

export default {
  mixins: [timeFormatting],
  components: {
    Pulse
  },
  data: () => ({
    options: false,
    activePulse: null,
    deleteLoading: false,
    deleteConfirm: false
  }),
  computed: {
    ...mapState(["user"]),
    pulses() {
      return this.$store.state.pulses;
    }
  },
  methods: {
    deletePulse() {
      this.deleteLoading = true;
      this.$store.dispatch("deletePulse", this.activePulse.id).then(() => {
        this.deleteConfirm = false;
        this.options = false;
        this.deleteLoading = false;
      });
    },
    clickable(pulse) {
      const isAuthor = this.user.data.uid === pulse.author.uid;
      const oneDay = 24 * 60 * 60 * 1000;
      const withinDay =
        new Date() - new Date(pulse.time.seconds * 1000) < oneDay;

      return isAuthor && withinDay;
    },
    openPulseOptions(pulse) {
      this.options = this.clickable(pulse);
      this.activePulse = pulse;
    },
    closePulseOptions() {
      this.options = false;
      this.deleteConfirm = false;
    }
  }
};
</script>
