<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');

// 사이드바 표시 여부를 결정하는 computed property
const showSidebar = computed(() => {
  // 로그인 페이지일 때는 사이드바 표시하지 않음
  return !isLoginPage.value;
});
</script>

<template>
  <Header />
  <Sidebar v-if="showSidebar" />
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.app-container {
  display: flex;
}

.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  font-size: 12px;
  text-align: left;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
}

nav a:hover {
  background-color: #ddd;
}

.content {
  padding: 2rem;
  flex: 1;
  max-width: calc(100% - 250px);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    font-size: 1rem;
  }
}
</style>
