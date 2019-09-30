<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" action class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            v-model="form.name"
            @blur="$v.form.name.$touch()"
            id="name"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="form-error">This field is required</span>
          </template>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            @blur="$v.form.username.$touch()"
            v-model.lazy="form.username"
            id="username"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.username.$error">
            <span v-if="!$v.form.username.required" class="form-error">This field is required</span>
            <span v-if="!$v.form.username.unique" class="form-error">Sorry! This username is taken</span>
          </template>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            @blur="$v.form.email.$touch()"
            v-model.lazy="form.email"
            id="email"
            type="email"
            class="form-input"
          />
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">This field is required</span>
            <span v-if="!$v.form.email.unique" class="form-error">Sorry! This email is taken</span>
          </template>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            @blur="$v.form.password.$touch()"
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">This field is required</span>
            <span
              v-if="!$v.form.password.minLength"
              class="form-error"
            >The password must be at least 6 characters long</span>
          </template>
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            @blur="$v.form.avatar.$touch()"
            v-model.lazy="form.avatar"
            id="avatar"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.avatar.$error">
            <span v-if="!$v.form.avatar.url" class="form-error">This URL is invalid</span>
            <span
              v-else-if="!$v.form.avatar.supportedImageFile"
              class="form-error"
            >This file type is not supported</span>
            <!-- <span
              v-else-if="!$v.form.avatar.responseOk"
              class="form-error"
            >This image cannot be found</span>-->
          </template>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button @click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { required, email, minLength, url } from "vuelidate/lib/validators";

import {
  uniqueUsername,
  uniqueEmail,
  supportedImageFile
} from "../utils/validators";
export default {
  data() {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    };
  },
  validations: {
    form: {
      name: {
        required
      },
      username: {
        required,
        unique: uniqueUsername
      },
      password: {
        required,
        minLength: minLength(6)
      },
      email: {
        required,
        email,
        unique: uniqueEmail
      },
      avatar: {
        url,
        supportedImageFile
        // responseOk(value) {
        //   console.log(value);
        //   if (!vuelidateHelpers.req(value)) {
        //     return true;
        //   }
        //   return new Promise((resolve, reject) => {
        //     fetch(value, { mode: "no-cors" })
        //       .then(response => {
        //         console.log(response);
        //         return resolve(response.ok);
        //       })
        //       .catch(error => {
        //         console.log(error);
        //         return resolve(false);
        //       });
        //   });
        // }
      }
    }
  },
  methods: {
    register() {
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        return;
      }
      this.$store
        .dispatch("registerWithEmail", this.form)

        .then(() => {
          this.$router.push("/");
        });
    },
    registerWithGoogle() {
      this.$store.dispatch("signInWithGoogle").then(() => {
        this.$router.push("/");
      });
    }
  },
  created() {
    this.$emit("ready");
  }
};
</script>