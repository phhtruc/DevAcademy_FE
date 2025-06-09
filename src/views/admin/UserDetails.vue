<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API;
const router = useRouter()
const route = useRoute()

// Lấy id từ route params
const userId = route.params.idUser
const isLoading = ref(true)
const error = ref(null)

// Thông tin user
const user = ref({
  fullName: '',
  email: '',
  roles: '',
  status: '',
  avatar: null,
  createdAt: '',
  updatedAt: '',
  lastLogin: null
})

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Trạng thái người dùng
const getUserStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'badge-success'
    case 'INACTIVE':
      return 'badge-danger'
    default:
      return 'badge-secondary'
  }
}

// Vai trò người dùng
const getUserRoleLabel = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên'
    case 'TEACHER':
      return 'Giảng viên'
    case 'USER':
      return 'Học viên'
    default:
      return 'Người dùng'
  }
}

// Lấy thông tin user từ API
const fetchUserDetails = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${rootAPI}/users/${userId}`)
    user.value = response.data.data
  } catch (err) {
    console.error('Error fetching user details:', err)
    error.value = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
    toast.error('Không thể tải thông tin người dùng', {
      position: 'top-right',
      autoClose: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

// Quay lại trang danh sách
const goBack = () => {
  router.go(-1)
}

onMounted(fetchUserDetails)
</script>

<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="row">
        <div class="col-sm-12">
          <div class="iq-card">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">Thông tin người dùng</h4>
              </div>
              <div></div>
            </div>
            <div class="iq-card-body">
              <div v-if="isLoading">
                <Spinner />
              </div>
              <div v-else-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              <div v-else class="user-details">
                <div class="row">
                  <div class="col-md-4 text-center mb-4">
                    <div class="avatar-container">
                      <img
                        v-if="user.avatar"
                        :src="user.avatar"
                        alt="User avatar"
                        class="user-avatar"
                      />
                      <div v-else class="user-avatar default-avatar">
                        {{ user.fullName.charAt(0).toUpperCase() }}
                      </div>
                    </div>

                    <h4 class="mt-3">{{ user.fullName }}</h4>
                    <span class="badge" :class="getUserStatusClass(user.status)">
                      {{ user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động' }}
                    </span>
                    <div class="mt-3">
                      <span class="badge badge-primary p-2">
                        {{ getUserRoleLabel(user.roles) }}
                      </span>
                    </div>
                  </div>

                  <div class="col-md-8">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <tbody>
                          <tr>
                            <th>ID người dùng</th>
                            <td>{{ user.id }}</td>
                          </tr>
                          <tr>
                            <th>Họ tên</th>
                            <td>{{ user.fullName }}</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>{{ user.email }}</td>
                          </tr>
                          <tr>
                            <th>Vai trò</th>
                            <td>{{ getUserRoleLabel(user.roles) }}</td>
                          </tr>
                          <tr>
                            <th>Trạng thái</th>
                            <td>
                              <span class="badge" :class="getUserStatusClass(user.status)">
                                {{ user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động' }}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Ngày tạo</th>
                            <td>{{ formatDate(user.createdAt) }}</td>
                          </tr>
                          <tr>
                            <th>Cập nhật lần cuối</th>
                            <td>{{ formatDate(user.updatedAt) }}</td>
                          </tr>
                          <tr>
                            <th>Đăng nhập lần cuối</th>
                            <td>
                              {{ user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập' }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.default-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #3f4eae;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  display: flex;
  justify-content: center;
}

.badge {
  font-size: 85%;
  padding: 0.35em 0.65em;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.badge-primary {
  background-color: #3f4eae;
  color: white;
}

table th {
  width: 200px;
  font-weight: 600;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>