<script setup>
import NavbarComponent from './components/NavbarComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/menu/Navbar.vue';

const route = useRoute();
const isLoggedIn = ref(false);
const userData = ref({});

const isAuthPage = computed(() => {
  return route.path.includes('/login') || route.path.includes('/register');
});

const isAdminPage = computed(() => {
  return route.path.includes('/admin') || route.path.includes('/teacher');
});

// Xử lý trạng thái đăng nhập
const checkAuth = () => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (token) {
    isLoggedIn.value = true;
    userData.value = user;
  } else {
    isLoggedIn.value = false;
    userData.value = {};
  }
};

// Chạy checkAuth mỗi khi route thay đổi
watch(() => route.path, checkAuth);

// Khởi tạo
checkAuth();
</script>

<template>
  <div class="wrapper">
    <NavbarComponent v-if="!route.meta.hideNavbar && isAdminPage" />
    <SidebarComponent v-if="!route.meta.hideNavbar && isAdminPage" />
    <Navbar v-if="!isAuthPage && !isAdminPage" :isLoggedIn="isLoggedIn" :userData="userData" />
    <router-view />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
.vue-devtools__panel, .vue-devtools__anchor-btn {
  display: none !important;
}
</style>