<template>
  <v-app>
    <HeaderSidebar></HeaderSidebar>
    <v-content>
      <PulseList v-if="loggedIn"></PulseList>
      <v-container v-else fill-height>
        <v-row v-if="accessAlert">
          <v-col>
            <v-alert
              v-model="accessAlert"
              dismissible
              border="top"
              colored-border
              color="red"
              elevation="2"
              dense
            >
              <v-row align="center">
                <v-col sm="auto">
                  <v-icon color="red">error</v-icon>
                </v-col>
                <v-col>
                  Insufficient access credentials.
                </v-col>
                <v-col sm="auto">
                  <v-btn icon @click="accessAlert = false"
                    ><v-icon>close</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <v-btn dark color="red" @click="signIn">Sign-in with Google</v-btn>
          </v-col>
        </v-row>
      </v-container>
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
    accessAlert: false
  }),
  computed: {
    loggedIn() {
      return this.$store.state.user.loggedIn;
    }
  },
  methods: {
    signIn() {
      const provider = new auth.GoogleAuthProvider();
      firebaseApp
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
            firebaseApp.auth().signOut();
          }
        });
    },
    dispatchUser(user) {
      this.$store.dispatch("logIn", {
        name: user.displayName,
        image: user.photoURL,
        email: user.email,
        uid: user.uid
      });
    }
  },
  mounted() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.dispatchUser(user);
      }
    });
  }
};
</script>
