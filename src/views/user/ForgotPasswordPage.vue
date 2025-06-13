<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2 class="title">Quên mật khẩu</h2>
      <p class="subtitle">Vui lòng nhập địa chỉ email của bạn để yêu cầu đặt lại mật khẩu</p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Nhập địa chỉ email"
            :class="{ 'input-error': errors.email }"
            @input="errors.email = ''"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting"> <i class="fas fa-spinner fa-spin"></i> Đang xử lý... </span>
          <span v-else>Gửi yêu cầu</span>
        </button>
      </form>

      <div class="back-to-login">
        <router-link to="/login">Quay lại trang đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API

const router = useRouter()
const email = ref('')
const errors = ref({
  email: '',
})
const isSubmitting = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = {
    email: '',
  }

  // Validate email
  if (!email.value.trim()) {
    errors.value.email = 'Vui lòng nhập địa chỉ email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Địa chỉ email không hợp lệ'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await axios.post(`${rootAPI}/auth/forgot-password?email=${encodeURIComponent(email.value)}`)

    window.toast.success('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn!', {
      position: 'top-right',
      autoClose: 5000,
    })

    email.value = ''
  } catch (error) {
    console.error('Error requesting password reset:', error)
    window.toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
  
  <style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
  background-color: #f5f5f5;
  overflow: hidden;
}

.forgot-password-card {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0; /* Ensure no margin causes overflow */
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.input-error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.back-to-login {
  margin-top: 20px;
  text-align: center;
}

.back-to-login a {
  color: #2196f3;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style>