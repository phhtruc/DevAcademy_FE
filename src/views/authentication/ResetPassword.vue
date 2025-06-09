<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const route = useRoute()
const router = useRouter()

const token = route.params.token
const isValidToken = ref(true)
const isLoading = ref(false)
const isSubmitting = ref(false)

const password = ref('')
const confirmPassword = ref('')
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const errors = ref({
  password: '',
  confirmPassword: '',
})

onMounted(async () => {
  try {
    await axios.get(`${rootAPI}/auth/verify-token/${token}`)
    isLoading.value = false
  } catch (error) {
    console.error('Invalid or expired token:', error)
    isValidToken.value = false
    isLoading.value = false
    toast.error('Liên kết đã hết hạn hoặc không hợp lệ!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
})

const validateForm = () => {
  let isValid = true
  errors.value = {
    password: '',
    confirmPassword: '',
  }

  if (!password.value) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (password.value.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    isValid = false
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await axios.post(`${rootAPI}/auth/reset-password`, {
      token: token,
      password: password.value,
    })

    toast.success('Đặt mật khẩu thành công!', {
      position: 'top-right',
      autoClose: 3000,
    })

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('Error creating password:', error)
    toast.error('Có lỗi xảy ra khi đặt mật khẩu. Vui lòng thử lại sau!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <img src="@/assets/images/logo-name.jpg" alt="Logo" />
        </div>

        <h2 class="auth-title">Tạo mật khẩu mới</h2>

        <div v-if="isLoading" class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="!isValidToken" class="error-container">
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle mr-2"></i>
            Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng liên hệ với quản trị viên để được hỗ
            trợ.
          </div>
          <button class="btn btn-primary" @click="router.push('/auth/login')">
            Quay lại đăng nhập
          </button>
        </div>

        <form v-else @submit.prevent="submitForm" class="auth-form">
          <p class="form-description">
            Hãy tạo mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất 8 ký tự.
          </p>

          <div class="form-group">
            <label for="password">Mật khẩu mới</label>
            <div class="password-input-container">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Nhập mật khẩu mới"
              />
              <button type="button" class="password-toggle" @click="togglePasswordVisibility">
                <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Xác nhận mật khẩu</label>
            <div class="password-input-container">
              <input
                :type="confirmPasswordVisible ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                placeholder="Xác nhận mật khẩu mới"
              />
              <button
                type="button"
                class="password-toggle"
                @click="toggleConfirmPasswordVisibility"
              >
                <i :class="confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm mr-2"
              role="status"
            ></span>
            {{ isSubmitting ? 'Đang xử lý...' : 'Xác nhận' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.auth-logo {
  text-align: center;
  margin-bottom: 20px;
}

.auth-logo img {
  max-height: 60px;
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-description {
  text-align: center;
  margin-bottom: 25px;
  color: #6c757d;
}

.auth-form .form-group {
  margin-bottom: 20px;
}

.auth-form label {
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
}

.btn-block {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.error-container {
  text-align: center;
}

.error-container .btn {
  margin-top: 15px;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
</style>