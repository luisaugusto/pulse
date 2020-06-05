<template>
  <v-bottom-sheet v-model="isOpen">
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
    <v-dialog v-model="deleteConfirm" max-width="400">
      <v-card>
        <v-list-item v-if="pulse">
          <v-list-item-content>
            <div class="overline">Deleting Pulse</div>
            <div class="subtitle-1">
              Are you sure you want to delete this pulse?
            </div>

            <hr class="mt-3" />

            <v-row>
              <v-col>
                <v-list-item-title>{{ pulse.author.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="pulse.action.name"
                  >is {{ pulse.action.name }}
                  {{ pulse.message }}</v-list-item-subtitle
                >
              </v-col>
              <v-col sm="auto" class="text-right">
                <v-list-item-action-text>
                  {{ formatDate(pulse.time.seconds * 1000) }}
                  <br />
                  {{ formatTime(pulse.time.seconds * 1000) }}
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
  </v-bottom-sheet>
</template>

<script>
import timeFormatting from "../modules/timeFormatting";
import { mapState } from "vuex";

export default {
  mixins: [timeFormatting],
  computed: {
    ...mapState({
      open: state => state.drawers.pulseOptions,
      pulse: state => state.activePulse
    })
  },
  data: () => ({
    deleteLoading: false,
    deleteConfirm: false,
    isOpen: false
  }),
  watch: {
    isOpen() {
      if (!this.isOpen) {
        this.$store.dispatch("setDrawer", {
          drawer: "pulseOptions",
          open: false
        });
      }
    },
    open() {
      this.isOpen = this.open;
    }
  },
  methods: {
    deletePulse() {
      this.deleteLoading = true;
      this.$store.dispatch("deletePulse", this.pulse.id).then(() => {
        this.deleteConfirm = false;
        this.$store.dispatch("setDrawer", {
          drawer: "pulseOptions",
          open: false
        });
        this.deleteLoading = false;
      });
    },
    closePulseOptions() {
      this.$store.dispatch("setDrawer", {
        drawer: "pulseOptions",
        open: false
      });
      this.deleteConfirm = false;
    }
  }
};
</script>
