<template>
  <section
    class="sign-in-page bg-white d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="container-fluid p-0">
      <div class="row no-gutters justify-content-center">
        <div class="col-sm-6 align-self-center">
          <div class="sign-in-from">
            <h1 class="mb-0">Đăng nhập</h1>
            <form class="mt-4" @submit.prevent="handleLogin">
              <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
                {{ errorMessage }}
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <span v-if="emailError" class="text-danger ml-2">{{ emailError }}</span>
                <input
                  v-model="email"
                  type=""
                  class="form-control mb-0"
                  id="exampleInputEmail1"
                  placeholder="Nhập email"
                />
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Mật khẩu</label>
                <span v-if="passwordError" class="text-danger ml-2">{{ passwordError }}</span>
                <a href="#" class="float-right">Quên mật khẩu?</a>
                <input
                  v-model="password"
                  type="password"
                  class="form-control mb-0"
                  id="exampleInputPassword1"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div class="d-inline-block w-100">
                <div class="custom-control custom-checkbox d-inline-block mt-2 pt-1">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck1"
                  />
                  <label class="custom-control-label" for="customCheck1">Nhớ tài khoản</label>
                </div>
                <button type="submit" class="btn btn-primary float-right">Đăng nhập</button>
              </div>
              <div class="sign-info">
                <div class="mt-0">
                  <button @click.prevent="loginWithGoogle" class="btn btn-danger w-100">
                    <i class="fab fa-google me-2"></i> Đăng nhập với Google
                  </button>
                </div>
                <span class="dark-color d-inline-block line-height-2 mt-3"
                  >Chưa có tài khoản? <router-link :to="`/register`">Đăng ký</router-link></span
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

const router = useRouter()

const handleLogin = async (e) => {
  e.preventDefault()

  emailError.value = ''
  passwordError.value = ''
  errorMessage.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value) {
    emailError.value = 'Vui lòng nhập email'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Email không hợp lệ'
  }

  if (!password.value) {
    passwordError.value = 'Vui lòng nhập mật khẩu'
  }

  if (emailError.value || passwordError.value) return

  try {
    const res = await axios.post(`${rootAPI}/auth/login`, {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })

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
    if (error.response && error.response.status === 403) {
      errorMessage.value = 'Tài khoản hoặc mật khẩu không đúng.'
    } else {
      errorMessage.value = 'Đã xảy ra lỗi, vui lòng thử lại.'
    }
  }
}

const loginWithGoogle = async () => {
  try {
    const res = await axios.get(`${rootAPI}/auth/social-login`);

    window.location.href = res.data.data;

  } catch (error) {
    console.error('Error during Google login:', error);
    errorMessage.value = 'Đăng nhập với Google không thành công, vui lòng thử lại.';
  }
}

</script>