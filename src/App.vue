<template>
  <div id="app">
    <TheNavBar />
    <div class="container">
      <router-view v-show="showPage" @ready="pageReady" />
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>
<script>
import NProgress from "nprogress";
import AppSpinner from "./components/AppSpinner.vue";
import TheNavBar from "./components/TheNavBar.vue";
export default {
  components: {
    TheNavBar,
    AppSpinner
  },
  data() {
    return {
      showPage: false
    };
  },
  methods: {
    pageReady() {
      this.showPage = true;
      NProgress.done();
    }
  },
  created() {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    });
    NProgress.start();
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false;

      next();
    });
  }
};
</script>

<style>
@import "./assets/css/style.css";
@import "`nprogress/nprogress.css";
#nprogress .bar {
  background: #57ad8d;
}
</style>
