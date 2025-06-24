<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="row">
        <div class="col-lg-3">
          <div class="iq-card">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">
                  {{ isUpdate ? 'Cập nhật người dùng' : 'Thêm mới người dùng' }}
                </h4>
              </div>
            </div>
            <div class="iq-card-body">
              <div class="form-group">
                <div class="add-img-user profile-img-edit">
                  <img
                    class="profile-pic img-fluid"
                    :src="previewAvatar || defaultAvatar"
                    alt="profile-pic"
                  />
                  <div class="p-image">
                    <label for="avatarUpload" class="upload-button btn iq-bg-primary"
                      >Tải lên</label
                    >
                    <input
                      id="avatarUpload"
                      class="file-upload"
                      type="file"
                      accept="image/*"
                      @change="handleAvatarChange"
                      hidden
                    />
                  </div>
                </div>
                <div class="img-extension mt-3">
                  <div class="d-inline-block align-items-center">
                    <span>Chỉ chấp nhận</span>
                    <a href="javascript:void();">.jpg</a>
                    <a href="javascript:void();">.png</a>
                    <a href="javascript:void();">.jpeg</a>
                    <span>định dạng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <div class="iq-card">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">Thông tin tài khoản</h4>
              </div>
            </div>
            <div class="iq-card-body">
              <div class="new-user-info">
                <form @submit.prevent="addUser">
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="fullName">Họ và tên</label>
                      <input
                        id="fullName"
                        v-model="user.fullName"
                        placeholder="Nhập họ và tên"
                        class="form-control"
                        :class="{ 'is-invalid': errors.fullName }"
                      />
                      <div class="invalid-feedback" v-if="errors.fullName">
                        {{ errors.fullName }}
                      </div>
                    </div>
                    <div v-if="isUpdate" class="form-group col-md-6">
                      <label for="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        v-model="user.email"
                        placeholder="Nhập email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        disabled
                      />
                      <span class="form-text text-muted small">
                        Email không thể thay đổi khi cập nhật người dùng</span
                      >
                    </div>
                    <div v-else class="form-group col-md-6">
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
                    <div class="form-group col-md-6">
                      <label for="role">Vai trò</label>
                      <select
                        id="role"
                        v-model="user.roles"
                        class="form-control"
                        :class="{ 'is-invalid': errors.roles }"
                      >
                        <option value="">Chọn vai trò</option>
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="TEACHER">Giảng viên</option>
                        <option value="USER">Học viên</option>
                      </select>
                      <div class="invalid-feedback" v-if="errors.roles">{{ errors.roles }}</div>
                    </div>
                    <div class="form-group col-md-6" v-if="isUpdate">
                      <label for="role">Trạng thái</label>
                      <select
                        id="role"
                        v-model="user.status"
                        class="form-control"
                        :class="{ 'is-invalid': errors.roles }"
                      >
                        <option value="">Trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Bị khoá</option>
                        <option value="PENDING">Đang chờ</option>
                      </select>
                      <div class="invalid-feedback" v-if="errors.roles">{{ errors.roles }}</div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div v-if="isUpdate">
                      <button type="button" class="btn btn-danger" @click="confirmDelete">
                        <i class="ri-delete-bin-line mr-1"></i>
                        Xóa
                      </button>
                    </div>
                    <div v-else></div>
                    <div>
                      <button class="btn btn-primary" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                        <span v-else>{{ isUpdate ? 'Cập nhật' : 'Lưu' }}</span>
                      </button>
                      <button type="button" class="btn iq-bg-danger ml-2" @click="cancel">
                        Hủy
                      </button>
                    </div>
                  </div>
                  <b-modal
                    v-model="isModalVisible"
                    title="Xác nhận xóa"
                    ok-title="Xóa"
                    cancel-title="Đóng"
                    ok-variant="danger"
                    @ok="handleDelete"
                  >
                    <p>Bạn có chắc chắn xóa tài khoản này không?</p>
                  </b-modal>
                </form>
              </div>
            </div>
          </div>
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
import defaultAvatar from '@/assets/images/user/11.png'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const router = useRouter()
const isLoading = ref(false)
const isUpdate = ref(false)
const avatar = ref(null)
const previewAvatar = ref('')
const isModalVisible = ref(false)

const props = defineProps({
  idUser: {
    type: String,
    required: false,
  },
})

const user = ref({
  fullName: '',
  email: '',
  roles: '',
  status: '',
})

const errors = ref({
  fullName: '',
  email: '',
  roles: '',
  status: '',
})

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

  if (!user.value.roles) {
    errors.value.roles = 'Vai trò không được để trống'
    isValid = false
  }

  return isValid
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatar.value = file
    previewAvatar.value = URL.createObjectURL(file)
  }
}

const addUser = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()
    formData.append('fullName', user.value.fullName)
    formData.append('email', user.value.email)

    if (user.value.roles !== 'USER') {
      formData.append('roles', user.value.roles)
    }
    if (avatar.value) {
      formData.append('avatar', avatar.value)
    }

    if (isUpdate.value) {
      formData.append('status', user.value.status)
      await axios.put(`${rootAPI}/users/${props.idUser}`, formData)
      toast.success('Cập nhật người dùng thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    } else {
      await axios.post(`${rootAPI}/users`, formData)
      toast.success('Thêm người dùng thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    }
    setTimeout(() => {
      router.push('/admin/users')
    }, 1100)
  } catch (error) {
    errors.value.email = 'Email đã tồn tại'
    console.error('Error creating/updating user:', error)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = () => {
  isModalVisible.value = true
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/users/${props.idUser}`)
    toast.success('Xóa tài khoản thành công', {
      position: 'top-right',
      autoClose: 1000,
    })
    isModalVisible.value = false
    setTimeout(() => {
      router.push('/admin/users')
    }, 1000)
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Có lỗi xảy ra khi xóa tài khoản', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

const fetchUser = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/users/${id}`)
    const userData = response.data.data

    if (userData.roles) {
      userData.roles = userData.roles.replace(/[\[\]"]/g, '') // Loại bỏ dấu [], và dấu "
    }
    previewAvatar.value = userData.avatar
    user.value = userData
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