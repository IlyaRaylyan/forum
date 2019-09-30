<template>
  <div class="forum-list">
    <PageCategory v-for="category in categories" :key="category['.key']" :category="category" />
  </div>
</template>
<script>
import PageCategory from "./PageCategory.vue";
export default {
  components: {
    PageCategory
  },

  props: {
    forums: {
      required: true,
      type: Array
    },
    categories: {
      required: true,
      type: Object
    }
  }
};
</script>
<style scoped>
</style>