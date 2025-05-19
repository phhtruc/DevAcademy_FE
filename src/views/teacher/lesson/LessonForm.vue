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
              <label for="title">Tiêu đề</label>
              <input
                id="title"
                v-model="lesson.name"
                placeholder="Nhập tiêu đề"
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
                  </select>
                  <div class="invalid-feedback" v-if="errors.type">{{ errors.type }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="d-block">Trạng thái</label>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="active"
                      name="status"
                      :value="true"
                      v-model="lesson.isPublic"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="active">Học thử</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="inactive"
                      name="status"
                      :value="false"
                      v-model="lesson.isPublic"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="inactive">Khoá</label>
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
                :disabled="lesson.type == 'EXERCISES'"
              />
              <div class="invalid-feedback" v-if="errors.videoUrl">{{ errors.videoUrl }}</div>
            </div>
            <!-- <div class="col-md-12 mt-3">
              <iframe
                class=""
                :class="{ 'd-none': lesson.videoUrl.trim().length < 1 }"
                width="100%"
                height="300"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div> -->
            <div class="form-group">
              <label class="d-block">Hoặc tải lên video tại đây</label>
              <file-pond
                name="attachments"
                label-idle="Kéo thả hoặc chọn tệp đính kèm"
                allow-multiple="true"
                accepted-file-types="
                  application/pdf,
                  application/msword,
                  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                  application/zip,
                  video/mp4,
                  video/x-msvideo,
                  video/x-matroska,
                  video/quicktime"
                :files="filePondFiles"
                @updatefiles="handleUpload"
              />
              <div class="invalid-feedback" v-if="errors.videoUrl">{{ errors.videoUrl }}</div>
            </div>
            <div class="form-group">
              <video
                v-if="isUpdate"
                :src="decodeURIComponent(lesson.videoUrl)"
                controls
                width="70%"
                height="300px"
                class="video-player"
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
            <div class="form-group">
              <label for="content">Nội dung bài học</label>
              <ToastEditorComponent v-model="lesson.content" :key="editorKey" />
              <div class="invalid-feedback" v-if="errors.content">{{ errors.content }}</div>
            </div>
            <div class="form-group">
              <label for="contentRefer">Tài liệu tham khảo</label>
              <ToastEditorComponent v-model="lesson.contentRefer" :key="editorKey"/>
              <div class="invalid-feedback" v-if="errors.contentRefer">
                {{ errors.contentRefer }}
              </div>
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
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'
import useWebSocket from '@/composables/useWebSocket'
import ToastEditorComponent from '@/components/ToastEditorComponent.vue'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const route = useRoute()
const idCourse = route.params.idCourse
const idChapter = route.params.idChapter
const idLesson = route.params.idLesson
const isLoading = ref(false)
const isUpdate = ref(false)
const filePondFiles = ref([])
let toastId = null
const linkYoutubeEmbed = 'https://www.youtube.com/embed/'

const editorKey = ref(0)

const lesson = ref({
  name: '',
  type: '',
  lessonOrder: '',
  content: '',
  videoUrl: '',
  isPublic: false,
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

// function renderVideo(UrlYoutube) {
//   let idVideoYoutube = UrlYoutube.substring(UrlYoutube.indexOf('=') + 1, UrlYoutube.length)
//   return linkYoutubeEmbed + idVideoYoutube
// }

const getLessonTypeName = (type) => {
  switch (type) {
    case 'LECTURES':
      return 'Bài giảng'
    case 'READINGS':
      return 'Bài đọc'
    case 'EXERCISES':
      return 'Bài tập'
    default:
      return ''
  }
}

// Xử lý upload file bằng FilePond
const FilePond = vueFilePond(FilePondPluginFileValidateType)

const handleUpload = (fileItems) => {
  lesson.value.files = fileItems.map((fileItem) => fileItem.file) || []
}

const validateForm = () => {
  let isValid = true

  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = ''
  })

  if (!lesson.value.name.trim()) {
    errors.value.name = 'Tên bài học không được để trống'
    isValid = false
  }

  if (!lesson.value.type) {
    errors.value.type = 'Loại bài học không được để trống'
    isValid = false
  }

  if (!lesson.value.content.trim()) {
    errors.value.content = 'Nội dung bài học không được để trống'
    isValid = false
  }

  if (
    lesson.value.type === 'LECTURES' &&
    !lesson.value.videoUrl.trim() &&
    !lesson.value.files.length
  ) {
    errors.value.videoUrl = 'Vui lòng thêm url video hoặc tải lên video'
    isValid = false
  }

  return isValid
}
// WebSocket integration
const { isConnected, subscribe } = useWebSocket()

const updateLessonStatus = (status) => {
  if (!toastId) {
    toastId = toast(`⏳ Video ${getLessonTypeName(lesson.value.type)} đang chờ xử lý...`, {
      type: 'default',
      autoClose: false,
      position: 'top-right',
      closeOnClick: true,
      isLoading: true,
      pauseOnFocusLoss: false,
      style: {
        color: '#92400e',
        borderRadius: '12px',
      },
    })
  }

  if (status === 'PROCESSING') {
    toast.update(toastId, {
      render: `🔄 Video ${getLessonTypeName(lesson.value.type)} đang được xử lý...`,
      type: 'info',
      isLoading: true,
      autoClose: false,
      pauseOnFocusLoss: false,
      style: {
        color: '#0369a1',
      },
    })
  } else if (status === 'DONE') {
    toast.update(toastId, {
      render: '✅ Đã hoàn tất!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
      pauseOnFocusLoss: false,
      style: {
        color: '#047857',
      },
    })
    toastId = null
  }
}

const addLesson = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  let response = null

  try {
    const formData = new FormData()

    formData.append('name', lesson.value.name)
    formData.append('type', lesson.value.type)
    formData.append('content', lesson.value.content)
    formData.append('videoUrl', lesson.value.videoUrl || '')
    formData.append('contentRefer', lesson.value.contentRefer || '')
    formData.append('chapterId', idChapter)
    formData.append('isPublic', lesson.value.isPublic)

    if (lesson.value.files.length > 0) {
      lesson.value.files.forEach((file) => {
        formData.append('files', file)
      })
    }

    if (isUpdate.value) {
      response = await axios.put(`${rootAPI}/lessons/${idLesson}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Cập nhật bài học thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
      setTimeout(() => {
      router.push(`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons`)
    }, 1100)
    } else {
      response = await axios.post(`${rootAPI}/lessons`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      Object.keys(lesson.value).forEach((key) => {
        lesson.value[key] = ''
      })
      filePondFiles.value = []
      lesson.value.isPublic = false
      toast.success('Quá trình thêm đang được hoàn tất', {
        position: 'top-right',
        autoClose: 2000,
      })
    }
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
    lesson.value.content = lessonData.content || ''
    lesson.value.contentRefer = lessonData.contentRefer || ''
    lesson.value.videoUrl = lessonData.videoUrl || ''
    lesson.value.isPublic = Boolean(lessonData.isPublic)
    editorKey.value++
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
  if (idLesson) {
    isUpdate.value = true
    await fetchLesson(idLesson)
  }

  subscribe('/topic/progress', (message) => {
    updateLessonStatus(message.status)
    console.log('Received message:', message)
  })
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