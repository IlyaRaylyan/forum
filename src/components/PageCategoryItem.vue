<template>
  <div v-if="currentForum" class="forum-listing">
    <div class="forum-details">
      <router-link
        class="text-xlarge"
        :to="{name: 'forumShow', params: {id:currentForum['.key']}}"
      >{{currentForum.name}}</router-link>

      <p>{{currentForum.description}}</p>
    </div>

    <div class="threads-count">
      <p class="count">{{countThreads}}</p>threads
    </div>

    <div class="last-thread" v-if="lastPost && lastUser">
      <img class="avatar" :src="lastUser.avatar" alt />
      <div class="last-thread-details">
        <a
          href="thread.html"
        >{{lastPost.text? lastPost.text.split('').splice(0, 30).join('')+ '...' : 'No threads here'}}</a>
        <p class="text-xsmall">
          By
          <a href="profile.html">{{lastUser.name }}</a>
          ,
          <AppDate :timestamp="lastPost.publishedAt" />
        </p>
      </div>
    </div>
    <div class="last-thread" v-else>
      <div class="last-thread-details">
        <p class="text-xsmall">No threads here</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    forum: {
      required: true
    }
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
    currentForum() {
      return this.$store.state.forums[this.forum];
    },
    countThreads() {
      return this.currentForum.threads
        ? Object.values(this.currentForum.threads).length
        : 0;
    },
    lastPost() {
      return this.currentForum.lastPostId
        ? this.$store.state.posts[this.currentForum.lastPostId]
        : "undefined";
    },
    lastUser() {
      return this.lastPost.userId
        ? this.$store.state.users[this.lastPost.userId]
        : "";
    }
  },
  created() {}
};
</script>
