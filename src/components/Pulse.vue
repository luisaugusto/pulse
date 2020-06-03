<template>
  <v-list-item v-if="data">
    <v-list-item-avatar>
      <v-img :src="data.author.image"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ data.author.name }}</v-list-item-title>
      <v-list-item-subtitle v-if="data.action.name"
        >is {{ data.action.name }} {{ data.message }}</v-list-item-subtitle
      >
    </v-list-item-content>

    <v-list-item-action class="align-self-start align-center">
      <v-list-item-action-text>{{
        formatTime(data.time.seconds * 1000)
      }}</v-list-item-action-text>
      <v-tooltip bottom :disabled="data.reactions.length === 0">
        <template v-slot:activator="{ on }">
          <v-chip @click="toggleReaction" v-on="on" small class="mt-2">
            <v-avatar left>
              <v-icon small :color="hasReaction ? 'blue' : ''">thumb_up</v-icon>
            </v-avatar>
            {{ data.reactions.length }}
          </v-chip>
        </template>
        <span>{{ reactionStr }} acknowledged this</span>
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
  computed: {
    currentUID() {
      return this.$store.state.user.data.uid;
    },
    hasReaction() {
      return this.data.reactions.some(
        reaction => reaction.uid === this.currentUID
      );
    },
    reactionStr() {
      const names = this.data.reactions
        .filter(user => user.uid)
        .map(user => {
          return user.uid === this.currentUID ? "You" : user.name.split(" ")[0];
        })
        .sort(a => (a === "You" ? 0 : 1))
        .reverse();

      const [last, ...list] = names;
      if (list.length > 0) {
        return list.reverse().join(", ") + " and " + last;
      } else {
        return last;
      }
    }
  },
  methods: {
    toggleReaction() {
      this.$store.dispatch("toggleReaction", {
        pulse: this.data.id,
        hasReaction: this.hasReaction
      });
    },
    formatTime(time) {
      const date = new Date(time);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours > 12 ? hours - 12 : hours === 0 ? 12 : hours}:${minutes}${
        hours >= 12 ? "pm" : "am"
      }`;
    }
  }
};
</script>