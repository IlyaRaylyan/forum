<template>
  <header class="header" id="header">
    <a href="index.html" class="logo">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </a>

    <div
      class="btn-hamburger"
      v-bind:class="{ 'btn-hamburger-active' : navBarTrigger}"
      @click.prevent="navBarTrigger = !navBarTrigger"
    >
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" v-bind:class="{ 'navbar-open' : navBarTrigger}">
      <ul v-if="user">
        <li class="navbar-user" v-click-outside="closeUserDropdown">
          <a @click.prevent="dropDownTrigger = !dropDownTrigger">
            <img class="avatar-small" :src="user.avatar" alt />
            <span>
              {{user.name}}
              <img class="icon-profile" src="../assets/img/svg/arrow-profile.svg" alt />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" v-bind:class="{ 'active-drop' : dropDownTrigger} ">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{name: 'Profile'}">View profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('signOut')">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li class="navbar-item">
          <router-link :to="{name: 'Signin'}">Sign In</router-link>
        </li>
        <li class="navbar-item">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
      </ul>

      <ul>
        <li class="navbar-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/">Category</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/">Forum</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/">Thread</router-link>
        </li>
        <!-- Show these option only on mobile-->
        <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script>
import { mapGetters } from "vuex";
import clickOutside from "../directives/click-outside";
export default {
  directives: {
    clickOutside
  },
  data() {
    return {
      dropDownTrigger: false,
      navBarTrigger: false
    };
  },

  computed: {
    ...mapGetters({ user: "authUser" })
  },
  methods: {
    closeUserDropdown() {
      this.dropDownTrigger = false;
    }
  }
};
</script>