<template>
  <div>
    <div class="forum-listing">
      <div class="forum-details">
        <router-link
          :to="{  name: 'forumShow', 
         params: {id: forum['.key']}
         
         }"
          class="text-xlarge"
        >{{forum.name}}</router-link>

        <p>{{forum.description}}</p>
      </div>

      <div class="threads-count">
        <p class="count">{{threadsCount}}</p>
        {{threadsCount === 1? 'thread': 'threads'}}
      </div>

      <div class="last-thread">
        <img class="avatar" src alt />
        <div class="last-thread-details">
          <a href="thread.html">Where is the sign in button?</a>
          <p class="text-xsmall">
            By
            <a href="profile.html">Joseph Kerr</a>, three hours ago
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { countFunctionForObj } from "@/utils";
export default {
  props: {
    forum: {
      required: true,
      type: Object
    }
  },
  computed: {
    threadsCount() {
      return countFunctionForObj(this.forum.threads);
    }
  }
};
</script>
<style scoped>
</style>