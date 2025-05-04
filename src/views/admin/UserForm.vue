<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">
              {{ isUpdate ? 'Cập nhật người dùng' : 'Thêm mới người dùng' }}
            </h4>
          </div>
        </div>
        <div class="iq-card-body">
          <form @submit.prevent="addUser">
            <div class="form-group">
              <label for="fullName">Họ và tên</label>
              <input
                id="fullName"
                v-model="user.fullName"
                placeholder="Nhập họ và tên"
                class="form-control"
                :class="{ 'is-invalid': errors.fullName }"
              />
              <div class="invalid-feedback" v-if="errors.fullName">{{ errors.fullName }}</div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                v-model="user.email"
                placeholder="Nhập email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
              />
              <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
            </div>

            <!-- Vai trò -->
            <div class="form-group">
              <label for="role">Vai trò</label>
              <select
                id="role"
                v-model="user.role"
                class="form-control"
                :class="{ 'is-invalid': errors.role }"
              >
                <option value="">Chọn vai trò</option>
                <option v-for="(role, index) in roles" :key="index" :value="role">
                  {{ role }}
                </option>
              </select>
              <div class="invalid-feedback" v-if="errors.role">{{ errors.role }}</div>
            </div>

            <div class="text-right">
              <button class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Lưu</span>
              </button>
              <button type="button" class="btn iq-bg-danger ml-2" @click="cancel">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()

const isLoading = ref(false)
const isUpdate = ref(false)

const props = defineProps({
  idUser: {
    type: String,
    required: false,
  },
})

const user = ref({
  fullName: '',
  email: '',
  role: '',
})

const errors = ref({
  fullName: '',
  email: '',
  role: '',
})

const roles = ['Admin', 'Teacher', 'Student'] // Danh sách vai trò

// Hàm validate form
const validateForm = () => {
  let isValid = true

  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = ''
  })

  if (!user.value.fullName.trim()) {
    errors.value.fullName = 'Họ và tên không được để trống'
    isValid = false
  }

  if (!user.value.email.trim()) {
    errors.value.email = 'Email không được để trống'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.value.email)) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }

  if (!user.value.role) {
    errors.value.role = 'Vai trò không được để trống'
    isValid = false
  }

  return isValid
}

// Hàm thêm hoặc cập nhật người dùng
const addUser = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    if (isUpdate.value) {
      // Cập nhật người dùng
      await axios.put(`${rootAPI}/users/${props.idUser}`, user.value)
      toast.success('Cập nhật người dùng thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    } else {
      // Thêm mới người dùng
      await axios.post(`${rootAPI}/users`, user.value)
      toast.success('Thêm người dùng thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    }
    setTimeout(() => {
      router.push('/admin/users')
    }, 1100)
  } catch (error) {
    toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu'), {
      position: 'top-right',
      autoClose: 3000,
    })
    console.error('Error creating/updating user:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchUser = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/users/${id}`)
    user.value = response.data.data
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const cancel = () => {
  router.push('/admin/users')
}

const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  if (props.idUser) {
    isUpdate.value = true
    await fetchUser(props.idUser)
  }
})
</script>