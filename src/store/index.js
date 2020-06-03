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
    pulses: []
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
    }
  },
  actions: {
    logIn({ commit }, user) {
      const data = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        uid: user.uid
      };
      db.collection("users")
        .doc(user.uid)
        .set(data)
        .then(() => {
          commit("setUser", data);
        });
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
        reactions: []
      };

      return db.collection("pulses").add(pulse);
    }),
    bindPulses: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "pulses",
        db.collection("pulses").orderBy("time", "desc"),
        {
          serialize: snapshot => ({
            ...snapshot.data(),
            id: snapshot.id
          })
        }
      );
    }),
    bindActions: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "actions",
        db.collection("actions").orderBy("name", "asc"),
        {
          serialize: snapshot => ({
            name: snapshot.data().name,
            id: snapshot.id
          })
        }
      );
    }),
    toggleReaction: firestoreAction(({ state }, data) => {
      const user = db.collection("users").doc(state.user.data.uid);
      const pulse = db.collection("pulses").doc(data.pulse);
      if (data.hasReaction) {
        return pulse.update({
          reactions: firestore.FieldValue.arrayRemove(user)
        });
      } else {
        return pulse.update({
          reactions: firestore.FieldValue.arrayUnion(user)
        });
      }
    })
  }
});
