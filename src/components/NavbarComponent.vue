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
      <nav class="navbar navbar-expand-lg navbar-light p-0">
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="ri-menu-3-line"></i>
        </button>
        <div class="iq-menu-bt align-self-center">
          <div class="wrapper-menu">
            <div class="line-menu half start"></div>
            <div class="line-menu"></div>
            <div class="line-menu half end"></div>
          </div>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto navbar-list">
            <li class="nav-item iq-full-screen">
              <a href="#" class="iq-waves-effect" id="btnFullscreen"
                ><i class="ri-fullscreen-line"></i
              ></a>
            </li>
          </ul>
        </div>
        <ul class="navbar-list">
          <li>
            <a href="#" class="search-toggle iq-waves-effect bg-primary text-white"
              ><img src="@/assets/images/user/1.jpg" class="img-fluid rounded" alt="user"
            /></a>
            <div class="iq-sub-dropdown iq-user-dropdown">
              <div class="iq-card iq-card-block iq-card-stretch iq-card-height shadow-none m-0">
                <div class="iq-card-body p-0">
                  <div class="bg-primary p-3">
                    <h5 class="mb-0 text-white line-height">Hello Nik jone</h5>
                    <span class="text-white font-size-12">Available</span>
                  </div>
                  <a href="profile.html" class="iq-sub-card iq-bg-primary-hover">
                    <div class="media align-items-center">
                      <div class="rounded iq-card-icon iq-bg-primary">
                        <i class="ri-file-user-line"></i>
                      </div>
                      <div class="media-body ml-3">
                        <h6 class="mb-0">My Profile</h6>
                        <p class="mb-0 font-size-12">View personal profile details.</p>
                      </div>
                    </div>
                  </a>
                  <a href="profile-edit.html" class="iq-sub-card iq-bg-primary-success-hover">
                    <div class="media align-items-center">
                      <div class="rounded iq-card-icon iq-bg-success">
                        <i class="ri-profile-line"></i>
                      </div>
                      <div class="media-body ml-3">
                        <h6 class="mb-0">Edit Profile</h6>
                        <p class="mb-0 font-size-12">Modify your personal details.</p>
                      </div>
                    </div>
                  </a>
                  <a href="account-setting.html" class="iq-sub-card iq-bg-primary-danger-hover">
                    <div class="media align-items-center">
                      <div class="rounded iq-card-icon iq-bg-danger">
                        <i class="ri-account-box-line"></i>
                      </div>
                      <div class="media-body ml-3">
                        <h6 class="mb-0">Account settings</h6>
                        <p class="mb-0 font-size-12">Manage your account parameters.</p>
                      </div>
                    </div>
                  </a>
                  <a href="privacy-setting.html" class="iq-sub-card iq-bg-primary-secondary-hover">
                    <div class="media align-items-center">
                      <div class="rounded iq-card-icon iq-bg-secondary">
                        <i class="ri-lock-line"></i>
                      </div>
                      <div class="media-body ml-3">
                        <h6 class="mb-0">Privacy Settings</h6>
                        <p class="mb-0 font-size-12">Control your privacy parameters.</p>
                      </div>
                    </div>
                  </a>
                  <div class="d-inline-block w-100 text-center p-3">
                    <button class="iq-bg-danger iq-sign-btn btn btn-danger" @click="handleLogout">
                      Đăng xuất <i class="ri-login-box-line ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const breadcrumbMap = {
  '/teacher/courses': { title: 'Quản Lý Khoá Học' },
  '/teacher/categories': { title: 'Quản Lý Danh Mục' },
  '/teacher/tech-stacks': { title: 'Quản Lý Công Nghệ' },
  '/admin/users': { title: 'Quản Lý Người Dùng' },
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

  // Chuyển hướng về trang đăng nhập
  router.push('/login')
}
</script>

