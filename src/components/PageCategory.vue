<template>
  <div class="category-wraper">
    <div class="forum-list">
      <h2 class="list-title">
        <router-link
          :to="{ name:'PageCategoryDetails' , params: {id: category['.key']} }"
        >{{category.name}}</router-link>
      </h2>
    </div>
    <PageCategoryItem v-for="forum in category.forums" :forum="forum" :key="forum['.key']" />
  </div>
</template>
<script>
import PageCategoryItem from "./PageCategoryItem.vue";
export default {
  components: {
    PageCategoryItem
  },
  props: {
    category: {
      required: true,
      type: Object
    }
  },
  computed: {}
};
</script>
<style scoped>
.category-wraper {
  width: 100%;
}
</style>