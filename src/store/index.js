import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";
import { firestore } from "firebase/app";
import "firebase/firestore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    actions: [],
    pulses: [],
    insufficientPerms: true,
    activePulse: null,
    drawers: {
      pulseOptions: false,
      pulseMap: false
    }
  },
  mutations: {
    ...vuexfireMutations,
    setUser(state, user) {
      state.user.loggedIn = true;
      state.user.data = user;
    },
    removeUser(state) {
      state.user.loggedIn = false;
      state.user.data = null;
    },
    changePerms(state, val) {
      state.insufficientPerms = val;
    },
    setDrawer(state, { drawer, open }) {
      state.drawers[drawer] = open;
    },
    setActivePulse(state, pulse) {
      state.activePulse = pulse;
    }
  },
  actions: {
    logIn({ commit, dispatch }, user) {
      const data = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        uid: user.uid
      };
      commit("setUser", data);

      db.collection("users")
        .doc(user.uid)
        .set(data)
        .then(() => {
          dispatch("bindActions");
          dispatch("bindPulses");
        })
        .catch(err => console.log("Error while creating user: " + err));
    },
    logOut({ commit }) {
      commit("removeUser");
    },
    createPulse: firestoreAction(({ state }, data) => {
      const pulse = {
        author: db.collection("users").doc(state.user.data.uid),
        action: db.collection("actions").doc(data.action),
        message: data.message,
        time: new Date(),
        reactions: [],
        geoData: data.geoData
          ? new firestore.GeoPoint(
              data.geoData.latitude,
              data.geoData.longitude
            )
          : false
      };

      return db
        .collection("pulses")
        .add(pulse)
        .catch(err => "Error while creating pulse: " + err);
    }),
    bindPulses: firestoreAction(({ commit, bindFirestoreRef }) => {
      return bindFirestoreRef(
        "pulses",
        db.collection("pulses").orderBy("time", "desc"),
        {
          serialize: snapshot => ({
            ...snapshot.data(),
            id: snapshot.id
          })
        }
      )
        .then(() => commit("changePerms", false))
        .catch(err => console.error("Error while binding pulses: " + err));
    }),
    bindActions: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "actions",
        db.collection("actions").orderBy("name", "asc"),
        {
          serialize: snapshot => ({
            name: snapshot.data().name,
            disabled: snapshot.data().disabled,
            id: snapshot.id
          })
        }
      ).catch(err => console.error("Error while binding actions: " + err));
    }),
    toggleReaction: firestoreAction(({ state }, data) => {
      const user = db.collection("users").doc(state.user.data.uid);
      const pulse = db.collection("pulses").doc(data.pulse);
      if (data.hasReaction) {
        return pulse
          .update({
            reactions: firestore.FieldValue.arrayRemove(user)
          })
          .catch(err => console.log("Error while updating reactions: " + err));
      } else {
        return pulse
          .update({
            reactions: firestore.FieldValue.arrayUnion(user)
          })
          .catch(err => console.log("Error while updating reactions: " + err));
      }
    }),
    deletePulse: firestoreAction((context, pulse) => {
      return db
        .collection("pulses")
        .doc(pulse)
        .delete()
        .catch(err => console.log("Error while deleting pulse: " + err));
    }),
    setDrawer({ commit }, data) {
      commit("setDrawer", data);
    },
    setActivePulse({ commit }, pulse) {
      commit("setActivePulse", pulse);
    }
  }
});
