<template>
  <v-list-item v-if="data && author">
    <v-list-item-avatar>
      <v-img :src="author.image"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ author.name }}</v-list-item-title>
      <v-list-item-subtitle
        >is {{ actions[data.action].text }}
        {{ data.message }}</v-list-item-subtitle
      >
    </v-list-item-content>

    <v-list-item-action class="align-self-start align-center">
      <v-list-item-action-text>{{
        formatTime(data.time.seconds * 1000)
      }}</v-list-item-action-text>
      <v-tooltip bottom :disabled="data.likes.length === 0">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="like" v-on="on"
            ><v-icon
              small
              :color="data.likes.includes(currentUID) ? 'blue' : ''"
              >thumb_up</v-icon
            ></v-btn
          >
        </template>
        <span>{{ userLikesStr }} acknowledged this</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    author: null,
    userLikes: []
  }),
  computed: {
    currentUID() {
      return this.$store.state.user.data.uid;
    },
    actions() {
      return this.$store.getters.sortedActions;
    },
    userLikesStr() {
      let str = this.data.likes.includes(this.currentUID) ? "You" : "";

      if (this.data.likes.length === 1) {
        return str.length > 0 ? str : this.userLikes[0];
      }

      this.userLikes.forEach((name, i) => {
        const separator = i === this.userLikes.length - 1 ? " and " : ", ";
        str += separator + name;
      });
      return str;
    }
  },
  methods: {
    like() {
      const liked = this.data.likes.includes(this.author.uid);
      const likes = liked
        ? this.data.likes.filter(like => like !== this.author.uid)
        : [...this.data.likes, this.author.uid];
      this.$store.dispatch("like", {
        pulse: this.data.id,
        likes
      });
    },
    formatTime(time) {
      const date = new Date(time);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours > 12 ? hours - 12 : hours}:${minutes}${
        hours >= 12 ? "pm" : "am"
      }`;
    }
  },
  mounted() {
    this.$store
      .dispatch("getUser", this.data.user)
      .then(user => (this.author = user));

    this.data.likes.forEach(like => {
      if (like === this.currentUID) return;

      this.$store
        .dispatch("getUser", like)
        .then(user => this.userLikes.push(user.name));
    });
  }
};
</script>
