<template>
  <section
    class="sign-in-page bg-white d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="container-fluid p-0">
      <div class="row no-gutters justify-content-center">
        <div class="col-sm-6 align-self-center">
          <div class="sign-in-from">
            <h1 class="mb-0">Đăng ký</h1>
            <form class="mt-4" @submit.prevent="handleRegister">
              <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success mt-3 text-center">
                {{ successMessage }}
              </div>
              <div class="form-group">
                <label for="nameInput">
                  Họ và tên
                  <span v-if="nameError" class="text-danger ml-2">{{ nameError }}</span>
                </label>
                <input
                  v-model="fullName"
                  type="text"
                  class="form-control mb-0"
                  id="nameInput"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div class="form-group">
                <label for="emailInput">
                  Email
                  <span v-if="emailError" class="text-danger ml-2">{{ emailError }}</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control mb-0"
                  id="emailInput"
                  placeholder="Nhập email"
                />
              </div>
              <div class="form-group">
                <label for="passwordInput">
                  Mật khẩu
                  <span v-if="passwordError" class="text-danger ml-2">{{ passwordError }}</span>
                </label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control mb-0"
                  id="passwordInput"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div class="d-inline-block w-100">
                <button type="submit" class="btn btn-primary float-right">Đăng ký</button>
              </div>
              <div class="sign-info">
                <div class="mt-0">
                  <button class="btn btn-danger w-100" type="button">Đăng ký với Google</button>
                </div>
                <span class="dark-color d-inline-block line-height-2 mt-3">
                  Bạn đã có tài khoản ?
                  <router-link :to="`/login`">Đăng nhập</router-link>
                </span>
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

const fullName = ref('')
const email = ref('')
const password = ref('')

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const router = useRouter()
const rootAPI = import.meta.env.VITE_APP_ROOT_API

const handleRegister = async () => {
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  errorMessage.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // ✅ Validate
  if (!fullName.value) {
    nameError.value = 'Vui lòng nhập họ và tên'
  }
  if (!email.value) {
    emailError.value = 'Vui lòng nhập email'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Email không hợp lệ'
  }
  if (!password.value) {
    passwordError.value = 'Vui lòng nhập mật khẩu'
  }

  if (nameError.value || emailError.value || passwordError.value) return

  try {
    await axios.post(`${rootAPI}/auth/register`, {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })

    successMessage.value = 'Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    if (err.response && err.response.data?.message) {
      errorMessage.value = 'Email đă được đăng ký'
    } else {
      errorMessage.value = 'Đã xảy ra lỗi, vui lòng thử lại.'
    }
  }
}
</script>
