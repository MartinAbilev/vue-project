<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li><router-link to="/home">Home</router-link></li>
          <li v-if="isAuthenticated"><button @click="logout">Logout</button></li>
        </ul>
      </nav>
    </header>
    <main>
      <!-- This is where the routed components will be rendered -->
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  computed: {
    isAuthenticated() {
      // Check if a token exists to determine authentication status
      return !!localStorage.getItem('token');
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token'); // Clear token on logout
      this.$router.push('/login'); // Redirect to login page
    },
  },
});
</script>

<style scoped>
/* Add some basic styling */
header {
  background: #f8f8f8;
  padding: 10px;
}
nav ul {
  display: flex;
  list-style: none;
  padding: 0;
}
nav ul li {
  margin-right: 20px;
}
main {
  padding: 20px;
}
</style>
