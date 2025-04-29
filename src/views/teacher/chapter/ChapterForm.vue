<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">{{ isUpdate ? 'Cập nhật chương' : 'Thêm mới chương' }}</h4>
          </div>
        </div>
        <div class="iq-card-body">
          <form @submit.prevent="addChapter">
            <div class="form-group">
              <label for="title">Tên chương</label>
              <input
                id="title"
                v-model="chapter.name"
                placeholder="Nhập tên chương"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />
              <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
            </div>

            <div class="form-group">
              <label class="d-block">Trạng thái</label>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="active"
                  name="status"
                  value="true"
                  v-model="chapter.isPublic"
                  class="custom-control-input"
                />
                <label class="custom-control-label" for="active">Học thử</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  value="false"
                  v-model="chapter.isPublic"
                  class="custom-control-input"
                />
                <label class="custom-control-label" for="inactive">Khoá</label>
              </div>
            </div>

            <div class="text-right">
              <button class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>{{ isUpdate ? 'Cập nhật' : 'Lưu' }}</span>
              </button>
              <button type="button" class="btn iq-bg-danger ml-2" @click="goBack">Hủy</button>
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
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const isLoading = ref(false)
const isUpdate = ref(false)

const props = defineProps({
  idCourse: {
    type: String,
    required: false,
  },
  idChapter: {
    type: String,
    required: false,
  },
})

const chapter = ref({
  name: '',
  isPublic: true,
  courseId: props.idCourse,
})

const errors = ref({
  name: '',
})

const validateForm = () => {
  let isValid = true

  errors.value.name = ''

  if (!chapter.value.name.trim()) {
    errors.value.name = 'Tên chương không được để trống'
    isValid = false
  }

  return isValid
}

const addChapter = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    if (isUpdate.value) {
      await axios.put(`${rootAPI}/chapters/${props.idChapter}`, {
        name: chapter.value.name,
        isPublic: chapter.value.isPublic === 'true' || chapter.value.isPublic === true,
        courseId: props.idCourse,
      })

      toast.success('Cập nhật thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    } else {
      await axios.post(`${rootAPI}/chapters`, {
        name: chapter.value.name,
        isPublic: chapter.value.isPublic === 'true' || chapter.value.isPublic === true,
        courseId: props.idCourse,
      })

      toast.success('Thêm chương thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    }
    setTimeout(() => {
      router.push(`/teacher/courses/${props.idCourse}/chapters`)
    }, 1100)
  } catch (error) {
    toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu'), {
      position: 'top-right',
      autoClose: 3000,
    })
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchChapter = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/chapters/${id}`)
    const data = response.data.data

    chapter.value.name = data.name
    chapter.value.isPublic = data.isPublic
    chapter.value.courseId = data.courseId || courseId
  } catch (error) {
    console.error('Error fetching chapter:', error)
    toast.error('Không thể tải dữ liệu chương', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

const cancel = () => {
  router.push(`/course?idCourse=${courseId}`)
}

const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  if (props.idChapter) {
    isUpdate.value = true
    await fetchChapter(props.idChapter)
  }
})
</script>
  
  <style scoped>
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