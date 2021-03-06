<template>
  <div class="header-sidebar">
    <v-app-bar app :color="darkMode ? 'teal' : 'primary'" dark>
      <v-app-bar-nav-icon @click.stop="sidebar = !sidebar" v-if="user.loggedIn">
        <v-icon>menu</v-icon>
      </v-app-bar-nav-icon>
      <v-spacer> </v-spacer>
      <v-icon>track_changes</v-icon>
      <v-spacer> </v-spacer>
      <v-app-bar-nav-icon disabled v-if="user.loggedIn"> </v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="sidebar" fixed temporary v-if="user.loggedIn">
      <template v-slot:prepend>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="user.data.image"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.data.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ user.data.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>

      <v-list dense>
        <v-list-item class="d-flex align-center">
          <v-list-item-content>
            <v-list-item-title>Dark Mode</v-list-item-title>
          </v-list-item-content>

          <v-list-item-avatar class="overflow-visible">
            <v-switch
              color="teal"
              v-model="darkModeToggle"
              @change="updateDarkMode"
            ></v-switch>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link @click="logOut">
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list dense>
          <v-list-item
            href="https://github.com/luisaugusto/pulse"
            target="_blank"
          >
            <v-list-item-icon>
              <v-icon>developer_mode</v-icon>
            </v-list-item-icon>
            <v-spacer></v-spacer>
            <v-list-item-content>
              <v-list-item-title class="text-right">
                <code>v1.2.7</code>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { firebaseApp } from "../firebase";

export default {
  data: () => ({
    sidebar: null,
    darkModeToggle: false
  }),
  computed: {
    user() {
      return this.$store.state.user;
    },
    darkMode() {
      return this.$vuetify.theme.dark;
    }
  },
  methods: {
    updateDarkMode() {
      localStorage.setItem("darkMode", this.darkModeToggle);
      this.$vuetify.theme.dark = this.darkModeToggle;
    },
    logOut() {
      this.sidebar = null;

      firebaseApp
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("logOut");
        });
    }
  },
  mounted() {
    this.darkModeToggle = localStorage.getItem("darkMode") === "true";
  }
};
</script>
