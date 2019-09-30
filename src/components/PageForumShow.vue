<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper">
    <div class="col-full push-top">
   

      <div  class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link :to="{name: 'ThreadCreate', params: { id: this.forum['.key']}}"  class="btn-green btn-small">Start a thread</router-link to="">
      </div>
    </div>
    <div class="col-full push-top">
     <ThreadList :threads="threads"/>
     
      </div>

    </div>

</template>
<script>
import asyncDataStatus from "../mixins/asyncDataStatus";
import ThreadList from "./ThreadList.vue"
export default {
  components: {
    ThreadList
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums[this.id]
    },
    threads() {
  

      return Object.values(this.$store.state.threads).filter(thread => 
     
         thread.forumId === this.id)
    }
  },
  created() {
   this.$store.dispatch('fetchForum', {id: this.id}).then(forum => 
   this.$store.dispatch('fetchThreads', { ids: forum.threads? forum.threads: []} ).then(() => {
        this.asyncDataStatus_fetched();
      })
   )
   

    }
  }

</script>
<style scoped>
.forum-wrapper {
  width: 100%
}
</style>


