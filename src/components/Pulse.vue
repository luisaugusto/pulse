<template>
  <v-list-item v-if="data && user">
    <v-list-item-avatar>
      <v-img :src="user.image"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ user.name }}</v-list-item-title>
      <v-list-item-subtitle
        >is {{ actions[data.action].text }}
        {{ data.message }}</v-list-item-subtitle
      >
    </v-list-item-content>

    <v-list-item-action class="align-self-start align-center">
      <v-list-item-action-text>{{
        formatTime(data.time.seconds * 1000)
      }}</v-list-item-action-text>
      <!--      <v-tooltip bottom>-->
      <!--        <template v-slot:activator="{ on }">-->
      <!--          <v-btn icon @click="like" v-on="on"-->
      <!--            ><v-icon small :color="data.likes.includes(user.uid) ? 'blue' : ''"-->
      <!--              >thumb_up</v-icon-->
      <!--            ></v-btn-->
      <!--          >-->
      <!--        </template>-->
      <!--        <span>Margarette acknowledged this</span>-->
      <!--      </v-tooltip>-->
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
    user: null
  }),
  computed: {
    actions() {
      return this.$store.getters.sortedActions;
    }
  },
  methods: {
    like() {
      const liked = this.data.likes.includes(this.user.uid);
      const likes = liked
        ? this.data.likes.filter(like => like != this.user.uid)
        : [...this.data.likes, this.user.uid];
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
      .then(user => (this.user = user));
  }
};
</script>
