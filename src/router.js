import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ThreadShow from "./components/ThreadShow.vue";
import PageForumShow from "./components/PageForumShow.vue";
import PageCategory from "./components/PageCategory.vue";
import PageCategoryDetails from "./components/PageCategoryDetails.vue";
import ProfilePage from "./components/ProfilePage.vue";
import ThreadCreate from "./components/PageThreadCreate.vue";
import ThreadEdit from "./components/PageThreadEdit.vue";
import Register from "./components/PageRegister.vue";
import Signin from "./components/PageSignin.vue";
import store from "./store";
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/logout",
      name: "Signout",
      meta: {
        requiresAuth: true
      },
      beforeEnter() {
        store.dispatch("signOut").then(() => next({ name: "Home" }));
      }
    },
    {
      path: "/me",
      name: "Profile",
      component: ProfilePage,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/thread/create/:id",
      name: "ThreadCreate",
      component: ThreadCreate,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/me/edit/",
      name: "ProfileEdit",
      component: ProfilePage,
      props: { edit: true },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/thread/:id",
      name: "ThreadShow",
      component: ThreadShow,
      props: true
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: ThreadEdit,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/forum/:id",
      name: "forumShow",
      component: PageForumShow,
      props: true
    },
    {
      path: "/category/:id",
      name: "PageCategory",
      component: PageCategory,
      props: true
    },
    {
      path: "/category-details/:id",
      name: "PageCategoryDetails",
      component: PageCategoryDetails,
      props: true
    },
    {
      path: "*",
      name: "NotFound",
      component: () =>
        import(/* webpackChunkName: "NotFound" */ "./components/NotFound.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  store.dispatch("initAuthentication").then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
      if (user) {
        next();
      } else {
        next({ name: "Signin", query: { redirectTo: to.path } });
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      if (!user) {
        next();
      } else {
        next({ name: "home" });
      }
    } else {
      next();
    }
  });
});

export default router;
