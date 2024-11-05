<script setup>
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
<<<<<<< HEAD
// import EmployeeList from './components/admin/EmployeeList.vue';
// import ProductList from './components/product/ProductList.vue';
=======
import Sidebar from './components/Sidebar.vue'; 
>>>>>>> d9560b1fc654c3d704ff5c6c8a9d379ef0639f80
</script>

<template>
  <Header />
<<<<<<< HEAD
  <main class="content">
    <!-- <EmployeeList /> -->
    <RouterView />
    <!-- <ProductList/> -->
  </main>
=======
  <div class="app-container">
    <Sidebar />
    <main class="content">
      <RouterView />
    </main>
  </div>
>>>>>>> d9560b1fc654c3d704ff5c6c8a9d379ef0639f80
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
