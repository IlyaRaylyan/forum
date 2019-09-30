/* eslint-disable prettier/prettier */
<template>
  <div class="flex-grid" v-if="asyncDataStatus_ready">
    <UserProfileCard :user="user" v-if="!edit" />
    <UserProfileEditor :user="user" v-else />
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">Joker's recent activity</span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <PostList :posts="userPosts" />
    </div>
  </div>
</template>
<script>
import asyncDataStatus from "../mixins/asyncDataStatus";
import UserProfileCard from "./UserProfileCard.vue";
import UserProfileEditor from "./UserProfileEditor.vue";
import PostList from "./PostList.vue";
import { mapGetters } from "vuex";

export default {
  components: { PostList, UserProfileCard, UserProfileEditor },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({
      user: "authUser"
    }),

    userPosts() {
      if (this.user.posts) {
        return Object.values(this.$store.state.posts).filter(post => {
          return post.userId === this.user[".key"];
        });
      } else {
        return [];
      }
    }
  },
  created() {
    this.$store.dispatch("fetchUser", { id: this.user[".key"] }).then(() => {
      this.asyncDataStatus_fetched();
    });
    if (this.user.posts) {
      this.$store.dispatch("fetchPosts", { ids: this.user.posts });
    }
  }
};
</script>
<style scoped>
</style>