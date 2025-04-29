<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">{{ isUpdate ? 'Cập nhật bài học' : 'Thêm mới bài học' }}</h4>
          </div>
        </div>
        <div class="iq-card-body">
          <form @submit.prevent="addLesson">
            <div class="form-group">
              <label for="title">Tên bài học</label>
              <input
                id="title"
                v-model="lesson.name"
                placeholder="Nhập tên bài học"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />
              <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="lessonType">Loại bài học</label>
                  <select
                    id="lessonType"
                    v-model="lesson.type"
                    class="form-control"
                    :class="{ 'is-invalid': errors.type }"
                  >
                    <option value="">Chọn loại bài học</option>
                    <option value="LECTURES">Bài giảng</option>
                    <option value="READINGS">Bài đọc</option>
                    <option value="EXERCISES">Bài tập</option>
                    <option value="QUIZ">Trắc nghiệm</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.type">{{ errors.type }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="order">Thứ tự bài học</label>
                  <input
                    type="number"
                    min="1"
                    id="order"
                    v-model="lesson.lessonOrder"
                    placeholder="Nhập thứ tự bài học"
                    class="form-control"
                    :class="{ 'is-invalid': errors.lessonOrder }"
                  />
                  <div class="invalid-feedback" v-if="errors.lessonOrder">
                    {{ errors.lessonOrder }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="videoUrl">URL Video (nếu có)</label>
              <input
                id="videoUrl"
                v-model="lesson.videoUrl"
                placeholder="Nhập URL video"
                class="form-control"
                :class="{ 'is-invalid': errors.videoUrl }"
              />
              <div class="invalid-feedback" v-if="errors.videoUrl">{{ errors.videoUrl }}</div>
            </div>

            <div class="form-group">
              <label for="content">Nội dung bài học</label>
              <textarea
                id="content"
                v-model="lesson.content"
                placeholder="Nhập nội dung bài học"
                class="form-control"
                rows="5"
                :class="{ 'is-invalid': errors.content }"
              ></textarea>
              <div class="invalid-feedback" v-if="errors.content">{{ errors.content }}</div>
            </div>

            <div class="form-group">
              <label for="contentRefer">Tài liệu tham khảo</label>
              <textarea
                id="contentRefer"
                v-model="lesson.contentRefer"
                placeholder="Nhập tài liệu tham khảo"
                class="form-control"
                rows="3"
                :class="{ 'is-invalid': errors.contentRefer }"
              ></textarea>
              <div class="invalid-feedback" v-if="errors.contentRefer">
                {{ errors.contentRefer }}
              </div>
            </div>

            <div class="form-group">
              <label class="d-block">Tài liệu đính kèm (nếu có)</label>
              <file-pond
                name="attachments"
                label-idle="Kéo thả hoặc chọn tệp đính kèm"
                allow-multiple="true"
                accepted-file-types="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
                :files="filePondFiles"
                @updatefiles="handleUpload"
              />
              <small class="form-text text-muted">Hỗ trợ các định dạng: PDF, DOC, DOCX, ZIP</small>
              <div class="text-danger" v-if="errors.files">{{ errors.files }}</div>
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
import { onMounted, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const route = useRoute()
const idCourse = route.params.idCourse
const idChapter = route.params.idChapter
const isLoading = ref(false)
const isUpdate = ref(false)
const filePondFiles = ref([])

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
})

const lesson = ref({
  name: '',
  type: '',
  lessonOrder: '',
  content: '',
  videoUrl: '',
  contentRefer: '',
  files: [],
})

const errors = ref({
  name: '',
  type: '',
  lessonOrder: '',
  content: '',
  videoUrl: '',
  contentRefer: '',
  files: '',
})

// Xử lý upload file bằng FilePond
const FilePond = vueFilePond(FilePondPluginFileValidateType)

const handleUpload = (fileItems) => {
  lesson.value.files = fileItems.map((fileItem) => fileItem.file) || []
}

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = ''
  })

  // Validate name
  if (!lesson.value.name.trim()) {
    errors.value.name = 'Tên bài học không được để trống'
    isValid = false
  }

  // Validate type
  if (!lesson.value.type) {
    errors.value.type = 'Loại bài học không được để trống'
    isValid = false
  }

  // Validate lesson order
  if (!lesson.value.lessonOrder) {
    errors.value.lessonOrder = 'Thứ tự bài học không được để trống'
    isValid = false
  } else if (!/^\d+$/.test(lesson.value.lessonOrder)) {
    errors.value.lessonOrder = 'Thứ tự bài học phải là số'
    isValid = false
  }

  // Validate content
  if (!lesson.value.content.trim()) {
    errors.value.content = 'Nội dung bài học không được để trống'
    isValid = false
  }

  // Validate videoUrl for LECTURES type
  if (lesson.value.type === 'LECTURES' && !lesson.value.videoUrl.trim()) {
    errors.value.videoUrl = 'URL video không được để trống cho loại bài giảng'
    isValid = false
  }

  return isValid
}

const addLesson = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()

    formData.append('name', lesson.value.name)
    formData.append('type', lesson.value.type)
    formData.append('lessonOrder', lesson.value.lessonOrder)
    formData.append('content', lesson.value.content)
    formData.append('videoUrl', lesson.value.videoUrl || '')
    formData.append('contentRefer', lesson.value.contentRefer || '')

    // Append files if any
    if (lesson.value.files.length > 0) {
      lesson.value.files.forEach((file) => {
        formData.append('files', file)
      })
    }

    if (isUpdate.value) {
      await axios.put(`${rootAPI}/lessons/${props.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Cập nhật bài học thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    } else {
      await axios.post(`${rootAPI}/chapters/${idChapter}/lessons`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Thêm bài học thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    }

    setTimeout(() => {
      router.push(`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons`)
    }, 1100)
  } catch (error) {
    toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu'), {
      position: 'top-right',
      autoClose: 3000,
    })
    console.error('Error creating/updating lesson:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchLesson = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/lessons/${id}`)
    const lessonData = response.data.data

    lesson.value.name = lessonData.name
    lesson.value.type = lessonData.type
    lesson.value.lessonOrder = lessonData.lessonOrder
    lesson.value.content = lessonData.content
    lesson.value.videoUrl = lessonData.videoUrl || ''
    lesson.value.contentRefer = lessonData.contentRefer || ''

    // Handle attached files if any
    if (lessonData.attachments && lessonData.attachments.length > 0) {
      filePondFiles.value = lessonData.attachments.map((attachment) => ({
        source: attachment.url,
        options: { type: 'remote' },
      }))
    }
  } catch (error) {
    console.error('Error fetching lesson:', error)
    toast.error('Không thể tải thông tin bài học', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

const cancel = () => {
  router.push(`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons`)
}

const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  if (props.id) {
    isUpdate.value = true
    await fetchLesson(props.id)
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