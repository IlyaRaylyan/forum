<template>
  <div>
    <div class="col-large push-top" v-if="thread && user">
      <h1>
        {{ thread.title }}
        <router-link
          :to="{name: 'ThreadEdit', id: this.id}"
          class="btn-green btn-small"
          tag="button"
        >Edit thread</router-link>
      </h1>
      <post-list :posts="posts" />
      <PostEditor :threadId="id" />
    </div>
  </div>
</template>
<script>
import asyncDataStatus from "../mixins/asyncDataStatus";
import PostList from "./PostList.vue";
import PostEditor from "./PostEditor.vue";
export default {
  components: {
    PostList,
    PostEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    posts() {
      const postIds = Object.values(this.thread.posts);

      return Object.values(this.$store.state.posts).filter(post =>
        postIds.includes(post[".key"])
      );
    },
    thread() {
      return this.$store.state.threads[this.id];
    },
    user() {
      return this.$store.state.users[this.thread.userId];
    }
  },
  created() {
    this.$store.dispatch("fetchThread", { id: this.id }).then(thread => {
      this.$store.dispatch("fetchUser", { id: thread.userId });

      this.$store
        .dispatch("fetchPosts", { ids: Object.keys(thread.posts) })
        .then(posts => {
          Promise.all(
            posts.map(post => {
              this.$store.dispatch("fetchUser", { id: post.userId });
            })
          ).then(() => {
            this.asyncDataStatus_fetched();
          });
        });
    });
  }
};
</script>
<style  scoped>
</style>