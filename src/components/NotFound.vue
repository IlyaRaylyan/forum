<template>
  <div>
    <h1>404 Ooops! we cant find this page</h1>
    <router-link to="/">return to Home</router-link>
  </div>
</template>
<script>
export default {
  created() {
    this.$emit("ready");
  }
};
</script>