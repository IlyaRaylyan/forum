<template>
  <div
    class="post-date text-faded"
    :title="timestamp | HumanFriebdlyDate"
  >{{timestamp | diffForHumans}}</div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  filters: {
    HumanFriebdlyDate(date) {
      return moment.unix(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    diffForHumans(date) {
      return moment.unix(date).fromNow();
    }
  }
};
</script>
<style scoped>
</style>