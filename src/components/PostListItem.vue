<template>
  <div class="post" v-if="post && user">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>

      <a href="#">
        <img class="avatar-large" :src="user.avatar" alt />
      </a>

      <p class="desktop-only text-small">{{postCount}} posts</p>
    </div>

    <div class="post-content">
      <template v-if="!editing">
        <div>{{post.text}}</div>
        <a
          v-on:click.prevent="editing = true"
          href="#"
          style="margin-left: auto;"
          class="link-unstyled"
          title="Make a change"
        >
          <i class="fa fa-pencil"></i>
        </a>
      </template>

      <div v-else style="width:100%">
        <PostEditor @save="editing = false" @cancel="editing = false" :post="post" />
      </div>
    </div>

    <div class="post-date text-faded">
      <div v-if="post.edited" class="edition-info">edited</div>
      <AppDate :timestamp="post.publishedAt" />
    </div>
  </div>
</template>

<script>
import { countFunctionForObj } from "@/utils";
import PostEditor from "./PostEditor";
export default {
  components: { PostEditor },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      editing: false
    };
  },
  computed: {
    user() {
      return this.$store.state.users[this.post.userId];
    },
    postCount() {
      return this.$store.getters.userPostsCount(this.user[".key"]);
    }
  }
};
</script>
<style scoped>
.edition-info {
  padding-right: 7px;
}
</style>