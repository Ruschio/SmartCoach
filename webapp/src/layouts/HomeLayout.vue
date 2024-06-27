<script setup lang="ts">
import { RouterView } from 'vue-router'
import Hero from '@/components/Hero.vue'
import FadeTransition from '@/components/FadeTransition.vue'
</script>

<template>
  <div class="container-fluid p-0 m-0 h-100 d-block d-lg-flex align-items-center">
    <div class="row">
      <header class="col-12 col-lg-5 py-5">
        <div class="wrapper">
          <Hero title="SmartCoach" />

          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </div>
      </header>

      <main class="col-12 col-lg-7 pt-3 pt-lg-5 pb-5">
        <RouterView v-slot="{ Component }">
          <FadeTransition>
            <component :is="Component" />
          </FadeTransition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
header {
  max-height: 100vh;
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  align-content: center;
}

@media (min-width: 992px) {
  header {
    top: 0;
    padding-right: 10%;
    gap: 2rem;
    display: flex;
    flex-flow: row wrap;
    align-content: space-around;
    position: sticky;
  }

  header .logo {
    margin: 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    flex: 1 1 250px;
  }

  nav {
    margin-top: 1rem;
    margin-left: -1rem;
    padding: 1rem 0;
    text-align: left;
    font-size: 1rem;
  }
}
</style>
