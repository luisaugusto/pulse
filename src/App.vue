<template>
  <v-app>
    <HeaderSidebar></HeaderSidebar>
    <v-content>
      <PulseList v-if="loggedIn"></PulseList>
      <v-container v-if="!(checkingLoginStatus || loggedIn)" fill-height>
        <v-row>
          <v-col class="text-center">
            <v-btn dark color="red" @click="signIn">Sign-in with Google</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog
        v-model="checkingLoginStatus"
        hide-overlay
        persistent
        width="300"
      >
        <v-card color="primary" dark>
          <v-card-text class="pt-5">
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
    <PulseDrawer v-if="!insufficientPerms"></PulseDrawer>
  </v-app>
</template>

<script>
import PulseList from "./components/PulseList";
import PulseDrawer from "./components/PulseDrawer";
import HeaderSidebar from "./components/HeaderSidebar";
import { firebaseApp } from "./firebase";
import { auth } from "firebase/app";
import "firebase/auth";
import { mapState } from "vuex";

export default {
  components: {
    PulseList,
    PulseDrawer,
    HeaderSidebar
  },
  data: () => ({
    checkingLoginStatus: false
  }),
  computed: {
    ...mapState({
      loggedIn: state => state.user.loggedIn
    }),
    ...mapState(["insufficientPerms"])
  },
  methods: {
    signIn() {
      this.checkingLoginStatus = true;
      const provider = new auth.GoogleAuthProvider();

      firebaseApp
        .auth()
        .setPersistence(auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebaseApp
            .auth()
            .signInWithPopup(provider)
            .then(({ user }) => {
              this.dispatchUser(user);
            })
            .catch(() => {
              this.checkingLoginStatus = false;
            });
        });
    },
    dispatchUser(user) {
      this.checkingLoginStatus = false;
      this.$store.dispatch("logIn", user);
    }
  },
  mounted() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.dispatchUser(user);
      } else {
        this.checkingLoginStatus = false;
      }
    });
  }
};
</script>
