<script setup>
import NavbarComponent from './components/NavbarComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'
</script>

<template>
  <div class="wrapper">
    <NavbarComponent />
    <SidebarComponent />
    <router-view />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>