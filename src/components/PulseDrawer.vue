<template>
  <div class="pulse-drawer">
    <v-btn
      dark
      fixed
      fab
      bottom
      right
      color="red"
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
                  :disabled="
                    formData.action &&
                      formData.action.name === 'sending a pulse'
                  "
                  label="Message"
                  counter="30"
                  v-model="formData.message"
                ></v-text-field>
              </v-col>
              <v-col md="auto" class="text-right">
                <v-btn
                  color="red"
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
    formData: {
      action: undefined,
      message: ""
    }
  }),
  computed: {
    actions() {
      return this.$store.state.actions;
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    createPulse() {
      if (this.submitLoading) return;

      this.submitLoading = true;
      this.$store
        .dispatch("createPulse", {
          action: this.formData.action.id,
          message: this.formData.message || ""
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
