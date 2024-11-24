<template>
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';

  export default defineComponent({
    name: 'LoginForm',
    data() {
      return {
        username: '',
        password: '',
        error: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post('http://localhost:3000/login', {
            username: this.username,
            password: this.password,
          });

          // Store token in localStorage
          localStorage.setItem('token', response.data.token);

          // Redirect to home or another secured page
          this.$router.push('/home');
        } catch (err) {
          this.error = 'err' +  err;
        }
      },
    },
  });
  </script>

  <style scoped>
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
