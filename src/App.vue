<template>
  <v-app>
    <HeaderSidebar></HeaderSidebar>
    <v-content>
      <PulseList v-if="loggedIn"></PulseList>
      <v-container v-if="!(checkingLoginStatus || loggedIn)" fill-height>
        <v-dialog v-model="accessAlert" max-width="290">
          <v-card>
            <v-card-text class="text-center pb-0 pt-6">
              <v-icon color="red" class="pb-3">error</v-icon>
              <p>Insufficient access credentials.</p>
            </v-card-text>

            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="accessAlert = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
    <PulseDrawer></PulseDrawer>
  </v-app>
</template>

<script>
import PulseList from "./components/PulseList";
import PulseDrawer from "./components/PulseDrawer";
import HeaderSidebar from "./components/HeaderSidebar";
import { firebaseApp } from "./firebase";
import { auth } from "firebase/app";
import "firebase/auth";

export default {
  components: {
    PulseList,
    PulseDrawer,
    HeaderSidebar
  },
  data: () => ({
    accessAlert: false,
    checkingLoginStatus: false
  }),
  computed: {
    loggedIn() {
      return this.$store.state.user.loggedIn;
    }
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
              const validEmails = [
                "luisbaugusto@gmail.com",
                "anne17margarette@gmail.com"
              ];

              if (validEmails.includes(user.email)) {
                this.dispatchUser(user);
              } else {
                this.accessAlert = true;
                this.checkingLoginStatus = false;
                firebaseApp.auth().signOut();
              }
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
