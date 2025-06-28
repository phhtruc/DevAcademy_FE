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

            <div v-if="lesson.type !== 'EXERCISES'" class="form-group">
              <label>Phương thức thêm video</label>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="videoMethodUrl"
                  name="videoMethod"
                  class="custom-control-input"
                  value="url"
                  v-model="videoMethod"
                />
                <label class="custom-control-label" for="videoMethodUrl">Nhập URL video</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="videoMethodFile"
                  name="videoMethod"
                  class="custom-control-input"
                  value="file"
                  v-model="videoMethod"
                />
                <label class="custom-control-label" for="videoMethodFile">Tải file video</label>
              </div>
            </div>
            <!-- URL Video input - hiển thị khi chọn phương thức URL và không phải là bài tập -->
            <div v-if="lesson.type !== 'EXERCISES' && videoMethod === 'url'" class="form-group">
              <label for="videoUrl">URL Video</label>
              <input
                id="videoUrl"
                v-model="lesson.videoUrl"
                placeholder="Nhập URL video (YouTube, Vimeo,...)"
                class="form-control"
                :class="{ 'is-invalid': errors.videoUrl }"
              />
              <div class="invalid-feedback" v-if="errors.videoUrl">{{ errors.videoUrl }}</div>
              <small class="form-text text-muted">
                Hỗ trợ URL từ YouTube, Vimeo hoặc các nguồn video trực tuyến khác.
              </small>
            </div>

            <!-- File upload - hiển thị khi chọn phương thức tải file và không phải bài tập -->
            <div v-if="lesson.type !== 'EXERCISES' && videoMethod === 'file'" class="form-group">
              <label for="videoFile">Tải file video</label>
              <div class="custom-file">
                <input
                  type="file"
                  class="custom-file-input"
                  id="videoFile"
                  accept="video/*"
                  @change="handleVideoFileUpload"
                  :class="{ 'is-invalid': errors.videoFile }"
                />
                <label class="custom-file-label" for="videoFile">
                  {{ videoFileName || 'Chọn file video...' }}
                </label>
                <div class="invalid-feedback" v-if="errors.videoFile">{{ errors.videoFile }}</div>
              </div>
              <small class="form-text text-muted">
                Hỗ trợ các định dạng: MP4, WebM, Ogg. Kích thước tối đa: 100MB.
              </small>
            </div>

            <div
              v-if="lesson.type !== 'EXERCISES' && lesson.videoUrl && videoMethod === 'url'"
              class="form-group"
            >
              <label>Xem trước video:</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe
                      v-if="isYoutubeUrl(lesson.videoUrl)"
                      class="embed-responsive-item"
                      :src="getYoutubeEmbedUrl(lesson.videoUrl)"
                      allowfullscreen
                    ></iframe>
                    <iframe
                      v-else-if="isVimeoUrl(lesson.videoUrl)"
                      class="embed-responsive-item"
                      :src="getVimeoEmbedUrl(lesson.videoUrl)"
                      allowfullscreen
                    ></iframe>
                    <div v-else class="text-center p-5 bg-light">
                      <p>URL video đã được lưu và sẽ được hiển thị sau khi lưu bài học.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="content">Nội dung bài học</label>
              <!-- <ToastEditorComponent v-model="lesson.content" :key="editorKey" /> -->
              <CKEditorComponent v-model="lesson.content" />
              <div class="invalid-feedback" v-if="errors.content">{{ errors.content }}</div>
            </div>
            <div class="form-group">
              <label for="contentRefer">Tài liệu tham khảo</label>
              <!-- <ToastEditorComponent v-model="lesson.contentRefer" :key="editorKey" /> -->
              <CKEditorComponent v-model="lesson.contentRefer" />
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
import { onMounted, ref, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import 'filepond/dist/filepond.min.css'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'
import webSocketService from '@/services/WebSocketService'
import { useToastStore } from '@/stores/toastStore'
import CKEditorComponent from '@/components/CKEditorComponent.vue'
const toastStore = useToastStore()

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const router = useRouter()
const route = useRoute()
const idCourse = route.params.idCourse
const idChapter = route.params.idChapter
const idLesson = route.params.idLesson
const isLoading = ref(false)
const isUpdate = ref(false)

const editorKey = ref(0)

const lesson = ref({
  name: '',
  type: '',
  lessonOrder: '',
  content: '',
  videoUrl: '',
  isPublic: false,
  contentRefer: '',
  videoFile: [],
})

const errors = ref({
  name: '',
  type: '',
  lessonOrder: '',
  content: '',
  videoUrl: '',
  contentRefer: '',
  videoFile: '',
})

const videoMethod = ref('url')
const videoFileName = ref('')
let videoFile = null

// Xử lý khi người dùng chọn file
const handleVideoFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  videoFileName.value = file.name

  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    errors.videoFile = 'Kích thước file không được vượt quá 100MB'
    return
  }

  const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
  if (!validTypes.includes(file.type)) {
    errors.videoFile = 'Định dạng file không được hỗ trợ. Vui lòng sử dụng MP4, WebM hoặc Ogg.'
    return
  }

  errors.videoFile = ''

  videoFile = file

  lesson.value.videoUrl = ''
}

