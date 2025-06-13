<template>
  <div class="profile-container">
    <div class="container py-4">
      <div class="row">
        <!-- Profile Card -->
        <div class="col-lg-4">
          <div class="card mb-4 profile-card">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4>Thông tin cá nhân</h4>
              </div>
            </div>
            <div class="card-body">
              <div class="form-group d-flex flex-column align-items-center">
                <div class="add-img-user profile-img-edit text-center mb-3">
                  <img
                    class="profile-pic img-fluid rounded-circle"
                    :src="profileForm.avatar || defaultAvatar"
                    alt="avatar"
                  />
                </div>

                <label for="avatarUpload" class="upload-button btn btn-outline-primary mb-3">
                  <i class="fa fa-pen"></i> Tải lên
                </label>
                <input
                  id="avatarUpload"
                  class="file-upload"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  hidden
                />

                <button @click="showPasswordModal = true" class="btn btn-primary">
                  <i class="fas fa-key me-2"></i>Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          <div class="card mb-4 mb-lg-0">
            <div class="card-body p-0">
              <ul class="list-group list-group-flush rounded-3">
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fas fa-calendar-alt fa-lg text-warning"></i>
                  <p class="mb-0">Ngày tham gia: {{ formatDate(createdDate) }}</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fas fa-book-open fa-lg text-primary"></i>
                  <p class="mb-0">Khóa học đã tham gia: {{ totalCourses || 0 }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="iq-card mb-4">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">Cập nhật thông tin</h4>
              </div>
            </div>
            <div class="card-body">
              <div class="new-user-info">
                <form @submit.prevent="updateProfile">
                  <div class="row">
                    <div class="form-group col-md-12 mb-3">
                      <label for="fullName">Họ và tên</label>
                      <input
                        id="fullName"
                        v-model="profileForm.fullName"
                        placeholder="Nhập họ và tên"
                        class="form-control"
                        :class="{ 'is-invalid': errors.fullName }"
                      />
                      <div class="invalid-feedback" v-if="errors.fullName">
                        {{ errors.fullName }}
                      </div>
                    </div>

                    <div class="form-group col-md-12 mb-3">
                      <label for="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        v-model="profileForm.email"
                        placeholder="Nhập email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        disabled
                      />
                      <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                      <small> Email không thể thay đổi </small>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                      <span
                        v-if="isUpdating"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {{ isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Learning Progress Card -->
          <div class="iq-card mb-4">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">Tiến trình học tập</h4>
              </div>
            </div>
            <div class="card-body">
              <div v-if="learningProgress.length > 0">
                <div
                  v-for="(course, index) in learningProgress"
                  :key="index"
                  class="course-progress mb-4"
                >
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0">{{ course.name }}</h6>
                    <span class="text-muted small"
                      >{{ course.completedLessons }}/{{ course.totalLessons }} bài học</span
                    >
                  </div>
                  <div class="progress" style="height: 10px">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{
                        width: (course.completedLessons / course.totalLessons) * 100 + '%',
                      }"
                      :aria-valuenow="course.completedLessons"
                      aria-valuemin="0"
                      :aria-valuemax="course.totalLessons"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-3 text-muted">
                <i class="fas fa-book-reader fa-3x mb-3"></i>
                <p>Bạn chưa tham gia khóa học nào.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <b-modal
      v-model="showPasswordModal"
      title="Đổi mật khẩu"
      ok-title="Xác nhận"
      cancel-title="Hủy"
      :ok-disabled="isChangingPassword || passwordMismatch"
      @ok="changePassword"
    >
      <form>
        <div class="mb-3">
          <label class="form-label">Mật khẩu hiện tại</label>
          <input type="password" class="form-control" v-model="passwordForm.oldPassword" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input type="password" class="form-control" v-model="passwordForm.newPassword" required />
          <!-- <div class="form-text">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
          </div> -->
        </div>
        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            class="form-control"
            v-model="passwordForm.confirmPassword"
            required
          />
          <div v-if="passwordMismatch" class="text-danger mt-1">Mật khẩu nhập lại không khớp</div>
        </div>
      </form>
      <template #modal-footer="{ ok, cancel }">
        <button class="btn btn-secondary" @click="cancel()">Hủy</button>
        <button
          class="btn btn-primary"
          @click="ok()"
          :disabled="isChangingPassword || passwordMismatch"
        >
          <span
            v-if="isChangingPassword"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isChangingPassword ? 'Đang xử lý...' : 'Xác nhận' }}
        </button>
      </template>
    </b-modal>
  </div>
</template>
    
  <script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'
import defaultAvatar from '@/assets/images/user/11.png'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const router = useRouter()
const authStore = useAuthStore()

const user = ref({
  id: '',
  fullName: '',
  avatar: '',
  status: '',
  roles: '',
  email: '',
})

const profileForm = reactive({
  fullName: '',
  email: '',
  avatar: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = ref({
  fullName: '',
  email: '',
})

const isUpdating = ref(false)
const isChangingPassword = ref(false)
const showPasswordModal = ref(false)
const learningProgress = ref([])
const avatarFile = ref(null)
const totalCourses = ref(0)
const createdDate = ref('')

const passwordMismatch = computed(() => {
  return (
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword !== passwordForm.confirmPassword
  )
})

const validateForm = () => {
  let isValid = true
  errors.value.fullName = ''
  errors.value.email = ''

  if (!profileForm.fullName.trim()) {
    errors.value.fullName = 'Họ và tên không được để trống'
    isValid = false
  }

  if (!profileForm.email.trim()) {
    errors.value.email = 'Email không được để trống'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }

  return isValid
}

const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${rootAPI}/users/profile`)
    user.value = response.data.data

    totalCourses.value = user.value.totalCourses || 0
    createdDate.value = user.value.createdDate || ''

    profileForm.fullName = user.value.fullName
    profileForm.email = user.value.email
    profileForm.avatar = user.value.avatar

    fetchLearningProgress()
  } catch (error) {
    console.error('Error fetching user profile:', error)
    toast.error('Không thể tải thông tin người dùng', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

const fetchLearningProgress = async () => {
  try {
    const response = await axios.get(`${rootAPI}/users/learning-progress`)
    learningProgress.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching learning progress:', error)
  }
}

const updateProfile = async () => {
  if (!validateForm()) {
    return
  }

  isUpdating.value = true

  try {
    const formData = new FormData()
    formData.append('fullName', profileForm.fullName)
    formData.append('email', profileForm.email)

    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }

    const response = await axios.put(`${rootAPI}/users/${user.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    user.value = response.data.data
    toast.success('Cập nhật thông tin thành công', {
      position: 'top-right',
      autoClose: 3000,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error(
      'Không thể cập nhật thông tin: ' + (error.response?.data?.message || 'Lỗi không xác định'),
      {
        position: 'top-right',
        autoClose: 3000,
      }
    )
  } finally {
    isUpdating.value = false
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    profileForm.avatar = URL.createObjectURL(file)
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    return
  }

  isChangingPassword.value = true

  try {
    await axios.patch(`${rootAPI}/auth/change-password`, {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })

    logout()

    window.toast.success('Đổi mật khẩu thành công, Mời đăng nhập lại ', {
      position: 'top-right',
      autoClose: 3000,
    })
  } catch (error) {
    console.error('Error changing password:', error)
    toast.error(
      'Không thể đổi mật khẩu: ' + (error.response?.data?.message || 'Lỗi không xác định'),
      {
        position: 'top-right',
        autoClose: 3000,
      }
    )
  } finally {
    isChangingPassword.value = false
  }
}

const logout = () => {
  authStore.logout()
}

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchUserProfile()
})
</script>
    
  <style scoped>
.profile-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.profile-card,
.iq-card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* upload avatar*/
.add-img-user {
  position: relative;
  text-align: center;
  margin: 0 auto 1rem;
  width: 150px;
}

.profile-pic {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.p-image {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  width: 100%;
}

.upload-button {
  font-size: 0.85rem;
  padding: 0.375rem 0.75rem;
  border-radius: 30px;
  background-color: #fff;
  border: 1px solid #007bff;
  color: #007bff;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background-color: #007bff;
  color: #fff;
}

.file-upload {
  display: none;
}

.img-extension a {
  color: #007bff;
  margin: 0 3px;
  text-decoration: none;
}

/* Style cho status indicator */
.status-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #dc3545;
  border: 3px solid #fff;
}

.status-active {
  background-color: #28a745;
}

/* Style cho progress bar */
.progress-bar {
  background-color: #007bff;
  transition: width 0.6s ease;
}

.course-progress h6 {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-pic {
    width: 120px;
    height: 120px;
  }
}

/* Card header styling */
.iq-card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  padding: 1rem;
}

.iq-header-title {
  margin-bottom: 0;
}

/* Form styling */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 500;
}
</style>