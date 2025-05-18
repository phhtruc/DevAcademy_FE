<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  userData: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const userData = computed(() => authStore.userData)

const currentRoutePath = computed(() => route.path)

const isActive = (path) => {
  if (path === '/') {
    return currentRoutePath.value === '/'
  }
  return currentRoutePath.value.startsWith(path)
}

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <header class="main-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img src="@/assets/images/logo-name.jpg" alt="Logo" height="40" class="logo-img" />
        </router-link>

        <!-- Toggler for mobile -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: isActive('/') }"
                >TRANG CHỦ</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/khoa-hoc" class="nav-link" :class="{ active: isActive('/khoa-hoc') }"
                >KHOÁ HỌC</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/ve-chung-toi" class="nav-link" :class="{ active: isActive('/ve-chung-toi') }"
                >VỀ CHÚNG TÔI</router-link
              >
            </li>
          </ul>

          <div class="navbar-nav">
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="btn btn-outline-primary me-2">Đăng nhập</router-link>
              <router-link to="/register" class="btn btn-primary">Đăng ký</router-link>
            </template>
            <template v-else>
              <div class="d-flex align-items-center">
                <router-link to="/khoa-hoc-cua-toi" class="btn-outline-secondari me-3 mr-3">
                  Khóa học của tôi
                </router-link>

                <div class="dropdown">
                  <button
                    class="btn btn-link dropdown-toggle user-dropdown p-0"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      v-if="userData.avatar"
                      :src="userData.avatar"
                      class="avatar rounded-circle"
                      alt="User Avatar"
                    />
                    <span v-else class="avatar-placeholder rounded-circle">
                      <i class="fas fa-user"></i>
                    </span>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><router-link to="/ho-so-cua-nhan" class="dropdown-item">Hồ sơ</router-link></li>
                    <li>
                      <router-link to="/khoa-hoc-cua-toi" class="dropdown-item">
                        Khóa học của tôi
                      </router-link>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><button class="dropdown-item" @click="logout">Đăng xuất</button></li>
                  </ul>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.main-header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
}

.navbar {
  padding: 15px 0;
}

.navbar-nav .nav-item {
  margin: 0 15px;
}

.navbar-nav .nav-link {
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease;
}

/* Style cho link active */
.navbar-nav .nav-link.active {
  color: #0084ff !important;
  font-weight: 700;
  position: relative;
}

.navbar-nav .nav-link:hover {
  color: #3f6ad8;
}

.logo-img {
  transition: all 0.3s ease;
}

.navbar-brand:hover .logo-img {
  opacity: 0.8;
}

.avatar {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.avatar-placeholder {
  width: 30px;
  height: 30px;
  background-color: #3f6ad8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 0;
  text-decoration: none;
  color: #333;
}

.user-dropdown:hover,
.user-dropdown:focus {
  color: #3f6ad8;
  text-decoration: none;
}

.me-2 {
  margin-right: 0.5rem;
}

.ms-2 {
  margin-left: 0.5rem;
}

.position-relative {
  position: relative !important;
}

.dropdown-menu-custom {
  width: auto;
  min-width: 200px;
  max-width: 280px;
  right: 0;
  left: auto !important;
}

/* Fix dropdown position in normal view */
.dropdown {
  position: relative;
}

.dropdown-menu-end {
  right: 0;
  left: auto;
}

/* Đảm bảo thẻ li không bị tràn */
.dropdown-menu-custom li {
  white-space: normal; /* Cho phép text wrap trong các mục */
}

.dropdown-menu-custom .dropdown-item {
  padding: 0.5rem 1rem;
  white-space: normal; /* Cho phép text wrap */
}

/* Style cho avatar */
.avatar {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  background-color: #3f6ad8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

/* Fix user dropdown button */
.user-dropdown {
  display: flex;
  align-items: center;
  padding: 4px;
  text-decoration: none;
  color: #333;
  border: none;
}

.user-dropdown:hover,
.user-dropdown:focus {
  color: #3f6ad8;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 50%;
  text-decoration: none;
}

/* Tránh dropdown bị ẩn */
.dropdown:hover .dropdown-menu-custom,
.dropdown:focus-within .dropdown-menu-custom {
  display: block;
}

.btn-outline-secondari {
  border-color: #dee2e6;
  color: #6c757d;
}

.btn-outline-secondari:hover {
  background-color: white;
  color: #127be4;
}
</style>