<template>
  <div class="pulse-drawer">
    <v-btn
      dark
      fixed
      fab
      bottom
      right
      :color="darkMode ? 'teal' : 'red'"
      v-if="user.loggedIn"
      @click.stop="open = !open"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="open">
      <v-sheet>
        <v-form ref="form">
          <v-container>
            <v-row class="align-center">
              <v-col cols="12" md="">
                <v-autocomplete
                  :color="darkMode ? 'teal' : 'blue'"
                  append-icon="arrow_drop_down"
                  :items="actions"
                  item-text="name"
                  item-value="id"
                  label="What are you up to?"
                  v-model="formData.action"
                  return-object
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="">
                <v-text-field
                  :color="darkMode ? 'teal' : 'blue'"
                  :disabled="
                    formData.action &&
                      formData.action.name === 'sending a pulse'
                  "
                  label="Message"
                  counter="30"
                  v-model="formData.message"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-end">
              <v-col class="d-flex align-center">
                <v-switch
                  label="Include Geolocation"
                  v-model="includeGeo"
                  :loading="checkingGeo"
                  @change="checkGeolocation"
                  :color="darkMode ? 'teal' : 'blue'"
                ></v-switch>
              </v-col>
              <v-col cols="auto" class="justify-end align-center d-flex">
                <v-tooltip top v-if="includeGeo && formData.geoData">
                  <template v-slot:activator="{ on }">
                    <v-btn icon small class="mr-3" color="blue">
                      <v-icon small v-on="on">gps_fixed</v-icon>
                    </v-btn>
                  </template>
                  <span
                    >{{ formData.geoData.latitude }}°,<br />
                    {{ formData.geoData.longitude }}°</span
                  >
                </v-tooltip>
                <v-btn
                  :color="darkMode ? 'teal' : 'red'"
                  :dark="!!formData.action"
                  :loading="submitLoading"
                  @click="createPulse"
                  :disabled="!formData.action"
                  >Send Pulse <v-icon right>send</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  data: () => ({
    open: null,
    submitLoading: false,
    checkingGeo: false,
    includeGeo: false,
    formData: {
      action: undefined,
      geoData: null,
      message: ""
    }
  }),
  computed: {
    darkMode() {
      return this.$vuetify.theme.dark;
    },
    actions() {
      return this.$store.state.actions;
    },
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.includeGeo = false;
        this.formData.message = "";
        this.formData.action = undefined;
      }
    }
  },
  methods: {
    checkGeolocation() {
      if (!this.includeGeo) return;

      this.checkingGeo = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            this.formData.geoData = { latitude, longitude };
            this.checkingGeo = false;
          },
          err => {
            console.error("Error while checking geolocation: " + err.message);
            this.checkingGeo = false;
            this.includeGeo = false;
          }
        );
      } else {
        this.checkingGeo = false;
        this.includeGeo = false;
      }
    },
    createPulse() {
      if (this.submitLoading) return;

      this.submitLoading = true;
      this.$store
        .dispatch("createPulse", {
          action: this.formData.action.id,
          message: this.formData.message || "",
          geoData:
            this.includeGeo && this.formData.geoData
              ? this.formData.geoData
              : null
        })
        .then(() => {
          this.submitLoading = false;
          this.open = null;
          this.$refs.form.reset();
        });
    }
  }
};
</script>
