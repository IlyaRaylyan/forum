<template>
  <form>
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input v-model="form.title" type="text" id="thread_title" class="form-input" name="title" />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button
        @click.prevent="save"
        class="btn btn-blue"
        name="Publish"
      >{{isUpdate ? 'update' : 'publish'}}</button>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      form: { title: this.title, text: this.text }
    };
  },
  methods: {
    save() {
      this.$emit("save", { title: this.form.title, text: this.form.text });
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  computed: {
    isUpdate() {
      return !!this.title;
    }
  }
};
</script>
