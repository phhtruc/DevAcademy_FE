<script setup>
import NavbarComponent from './components/NavbarComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="wrapper">
    <NavbarComponent v-if="!route.meta.hideNavbar" />
    <SidebarComponent v-if="!route.meta.hideNavbar" />
    <router-view />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>