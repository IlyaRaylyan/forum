import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

import { countFunctionForObj } from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters: {
    authUser(state) {
      return state.authId ? state.users[state.authId] : null;
    },
    userPostsCount: state => id => countFunctionForObj(state.users[id].posts),
    userThreadsCount: state => id =>
      countFunctionForObj(state.users[id].threads)
  },

  mutations: {
    setUnsubscribeAuthObserver(state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe;
    },

    setPost(state, { post, postId }) {
      Vue.set(state.posts, postId, post);
    },
    setUser(state, { user, userId }) {
      Vue.set(state.users, userId, user);
    },
    setThread(state, { thread, threadId }) {
      Vue.set(state.threads, threadId, thread);
    },
    setItem(state, { item, id, resource }) {
      item[".key"] = id;
      Vue.set(state[resource], id, item);
    },
    appendPostToTread(state, { postId, threadId }) {
      const thread = state.threads[threadId];
      if (!thread.posts) {
        Vue.set(thread, "posts", {});
      }
      Vue.set(thread.posts, postId, postId);
    },
    appendPostToUser(state, { postId, userId }) {
      const user = state.users[userId];
      if (!user.posts) {
        Vue.set(user, "posts", {});
      }
      Vue.set(user.posts, postId, postId);
    },
    appendThreadToForum(state, { forumId, threadId }) {
      const forum = state.forums[forumId];
      if (!forum.threads) {
        Vue.set(forum, "threads", {});
      }
      Vue.set(forum.threads, threadId, threadId);
    },
    appendThreadToUser(state, { userId, threadId }) {
      const user = state.users[userId];
      if (!user.threads) {
        Vue.set(user, "threads", {});
      }
      Vue.set(user.threads, threadId, threadId);
    },
    setAuthId(state, id) {
      console.log("setSuthId userId pay att " + id);
      state.authId = id;
    }
  },
  actions: {
    initAuthentication({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        // unsubscribe observer if already listening
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver();
        }

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          if (user) {
            dispatch("fetchAuthUser").then(dbUser => {
              resolve(dbUser);
            });
          } else {
            resolve(null);
          }
        });
        commit("setUnsubscribeAuthObserver", unsubscribe);
      });
    },

    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setAuthId", null);
        });
    },
    signInWithEmail(context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    signInWithGoogle({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider();

      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(data => {
          const user = data.user;
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .once("value", snapshot => {
              if (!snapshot.exists()) {
                return dispatch("createUser", {
                  id: user.uid,
                  name: user.displayName,
                  email: user.email,
                  username: user.email,
                  avatar: user.photoURL
                }).then(() => dispatch("fetchAuthUser"));
              }
            });
        });
    },

    fetchAuthUser({ dispatch, commit }) {
      const userId = firebase.auth().currentUser.uid;
      return new Promise((resolve, reject) => {
        // check if user exists in the database
        firebase
          .database()
          .ref("users")
          .child(userId)
          .once("value", snapshot => {
            if (snapshot.exists()) {
              return dispatch("fetchUser", { id: userId }).then(user => {
                commit("setAuthId", userId);
                resolve(user);
              });
            } else {
              resolve(null);
            }
          });
      });
    },
    registerWithEmail(
      { dispatch },
      { email, name, username, password, avatar = null }
    ) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user.user.uid);
          return dispatch("createUser", {
            id: user.user.uid,
            email,
            name,
            username,
            password,
            avatar
          });
        });
    },
    createUser(
      { state, commit },
      { id, email, name, username, avatar = null }
    ) {
      return new Promise(resolve => {
        const registeredAt = Math.floor(Date.now() / 1000);
        const usernameLower = username.toLowerCase();
        email = email.toLowerCase();
        const user = {
          avatar,
          email,
          name,
          username,
          registeredAt,
          usernameLower
        };

        firebase
          .database()
          .ref("users")
          .child(id)
          .set(user)
          .then(() => {
            commit("setItem", { resource: "users", id: id, item: user });
            resolve(state.users[id]);
          });
      });
    },
    fetchCategories({ commit, state }) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref("categories")
          .once("value", snapshot => {
            const categoriesObject = snapshot.val();
            Object.keys(categoriesObject).forEach(categoryId => {
              const category = categoriesObject[categoryId];
              commit("setItem", {
                resource: "categories",
                id: categoryId,
                item: category
              });
            });
            resolve(Object.values(state.categories));
          });
      });
    },
    fetchForum({ dispatch }, { id }) {
      console.log("forum-" + id);
      return dispatch("fetchItem", { resource: "forums", id });
    },
    fetchCategory({ dispatch }, { id }) {
      console.log("category-" + id);
      return dispatch("fetchItem", { resource: "categories", id });
    },
    fetchThread({ dispatch }, { id }) {
      console.log("fetch thread " + id);
      return dispatch("fetchItem", { resource: "threads", id });
    },
    fetchUser({ dispatch }, { id }) {
      console.log("fetch user " + id);
      return dispatch("fetchItem", { resource: "users", id });
    },
    fetchPost({ dispatch }, { id }) {
      console.log("fetch post " + id);
      return dispatch("fetchItem", { resource: "posts", id });
    },
    fetchPosts({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "posts", ids });
    },
    fetchForums({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "forums", ids });
    },
    fetchThreads({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "threads", ids });
    },
    fetchItem({ state, commit }, { id, resource }) {
      console.log("fetch item " + id);

      return new Promise(resolve => {
        firebase
          .database()
          .ref(resource)
          .child(id)
          .once("value", snapshot => {
            commit("setItem", {
              resource,
              id: snapshot.key,
              item: snapshot.val()
            });

            resolve(state[resource][id]);
          });
      });
    },

    fetchItems({ dispatch }, { ids, resource }) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids);
      return Promise.all(
        ids.map(id => dispatch("fetchItem", { id, resource }))
      );
    },
    updatePost({ commit, state }, { id, text }) {
      return new Promise(resolve => {
        const post = state.posts[id];
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: state.authId
        };

        const updates = { text, edited };

        firebase
          .database()
          .ref("posts")
          .child(id)
          .update(updates)

          .then(() => {
            commit("setPost", {
              postId: id,
              post: {
                ...post,
                text,
                edited
              }
            });
            resolve(post);
          });
      });
    },
    updateThread({ state, commit, dispatch }, { title, text, id }) {
      return new Promise(resolve => {
        const thread = state.threads[id];
        const post = state.posts[thread.firstPostId];
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: state.authId
        };

        const updates = {};
        updates[`posts/${thread.firstPostId}/text`] = text;
        updates[`posts/${thread.firstPostId}/edited`] = edited;
        updates[`threads/${id}/title`] = title;

        firebase
          .database()
          .ref()
          .update(updates)
          .then(() => {
            commit("setThread", { thread: { ...thread, title }, threadId: id });

            commit("setPost", {
              postId: thread.firstPostId,
              post: {
                ...post,
                text,
                edited
              }
            });
            resolve(thread);
          });
      });
    },
    createPost({ commit, state }, post) {
      const postId = firebase
        .database()
        .ref("posts")
        .push().key;

      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);

      const updates = {};
      updates[`posts/${postId}`] = post;
      updates[`threads/${post.threadId}/posts/${postId}`] = postId;
      updates[`users/${post.userId}/posts/${postId}`] = postId;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit("setItem", { resource: "posts", item: post, id: postId });
          commit("appendPostToTread", { threadId: post.threadId, postId });
          commit("appendPostToUser", { userId: post.userId, postId });
          return Promise.resolve(state.posts[postId]);
        });
    },
    updateUser({ commit }, user) {
      commit("setUser", { userId: user[".key"], user });
    },
    createThread({ state, commit }, { text, title, forumId }) {
      return new Promise(resolve => {
        const userId = state.authId;
        const publishedAt = Math.floor(Date.now() / 1000);
        const threadId = firebase
          .database()
          .ref("threads")
          .push().key;
        const postId = firebase
          .database()
          .ref("posts")
          .push().key;

        const thread = {
          title,
          forumId,
          publishedAt,
          userId,
          firstPostId: postId,
          posts: {}
        };
        thread.posts[postId] = postId;
        const post = { text, publishedAt, threadId, userId };

        const updates = {};
        updates[`threads/${threadId}`] = thread;
        updates[`forums/${forumId}/threads/${threadId}`] = threadId;
        updates[`users/${userId}/threads/${threadId}`] = postId;

        updates[`posts/${postId}`] = post;

        updates[`users/${userId}/posts/${postId}`] = postId;
        console.log(updates);
        firebase
          .database()
          .ref()
          .update(updates)
          .then(() => {
            commit("setItem", {
              resource: "threads",
              id: threadId,
              item: thread
            });
            commit("appendThreadToUser", { userId, threadId });
            commit("appendThreadToForum", { forumId, threadId });

            commit("setItem", { resource: "posts", item: post, id: postId });
            commit("appendPostToTread", { threadId: post.threadId, postId });
            commit("appendPostToUser", { userId: post.userId, postId });

            resolve(state.threads[threadId]);
          });
      });
    }
  }
});
