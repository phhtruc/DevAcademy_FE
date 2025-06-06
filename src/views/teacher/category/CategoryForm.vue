<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">{{ isUpdate ? 'Cập nhật danh mục' : 'Thêm mới danh mục' }}</h4>
          </div>
        </div>
        <div class="iq-card-body">
          <form @submit.prevent="saveCategory">
            <div class="form-group">
              <label for="name">Tên danh mục</label>
              <input
                id="name"
                v-model="category.name"
                placeholder="Nhập tên danh mục"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />
              <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
            </div>
            <div class="text-right">
              <button class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>{{ isUpdate ? 'Cập nhật' : 'Lưu' }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = window.runtime_config.VITE_APP_ROOT_API || import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const route = useRoute()
const idCategory = route.params.idCategory
const isLoading = ref(false)
const isUpdate = ref(false)

const category = ref({
  name: '',
})

const errors = ref({
  name: '',
})

// Hàm validate form
const validateForm = () => {
  let isValid = true
  errors.value.name = ''

  if (!category.value.name.trim()) {
    errors.value.name = 'Tên danh mục không được để trống'
    isValid = false
  }

  return isValid
}

// Hàm lưu danh mục (thêm mới hoặc cập nhật)
const saveCategory = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    if (isUpdate.value) {
      // Cập nhật danh mục
      await axios.patch(`${rootAPI}/categories/${idCategory}`, category.value)
      toast.success('Cập nhật danh mục thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    } else {
      // Thêm mới danh mục
      await axios.post(`${rootAPI}/categories`, category.value)
      toast.success('Thêm danh mục thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
      category.value.name = '' // Reset form sau khi thêm mới
    }
    router.push('/categories') // Quay lại danh sách danh mục
  } catch (error) {
    toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu'), {
      position: 'top-right',
      autoClose: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

// Hàm lấy thông tin danh mục (khi cập nhật)
const fetchCategory = async () => {
  try {
    const response = await axios.get(`${rootAPI}/categories/${idCategory}`)
    category.value.name = response.data.data.name
  } catch (error) {
    toast.error('Không thể tải thông tin danh mục', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

// Hàm hủy và quay lại danh sách
const cancel = () => {
  router.push('/categories')
}

// Hàm quay lại trang trước
const goBack = () => {
  router.go(-1)
}

// Khi component được mount
onMounted(async () => {
  if (idCategory) {
    isUpdate.value = true
    await fetchCategory()
  }
})
</script>
  
  <style scoped>
.iq-card {
  margin-bottom: 30px;
}
.is-invalid {
  border-color: #dc3545;
}
.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
</style>