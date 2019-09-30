<template>
  <div>
    <div v-if="user" class="thread">
      <div>
        <p>
          <router-link :to="{name: 'ThreadShow', params: {id: thread['.key']}}">{{thread.title}}</router-link>
        </p>
        <p class="text-faded text-xsmall">
          By
          <a href="#">{{user.name}}</a>
          ,
          <AppDate :timestamp="thread.publishedAt" />
        </p>
      </div>

      <div class="activity">
        <p class="replies-count">{{repliesCount}} replies</p>

        <img class="avatar-medium" :src="user.avatar" alt />
        <!-- 
        <div>
          <p class="text-xsmall">
            <a href="profile.html">Bruce Wayne</a>
          </p>
          <p class="text-xsmall text-faded">2 hours ago</p>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import { countFunctionForObj } from "@/utils";
export default {
  props: {
    thread: {
      required: true,
      type: Object
    }
  },
  computed: {
    repliesCount() {
      return countFunctionForObj(this.thread.posts) - 1;
    },
    user() {
      return this.$store.state.users[this.thread.userId];
    }
  },
  created() {
    this.$store.dispatch("fetchUser", { id: this.thread.userId });
  }
};
</script>