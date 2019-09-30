<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <div class="forum-list">
      <div class="category-wraper">
        <h2 class="list-title">
          <router-link
            :to="{ name:'PageCategoryDetails' , params: {id: category['.key']} }"
          >{{category.name}}</router-link>
        </h2>
        <PageCategoryItem v-for="forum in category.forums" :forum="forum" :key="forum['.key']" />
      </div>
    </div>
  </div>
</template>
<script>
import asyncDataStatus from "../mixins/asyncDataStatus";
import PageCategoryItem from "./PageCategoryItem.vue";
export default {
  components: {
    PageCategoryItem
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    category() {
      return this.$store.state.categories[this.id];
    }
  },
  created() {
    this.$store.dispatch("fetchCategory", { id: this.id }).then(category => {
      this.$store.dispatch("fetchForums", { ids: category.forums });
    });
  }
};
</script>
<style scoped>
.category-wraper {
  width: 100%;
}
</style>