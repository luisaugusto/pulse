import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    actions: [
      "eating",
      "at work",
      "at home",
      "awake",
      "going to bed",
      "exercising",
      "playing",
      "driving",
      "shopping",
      "sending a pulse",
      "working"
    ],
    pulses: []
  },
  getters: {
    sortedActions: state => {
      return state.actions.sort().map((action, index) => ({
        text: action,
        val: index
      }));
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
    }
  },
  actions: {
    logIn({ commit }, user) {
      db.collection("users")
        .doc(user.uid)
        .set(user)
        .then(() => {
          commit("setUser", user);
        });
    },
    logOut({ commit }) {
      commit("removeUser");
    },
    async getUser(context, uid) {
      const user = await db
        .collection("users")
        .doc(uid)
        .get()
        .then(snapshot => {
          return snapshot.data();
        });
      return user;
    },
    createPulse: firestoreAction(({ state }, data) => {
      const pulse = {
        user: state.user.data.uid,
        action: data.action,
        message: data.message,
        likes: [],
        time: new Date()
      };
      // return the promise so we can await the write
      return db
        .collection("pulses")
        .add(pulse)
        .then(data =>
          db
            .collection("pulses")
            .doc(data.id)
            .update({ id: data.id })
        );
    }),
    bindPulses: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "pulses",
        db.collection("pulses").orderBy("time", "desc")
      );
    }),
    like: firestoreAction((context, data) => {
      // return the promise returned by `bindFirestoreRef`
      console.log(data);
      db.collection("pulses")
        .doc(data.pulse)
        .get()
        .then(snapshot => console.log(snapshot.data()));
      db.collection("pulses")
        .doc(data.pulse)
        .update({ likes: data.likes });
    })
  }
});
