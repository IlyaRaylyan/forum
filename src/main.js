import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AppDate from "./components/AppDate.vue";
import firebase from "firebase/app";
import Vuelidate from "vuelidate";
import VueAnalytics from "vue-analytics";
Vue.use(VueAnalytics, {
  id: "210917459",
  router
});

Vue.use(Vuelidate);
Vue.component("AppDate", AppDate);

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyDYEYyKdJlnOU3pstE2ovtI2qwwVjZnD_w",
  authDomain: "forum-ab01f.firebaseapp.com",
  databaseURL: "https://forum-ab01f.firebaseio.com",
  projectId: "forum-ab01f",
  storageBucket: "",
  messagingSenderId: "743714630181",
  appId: "1:743714630181:web:27dfd7982b3c85af476dcc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,

  render: h => h(App)
}).$mount("#app");
