<template>
  <form v-if="user">
    <div class="form-group">
      <textarea v-model="newPostText" name id cols="30" rows="10" class="form-input"></textarea>
    </div>
    <div class="form-actions">
      <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button v-on:click.prevent="save" class="btn-blue">{{isUpdate ? 'update' : 'submit post'}}</button>
    </div>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    threadId: { required: false },
    post: { type: Object }
  },
  data() {
    return { newPostText: this.post ? this.post.text : "" };
  },

  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.persist().then(post => {
        this.$emit("save", { post });
      });
    },
    create() {
      const post = {
        text: this.newPostText,
        threadId: this.threadId
      };

      this.newPostText = "";

      return this.$store.dispatch("createPost", post);
    },
    update() {
      const payload = {
        id: this.post[".key"],
        text: this.newPostText
      };
      return this.$store.dispatch("updatePost", payload);
    },
    persist() {
      return this.isUpdate ? this.update() : this.create();
    }
  },
  computed: {
    ...mapGetters({
      user: "authUser"
    }),
    isUpdate() {
      return !!this.post;
    }
  }
};
</script>
<style scoped>
</style>

