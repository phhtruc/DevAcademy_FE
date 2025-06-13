<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import LoadingComponent from '@/components/LoadingComponent.vue'

const route = useRoute();
const router = useRouter();
const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API

onMounted(async () => {
  const code = route.query.code;
  if (!code) {
    console.error("Missing code in Google callback");
    return;
  }

  try {
    const res = await axios.get(`${rootAPI}/auth/social/callback?code=${code}`);
    
    const { id, roles, accessToken, refreshToken } = res.data.data

    // Lưu token vào localStorage
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('roles', roles)

    // Tạo đối tượng user để lưu vào localStorage
    const userData = {
      id,
    }

    // Chuyển đối tượng userData thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem('user', JSON.stringify(userData))

    // Điều hướng theo role
    if (roles.includes('ADMIN')) {
      router.push('/admin/users')
    } else if (roles.includes('TEACHER')) {
      router.push('/teacher/courses')
    } else {
      router.push('/')
    }
    
  } catch (error) {
    console.error("Lỗi xử lý callback Google:", error);
  }
});
</script>
<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
      <LoadingComponent text="Đang xử lý đăng nhập..." />
    </div>
  </div>
</template>