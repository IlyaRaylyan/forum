<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in
      <i>{{forum.name}}</i>
    </h1>
    <ThreadEditor ref="editor" @save="save" @cancel="cancel" />
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
    return {
      saved: false
    };
  },
  methods: {
    cancel() {
      this.$router.push("/");
    },
    save({ title, text }) {
      this.$store
        .dispatch("createThread", {
          forumId: this.forum[".key"],
          title,
          text
        })

        .then(thread => {
          this.saved = true;
          this.$router.push({
            name: "ThreadShow",
            params: { id: thread[".key"] }
          });
        })
        .catch(error => console.log(error));
    }
  },

  computed: {
    hasUnsavedChanges() {
      return (
        (this.$refs.editor.form.title || this.$refs.editor.form.text) &&
        !this.saved
      );
    },
    forum() {
      return this.$store.state.forums[this.id];
    }
  },
  created() {
    this.$store.dispatch("fetchForum", { id: this.id }).then(() => {
      this.asyncDataStatus_fetched();
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
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