<template>
  <div class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <ThreadEditor ref="editor" @save="save" @cancel="cancel" :title="thread.title" :text="text" />
  </div>
</template>
<script>
import asyncDataStatus from "../mixins/asyncDataStatus";
import ThreadEditor from "./ThreadEditor.vue";
export default {
  components: {
    ThreadEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  data() {
    return {};
  },

  methods: {
    cancel() {
      this.$router.go(-1);
    },
    save({ title, text }) {
      this.$store
        .dispatch("updateThread", {
          id: this.id,
          title,
          text
        })
        .then(thread => {
          this.$router.push({
            name: "ThreadShow",
            params: { id: thread[".key"] }
          });
        });
    }
  },
  computed: {
    changedData() {
      if (
        this.text == this.$refs.editor.form.text &&
        this.thread.title == this.$refs.editor.form.title
      ) {
        return true;
      } else {
        return false;
      }
    },
    thread() {
      return this.$store.state.threads[this.id]
        ? this.$store.state.threads[this.id]
        : "";
    },
    text() {
      return this.$store.state.posts[this.thread.firstPostId]
        ? this.$store.state.posts[this.thread.firstPostId].text
        : "";
    }
  },
  created() {
    this.$store
      .dispatch("fetchThread", { id: this.id })
      .then(thread => {
        this.$store.dispatch("fetchPosts", { ids: thread.posts });
      })
      .then(() => {
        this.asyncDataStatus_fetched();
      });
  },
  beforeRouteLeave(to, from, next) {
    if (!this.changedData) {
      const confirmed = window.confirm(
        "Are you sure you want to leave? Unsaved changes will be lost"
      );
      if (confirmed) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>