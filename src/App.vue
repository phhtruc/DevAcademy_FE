<script setup>
import NavbarComponent from './components/NavbarComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/menu/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return route.path.includes('/login') || route.path.includes('/register')
})

const isAdminPage = computed(() => {
  return route.path.includes('/admin') || route.path.includes('/teacher')
})

// Thêm logging để debug
console.log('Current route:', route.path)
console.log('isAuthPage:', isAuthPage.value)
console.log('isAdminPage:', isAdminPage.value)

watch(
  () => route.path,
  () => {
    console.log('Route changed, checking auth...')
    authStore.checkAuth()
  }
)

onMounted(() => {
  console.log('App mounted, checking auth...')
  authStore.checkAuth()
})
</script>

<template>
  <div class="wrapper">
    <!-- Hiển thị NavbarComponent và SidebarComponent cho admin & teacher -->
    <template v-if="!route.meta.hideNavbar && isAdminPage">
      <NavbarComponent />
      <SidebarComponent />
    </template>

    <!-- Navbar thông thường cho người dùng và khách -->
    <Navbar v-if="!isAuthPage && !isAdminPage" />

    <router-view />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
.vue-devtools__panel,
.vue-devtools__anchor-btn {
  display: none !important;
}
</style>