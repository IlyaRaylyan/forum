<template>
  <div class="col-full">
    <div v-if="asyncDataStatus_ready">
      <h1>Welcome to the forum</h1>
      <ForumList :forums="forums" :categories="categories" :posts="posts" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ForumList from "../components/ForumList.vue";
import asyncDataStatus from "../mixins/asyncDataStatus";

export default {
  name: "HelloWorld",

  components: {
    ForumList
  },
  mixins: [asyncDataStatus],

  computed: {
    forums() {
      return Object.values(this.$store.state.forums);
    },
    categories() {
      return this.$store.state.categories;
    },
    posts() {
      return this.$store.state.posts;
    }
  },
  methods: {
    ...mapActions(["fetchCategories", "fetchForums", "fetchPost", "fetchUser"])
  },
  created() {
    this.fetchCategories().then(categories => {
      Promise.all(
        categories.map(category => {
          this.fetchForums({
            ids: category.forums
          }).then(forums =>
            forums.map(forum => {
              if (forum.threads) {
                this.fetchPost({ id: forum.lastPostId }).then(post => {
                  this.fetchUser({ id: post.userId });
                });
              }
            })
          );
        })
      ).then(() => {
        this.asyncDataStatus_fetched();
      });
    });
  }
};
</script>


<style scoped>
</style>