const isYoutubeUrl = (url) => {
  if (!url) return false
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)
}

const getYoutubeEmbedUrl = (url) => {
  if (!url) return ''
  let videoId = ''

  try {
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search)
      videoId = urlParams.get('v')
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error)
    return ''
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

const isVimeoUrl = (url) => {
  if (!url) return false
  return /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/.test(url)
}

const getVimeoEmbedUrl = (url) => {
  if (!url) return ''
  try {
    const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0]
    return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : ''
  } catch (error) {
    console.error('Error parsing Vimeo URL:', error)
    return ''
  }
}

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

  if (!lesson.value.content.trim() && lesson.value.type !== 'LECTURES') {
    errors.value.content = 'Nội dung bài học không được để trống'
    isValid = false
  }

  if (lesson.value.type == 'LECTURES') {
    switch (videoMethod.value) {
      case 'url':
        if (!lesson.value.videoUrl) {
          errors.value.videoUrl = 'Vui lòng nhập URL video'
          return false
        }
        break

      case 'file':
        if (!isUpdate.value && !videoFile) {
          errors.value.videoFile = 'Vui lòng chọn file video'
          return false
        } else if (isUpdate.value && !lesson.value.videoUrl && !videoFile) {
          errors.value.videoFile = 'Vui lòng chọn file video hoặc nhập URL'
          return false
        }
        break

      default:
        errors.value.videoUrl = 'Vui lòng chọn phương thức thêm video'
        return false
    }
  }

  return isValid
}

const updateLessonStatus = (status) => {
  const statusPriority = { PENDING: 1, PROCESSING: 2, DONE: 3 }

  // Nếu chưa có toast, tạo mới
  if (!toastStore.toastId) {
    const id = toast(`⏳ Video ${getLessonTypeName(lesson.value.type)} đang chờ xử lý...`, {
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

    toastStore.setToast(id, 'PENDING')
  }

  if (
    toastStore.currentStatus &&
    statusPriority[status] < statusPriority[toastStore.currentStatus]
  ) {
    return
  }

  toastStore.currentStatus = status

  if (status === 'PROCESSING') {
    toast.update(toastStore.toastId, {
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
    toast.update(toastStore.toastId, {
      render: '✅ Đã hoàn tất!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
      pauseOnFocusLoss: false,
      style: {
        color: '#047857',
      },
    })
    toastStore.clearToast()
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
    formData.append('contentRefer', lesson.value.contentRefer || '')
    formData.append('chapterId', idChapter)
    formData.append('isPublic', lesson.value.isPublic)

    if (lesson.value.type != 'EXERCISES') {
      if (videoMethod.value === 'url') {
        formData.append('videoUrl', lesson.value.videoUrl || '')
      } else if (videoMethod.value === 'file' && videoFile) {
        formData.append('files', videoFile)
        formData.append('videoUrl', '')
      }
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

      videoMethod.value = 'url'
      videoFileName.value = ''
      videoFile = null
      lesson.value.isPublic = false
      editorKey.value++

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

watch(videoMethod, (newMethod) => {
  errors.videoUrl = ''
  errors.videoFile = ''

  if (newMethod === 'url') {
    videoFileName.value = ''
    videoFile = null
  } else if (newMethod === 'file') {
    lesson.value.videoUrl = ''
  }
})

// Watch thay đổi của lesson type
watch(
  () => lesson.value.type,
  (newType) => {
    if (newType === 'EXERCISES') {
      lesson.value.videoUrl = ''
      videoFileName.value = ''
      videoFile = null
    }
  }
)

onMounted(async () => {
  if (idLesson) {
    isUpdate.value = true
    await fetchLesson(idLesson)
  }

  webSocketService.subscribe('/topic/progress', (message) => {
    updateLessonStatus(message.status)
    // console.log('Received message:', message)
  })

  if (isUpdate.value && lesson.value.videoUrl) {
    videoMethod.value = 'url'
  }
})
onBeforeUnmount(() => {
  webSocketService.unsubscribe('/topic/progress')
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
.disabled-field {
  opacity: 0.5;
  pointer-events: none;
}
.disabled-label {
  color: #9eacb8;
}
</style>