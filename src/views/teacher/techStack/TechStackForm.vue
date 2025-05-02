<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">
              {{ isUpdate ? 'Cập nhật Công nghê' : 'Thêm mới Công nghệ' }}
            </h4>
          </div>
        </div>
        <div class="iq-card-body">
          <form @submit.prevent="saveTechStack">
            <div class="form-group">
              <label for="name">Tên Công nghệ</label>
              <input
                id="name"
                v-model="techStack.name"
                placeholder="Nhập tên Công nghệ"
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
import axios from 'axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const route = useRoute()
const idTechStack = route.params.idTechStack
const isLoading = ref(false)
const isUpdate = ref(false)

const techStack = ref({
  name: '',
})

const errors = ref({
  name: '',
})

const validateForm = () => {
  let isValid = true
  errors.value.name = ''

  if (!techStack.value.name.trim()) {
    errors.value.name = 'Tên Công nghệ không được để trống'
    isValid = false
  }

  return isValid
}

const saveTechStack = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    if (isUpdate.value) {
      await axios.patch(`${rootAPI}/tech-stacks/${idTechStack}`, techStack.value)
      toast.success('Cập nhật Công nghệ thành công', {
        position: 'top-right',
        autoClose: 2000,
      })
    } else {
      await axios.post(`${rootAPI}/tech-stacks`, techStack.value)
      toast.success('Thêm Công nghệ thành công', {
        position: 'top-right',
        autoClose: 2000,
      })
      techStack.value.name = ''
    }
    setTimeout(() => {
      router.push('/teacher/tech-stacks')
    }, 2000)
  } catch (error) {
    toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu'), {
      position: 'top-right',
      autoClose: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

const fetchTechStack = async () => {
  try {
    const response = await axios.get(`${rootAPI}/tech-stacks/${idTechStack}`)
    techStack.value.name = response.data.data.name
  } catch (error) {
    toast.error('Không thể tải thông tin Tech Stack', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

const cancel = () => {
  router.push('/teacher/tech-stacks')
}
const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  if (idTechStack) {
    isUpdate.value = true
    await fetchTechStack()
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