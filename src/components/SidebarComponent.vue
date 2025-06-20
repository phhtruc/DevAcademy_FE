<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const userRole = ref(localStorage.getItem('roles'))
const authStore = useAuthStore()

const logout = () => {
  authStore.logoutAdim()
}
</script>

<template>
  <div class="iq-sidebar">
    <div class="iq-sidebar-logo d-flex justify-content-between">
      <router-link v-if="userRole === '[TEACHER]'" :to="'/teacher/courses'">
        <img src="@/assets/images/logo-name.jpg" class="img-fluid w-150" alt="" />
      </router-link>
      <router-link v-if="userRole === '[ADMIN]'" :to="'/admin/users'">
        <img src="@/assets/images/logo-name.jpg" class="img-fluid w-150" alt="" />
      </router-link>
    </div>
    <div id="sidebar-scrollbar">
      <nav class="iq-sidebar-menu">
        <ul id="iq-sidebar-toggle" class="iq-menu">
          <template v-if="userRole === '[TEACHER]'">
            <li :class="{ active: $route.path.startsWith('/teacher/courses') }">
              <router-link
                :to="'/teacher/courses'"
                class="iq-waves-effect collapsed"
                data-toggle="collapse"
                aria-expanded="false"
                ><i class="ri-home-4-line"></i><span>Quản Lý Khoá Học</span></router-link
              >
            </li>
            <li :class="{ active: $route.path.startsWith('/teacher/categories') }">
              <router-link
                :to="'/teacher/categories'"
                class="iq-waves-effect collapsed"
                data-toggle="collapse"
                aria-expanded="false"
                ><i class="ri-list-check"></i><span>Quản Lý Danh Mục</span></router-link
              >
            </li>
            <li :class="{ active: $route.path.startsWith('/teacher/tech-stacks') }">
              <router-link
                :to="'/teacher/tech-stacks'"
                class="iq-waves-effect collapsed"
                data-toggle="collapse"
                aria-expanded="false"
                ><i class="ri-stack-line"></i><span>Quản Lý Công Nghệ</span></router-link
              >
            </li>
          </template>
          <template v-else-if="userRole === '[ADMIN]'">
            <li :class="{ active: $route.path.startsWith('/admin/users') }">
              <router-link
                :to="'/admin/users'"
                class="iq-waves-effect collapsed"
                data-toggle="collapse"
                aria-expanded="false"
                ><i class="ri-home-4-line"></i><span>Quản Lý Người Dùng</span></router-link
              >
            </li>
          </template>
          <li class="logout-item mt-auto" @click="logout">
            <a href="#" class="iq-waves-effect">
              <i class="ri-logout-box-r-line"></i>
              <i class="ri-logout-box-line text-danger"></i>
              <span style="color: red;">Đăng xuất</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.iq-sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#sidebar-scrollbar {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.iq-sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.iq-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
}

.logout-item {
  margin-top: auto;
  border-top: 1px solid #eee;
  padding: 10px 15px;
}
</style>