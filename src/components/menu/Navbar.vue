<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

const router = useRouter()
const route = useRoute()

// Tạo computed property để xác định route hiện tại
const currentRoutePath = computed(() => route.path)

// Kiểm tra xem một route có active không
const isActive = (path) => {
  if (path === '/') {
    // Nếu là trang chủ, chỉ active khi route chính xác là "/"
    return currentRoutePath.value === '/'
  }
  // Với các route khác, kiểm tra xem route hiện tại có bắt đầu bằng path không
  return currentRoutePath.value.startsWith(path)
}

const logout = () => {
  // Implement your logout logic here
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <header class="main-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img src="@/assets/images/logo-name.jpg" alt="Logo" height="40" class="logo-img" />
        </router-link>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: isActive('/') }"
                >TRANG CHỦ</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/courses" class="nav-link" :class="{ active: isActive('/courses') }"
                >KHOÁ HỌC</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" :class="{ active: isActive('/about') }"
                >VỀ CHÚNG TÔI</router-link
              >
            </li>
          </ul>

          <!-- Authentication Buttons -->
          <div class="navbar-nav">
            <template v-if="!props.isLoggedIn">
              <router-link to="/login" class="btn btn-outline-primary me-2">Đăng nhập</router-link>
              <router-link to="/register" class="btn btn-primary">Đăng ký</router-link>
            </template>
            <template v-else>
              <div class="dropdown">
                <button
                  class="btn btn-link dropdown-toggle user-dropdown"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    v-if="props.userData.avatar"
                    :src="props.userData.avatar"
                    class="avatar rounded-circle"
                    alt="User Avatar"
                  />
                  <span v-else class="avatar-placeholder rounded-circle">
                    {{
                      props.userData.fullName
                        ? props.userData.fullName.charAt(0).toUpperCase()
                        : 'U'
                    }}
                  </span>
                  <span class="ms-2">{{ props.userData.fullName || 'User' }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><router-link to="/profile" class="dropdown-item">Hồ sơ</router-link></li>
                  <li>
                    <router-link to="/my-courses" class="dropdown-item"
                      >Khóa học của tôi</router-link
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><button class="dropdown-item" @click="logout">Đăng xuất</button></li>
                </ul>
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
</style>