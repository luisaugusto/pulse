import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const darkMode =
  localStorage.getItem("darkMode") === "true" ? { dark: true } : {};

export default new Vuetify({
  theme: darkMode
});

// export default new Vuetify({});
