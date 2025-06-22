<template>
  <div class="iq-top-navbar">
    <div class="iq-navbar-custom">
      <div class="iq-sidebar-logo">
        <div class="top-logo">
          <router-link v-if="userRole === '[TEACHER]'" :to="'/teacher/courses'">
            <img src="@/assets/images/logo-name.jpg" class="img-fluid w-150" alt="" />
          </router-link>
          <router-link v-if="userRole === '[ADMIN]'" :to="'/admin/users'">
            <img src="@/assets/images/logo-name.jpg" class="img-fluid w-150" alt="" />
          </router-link>
        </div>
      </div>
      <div class="navbar-breadcrumb">
        <h5 class="mb-0">{{ currentBreadcrumb.title }}</h5>
        <nav aria-label="breadcrumb">
          <ul class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/teacher/courses">Trang chủ</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ currentBreadcrumb.title }}
            </li>
          </ul>
        </nav>
      </div>
      <b-navbar toggleable="lg" class="p-0">
        <b-navbar-toggle target="navbarSupportedContent">
          <i class="ri-menu-3-line"></i>
        </b-navbar-toggle>
        <div class="iq-menu-bt align-self-center">
          <div class="wrapper-menu">
            <div class="line-menu half start"></div>
            <div class="line-menu"></div>
            <div class="line-menu half end"></div>
          </div>
        </div>
        <b-collapse id="navbarSupportedContent" class="ml-auto">
          <b-navbar-nav class="ml-auto">
            <!-- Các mục menu khác nếu có -->
          </b-navbar-nav>
        </b-collapse>
        
        <!-- User profile dropdown với Bootstrap Vue -->
        <!-- <b-nav class="ml-auto">
          <b-nav-item-dropdown right no-caret class="ml-2">
            <template #button-content>
              <img src="@/assets/images/user/1.jpg" class="img-fluid rounded" alt="user" style="width: 40px; height: 40px;" />
            </template>
            
            <div style="width: 320px;">
              <div class="bg-primary p-3">
                <h5 class="mb-0 text-white">Hello Nik jone</h5>
                <span class="text-white small">Available</span>
              </div>
              
              <b-dropdown-item href="#" class="p-0">
                <div class="d-flex align-items-center p-3 hover-bg-light">
                  <div class="rounded bg-primary p-2 mr-3 text-center" style="width: 40px; height: 40px;">
                    <i class="ri-file-user-line text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-0">My Profile</h6>
                    <p class="mb-0 small">View personal profile details.</p>
                  </div>
                </div>
              </b-dropdown-item>
              
              <b-dropdown-item href="#" class="p-0">
                <div class="d-flex align-items-center p-3 hover-bg-light">
                  <div class="rounded bg-success p-2 mr-3 text-center" style="width: 40px; height: 40px;">
                    <i class="ri-profile-line text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-0">Edit Profile</h6>
                    <p class="mb-0 small">Modify your personal details.</p>
                  </div>
                </div>
              </b-dropdown-item>
              
              <b-dropdown-item href="#" class="p-0">
                <div class="d-flex align-items-center p-3 hover-bg-light">
                  <div class="rounded bg-danger p-2 mr-3 text-center" style="width: 40px; height: 40px;">
                    <i class="ri-account-box-line text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-0">Account settings</h6>
                    <p class="mb-0 small">Manage your account parameters.</p>
                  </div>
                </div>
              </b-dropdown-item>
              
              <b-dropdown-item href="#" class="p-0">
                <div class="d-flex align-items-center p-3 hover-bg-light">
                  <div class="rounded bg-secondary p-2 mr-3 text-center" style="width: 40px; height: 40px;">
                    <i class="ri-lock-line text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-0">Privacy Settings</h6>
                    <p class="mb-0 small">Control your privacy parameters.</p>
                  </div>
                </div>
              </b-dropdown-item>
              
              <div class="text-center p-3">
                <b-button variant="danger" class="px-4" @click="handleLogout">
                  Đăng xuất <i class="ri-login-box-line ml-2"></i>
                </b-button>
              </div>
            </div>
          </b-nav-item-dropdown>
        </b-nav> -->
      </b-navbar>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role || '')

const breadcrumbMap = {
  '/teacher/courses': { title: 'Quản Lý Khoá Học' },
  '/teacher/categories': { title: 'Quản Lý Danh Mục' },
  '/teacher/tech-stacks': { title: 'Quản Lý Công Nghệ' },
  '/admin/users': { title: 'Quản Lý Người Dùng' },
  '/teacher/progress': { title: 'Tổng quan tiến độ' },
}

const currentBreadcrumb = computed(() => {
  const path = route.path
  return breadcrumbMap[path] || { title: 'Trang chủ' }
})

function handleLogout() {
  // Xoá token khỏi localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('roles')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')

  // Chuyển hướng về trang đăng nhập
  router.push('/login')
}
</script>
<style scoped>
.hover-bg-light:hover {
  background-color: #f8f9fa;
}
</style>

