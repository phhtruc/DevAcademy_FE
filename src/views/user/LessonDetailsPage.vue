<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import CommentPanel from '@/components/comment/CommentPanel.vue'

const router = useRouter()
const route = useRoute()

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const lessonId = route.params.idLesson
const idCourse = route.params.idCourse

const lesson = ref({})
const chapters = ref([])
const activeLesson = ref(null)
const isEnrolled = ref(false)
const chapterLessons = reactive({})
const loadingChapter = reactive({})
const expandedChaptersSidebar = reactive({})
const showReferContent = ref(false)
const isSidebarOpen = ref(true)
const isCommentPanelOpen = ref(false)
const currentLessonId = ref(Number(route.params.idLesson))
const githubLink = ref('')
const isSubmitting = ref(false)
const submissionType = ref('link')
const selectedFile = ref(null)
const submissionResult = ref(null)
const submissionHistory = ref([])
const showSubmissionHistory = ref(false)
const hasPassedExercise = computed(() => {
  return submissionResult.value && submissionResult.value.includes('PASS')
})

const toggleCommentPanel = () => {
  isCommentPanelOpen.value = !isCommentPanelOpen.value
}

const showHistory = () => {
  showSubmissionHistory.value = !showSubmissionHistory.value
  if (showSubmissionHistory.value === true) {
    submissionResult.value = null
  } else {
    submissionResult.value = submissionHistory.value[0].review
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const fetchLessonDetails = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/lessons/${id}`)
    lesson.value = response.data.data
    if (lesson.value && lesson.value.type === 'EXERCISES') {
      fetchSubmissionHistory(id)
    }

    activeLesson.value = parseInt(lessonId)
  } catch (error) {
    console.error('Error fetching lesson details:', error)
  }
}

const fetchChapters = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${idCourse}/chapters`)
    chapters.value = response.data.data.items || []

    chapters.value.forEach((chapter) => {
      expandedChaptersSidebar[chapter.id] = false
      loadingChapter[chapter.id] = false
    })

    const currentLessonChapter = await findLessonChapter()

    if (currentLessonChapter) {
      expandedChaptersSidebar[currentLessonChapter] = true
      await fetchChapterLessons(currentLessonChapter)
    } else if (chapters.value.length > 0) {
      expandedChaptersSidebar[chapters.value[0].id] = true
      await fetchChapterLessons(chapters.value[0].id)
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
  }
}

const findLessonChapter = async () => {
  if (!lesson.value || !lesson.value.chapter) {
    return null
  }

  return lesson.value.chapter
}

const fetchChapterLessons = async (chapterId) => {
  if (loadingChapter[chapterId] || chapterLessons[chapterId]) return

  try {
    loadingChapter[chapterId] = true

    const response = await axios.get(`${rootAPI}/chapters/${chapterId}/lessons`, {
      params: { page: 1, pageSize: 100, idCourse: idCourse },
    })

    chapterLessons[chapterId] = response.data.data.items || []
  } catch (error) {
    console.error(`Error fetching lessons for chapter ${chapterId}:`, error)
  } finally {
    loadingChapter[chapterId] = false
  }
}

const toggleChapterSidebar = async (chapterId) => {
  expandedChaptersSidebar[chapterId] = !expandedChaptersSidebar[chapterId]

  if (expandedChaptersSidebar[chapterId] && !chapterLessons[chapterId]) {
    await fetchChapterLessons(chapterId)
  }
}

const isChapterExpandedSidebar = (chapterId) => {
  return !!expandedChaptersSidebar[chapterId]
}

const handleLessonClick = (lesson) => {
  if (lesson.isPublic || isEnrolled.value) {
    router.push(`/khoa-hoc/${idCourse}/noi-dung/${lesson.id}`)
    fetchLessonDetails(lesson.id)
  }
}

const submitExercise = async () => {
  if (!githubLink.value && !selectedFile.value && submissionType.value === 'link') {
    toast.error('Vui lòng nhập đường dẫn GitHub', {
      position: 'top-right',
      autoClose: 3000,
    })
    return
  }

  if (!selectedFile.value && submissionType.value === 'file') {
    toast.error('Vui lòng chọn file để nộp', {
      position: 'top-right',
      autoClose: 3000,
    })
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    if (submissionType.value === 'link') {
      formData.append('githubLink', githubLink.value)
    } else {
      formData.append('file', selectedFile.value)
    }

    formData.append('idExercise', lesson.value.id)
    formData.append('exerciseTitle', lesson.value.name)
    formData.append('idCourse', idCourse)

    const response = await axios.post(`${rootAPI}/submissions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    submissionResult.value = response.data.data

    if (!response.data.data.includes('PASS')) {
      githubLink.value = ''
      selectedFile.value = null
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      window.toast.error(error.response?.data?.message || 'Không thể xử lý yêu cầu', {
        position: 'top-right',
        autoClose: 5000,
      })
    } else {
      window.toast.error('Có lỗi xảy ra khi nộp bài tập. Vui lòng thử lại sau.', {
        position: 'top-right',
        autoClose: 5000,
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleFileChange = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
      selectedFile.value = file
    } else {
      toast.error('Chỉ chấp nhận file .zip', {
        position: 'top-right',
        autoClose: 3000,
      })

      event.target.value = null
      selectedFile.value = null
    }
  }
}

const fetchSubmissionHistory = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/submissions/lessons/${id}`)
    submissionHistory.value = response.data.data || []
    console.log('Submission History:', submissionHistory.value)
    if (submissionHistory.value.length > 0 && !submissionResult.value) {
      submissionResult.value = submissionHistory.value[0].review
    } else {
      submissionResult.value = null
    }
  } catch (error) {
    toast.error('Có lỗi xảy ra khi lấy lịch sử nộp bài.', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

const clearFileInput = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('exercise-file-input')
  if (fileInput) fileInput.value = ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) return dateString

    // Format: HH:MM:SS DD-MM-YYYY
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const goBack = () => {
  router.push(`/khoa-hoc/${idCourse}`)
}

watch(
  () => route.params.idLesson,
  (newId) => {
    currentLessonId.value = Number(newId)
  },
  { immediate: true }
)

onMounted(async () => {
  await fetchLessonDetails(lessonId)
  await fetchChapters()
})
</script>
<template>
  <div class="lesson-details-page">
    <div class="container">
      <div class="row">
        <!-- Sidebar -->
        <div class="sidebar-container" :style="{ width: isSidebarOpen ? '30%' : '4%' }">
          <div class="course-sidebar">
            <!-- Toggle button -->
            <div class="sidebar-toggle" @click="toggleSidebar">
              <i :class="['fas', isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right']"></i>
            </div>

            <div :class="['sidebar-content', { 'd-none': !isSidebarOpen }]">
              <div class="sidebar-header">
                <h4>Nội dung khóa học</h4>
                <p>{{ chapters.length }} chương</p>
              </div>

              <div class="sidebar-chapters">
                <div
                  v-for="chapter in chapters"
                  :key="`sidebar-${chapter.id}`"
                  class="sidebar-chapter"
                >
                  <div class="sidebar-chapter-header" @click="toggleChapterSidebar(chapter.id)">
                    <div class="d-flex align-items-center justify-content-between">
                      <span class="sidebar-chapter-title">
                        <span class="chapter-number">{{ chapters.indexOf(chapter) + 1 }}.</span>
                        {{ chapter.name }}
                      </span>
                      <i
                        class="fas"
                        :class="
                          isChapterExpandedSidebar(chapter.id) ? 'fa-chevron-up' : 'fa-chevron-down'
                        "
                      ></i>
                    </div>
                  </div>

                  <div v-if="isChapterExpandedSidebar(chapter.id)" class="sidebar-chapter-content">
                    <div v-if="loadingChapter[chapter.id]" class="sidebar-loading">
                      <div class="spinner-border spinner-border-sm" role="status"></div>
                      <span>Đang tải...</span>
                    </div>

                    <ul v-else-if="chapterLessons[chapter.id]?.length" class="sidebar-lessons">
                      <li
                        v-for="lessonItem in chapterLessons[chapter.id]"
                        :key="`sidebar-lesson-${lessonItem.id}`"
                        :class="[
                          'sidebar-lesson',
                          parseInt(lessonItem.id) === parseInt(route.params.idLesson)
                            ? 'active'
                            : '',
                          !isEnrolled && !lessonItem.isPublic ? 'locked' : '',
                        ]"
                        @click="
                          lessonItem.isPublic || isEnrolled ? handleLessonClick(lessonItem) : null
                        "
                      >
                        <div class="d-flex align-items-start">
                          <span class="lesson-icon">
                            <i
                              class="fas"
                              :class="{
                                'fa-play-circle': lessonItem.type === 'LECTURES',
                                'fa-chalkboard-teacher': lessonItem.type === 'READINGS',
                                'fa-tasks': lessonItem.type === 'EXERCISES',
                              }"
                            ></i>
                          </span>
                          <span
                            class="lesson-type mr-1"
                            :style="{
                              color:
                                parseInt(lessonItem.id) === parseInt(route.params.idLesson)
                                  ? '#3f6ad8'
                                  : '#6c757d',
                            }"
                          >
                            [
                            <span v-if="lessonItem.type === 'READINGS'">Bài đọc</span>
                            <span v-else-if="lessonItem.type === 'LECTURES'">Bài giảng</span>
                            <span v-else-if="lessonItem.type === 'EXERCISES'">Bài tập</span>
                            ]
                          </span>
                          <span class="lesson-title">
                            {{ lessonItem.name || lessonItem.title }}
                          </span>
                        </div>
                        <span v-if="!isEnrolled && !lessonItem.isPublic" class="lesson-lock">
                          <i class="fas fa-lock"></i>
                        </span>
                        <span v-else class="lesson-duration">{{ lessonItem.duration }}</span>
                      </li>
                    </ul>

                    <div v-else class="sidebar-empty">Không có bài học nào.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lesson Content -->
        <div class="content-container ml-3" :style="{ width: isSidebarOpen ? '68%' : '94%' }">
          <div class="lesson-header d-flex align-items-center mb-3">
            <button class="back-btn me-3 ml-3" @click="goBack">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h3 class="lesson-title-goback mb-0 ml-2 text-white flex-grow-1">{{ lesson.name }}</h3>
          </div>
          <button
            class="comment-btn"
            @click="toggleCommentPanel"
            style="position: fixed; bottom: 20px; right: 20px; z-index: 9999"
          >
            <i class="fas fa-comments"></i> Hỏi Đáp
          </button>

          <div class="lesson-content">
            <!-- Type: READINGS -->
            <div v-if="lesson.type === 'READINGS'">
              <div class="ml-3" v-html="lesson.content"></div>
              <button class="btn btn-primary" @click="showReferContent = !showReferContent">
                Tham khảo
              </button>
              <div v-if="showReferContent" v-html="lesson.contentRefer"></div>
            </div>

            <!-- Type: LECTURES -->
            <div v-else-if="lesson.type === 'LECTURES'">
              <div class="video-container mb-4">
                <iframe
                  :src="lesson.videoUrl"
                  frameborder="0"
                  allowfullscreen
                  class="lesson-video"
                ></iframe>
              </div>
              <div v-html="lesson.content"></div>
            </div>

            <!-- Type: EXERCISES -->
            <div v-else-if="lesson.type === 'EXERCISES'" class="exercise-container">
              <!-- Exercise Content -->
              <div class="exercise-content mb-4" v-html="lesson.content"></div>
              <button class="btn btn-primary" @click="showReferContent = !showReferContent">
                Tham khảo
              </button>
              <div v-if="showReferContent" v-html="lesson.contentRefer"></div>

              <!-- Submission Form -->
              <div class="submission-form card p-3 mb-4">
                <h4 class="mb-3">Nộp bài tập</h4>
                <div
                  class="submission-type-selector mb-3 d-flex justify-content-between align-items-center"
                >
                  <div class="submission-options d-flex align-items-center">
                    <div class="form-check form-check-inline mb-0 me-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="linkSubmission"
                        value="link"
                        v-model="submissionType"
                      />
                      <label class="form-check-label" for="linkSubmission">Link GitHub</label>
                    </div>
                    <div class="form-check form-check-inline mb-0">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="fileSubmission"
                        value="file"
                        v-model="submissionType"
                      />
                      <label class="form-check-label" for="fileSubmission">File .zip</label>
                    </div>
                  </div>

                  <div class="history-button">
                    <button class="btn btn-outline-primary btn-sm" @click="showHistory">
                      <i class="fas fa-history me-2"></i>
                      {{ showSubmissionHistory ? 'Ẩn lịch sử nộp' : 'Xem lịch sử nộp' }}
                    </button>
                  </div>
                </div>

                <div v-if="submissionType === 'link'" class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập đường dẫn GitHub của bạn"
                    v-model="githubLink"
                    :disabled="hasPassedExercise || isSubmitting"
                  />
                  <button
                    class="btn btn-primary"
                    @click="submitExercise"
                    :disabled="!githubLink || hasPassedExercise || isSubmitting"
                  >
                    <span
                      v-if="isSubmitting"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {{ isSubmitting ? 'Đang nộp...' : 'Nộp bài' }}
                  </button>
                </div>

                <div v-else class="mb-3">
                  <div class="input-group">
                    <input
                      type="file"
                      class="form-control"
                      id="exercise-file-input"
                      accept=".zip"
                      @change="handleFileChange"
                      :disabled="hasPassedExercise || isSubmitting"
                    />
                    <button
                      class="btn btn-primary"
                      @click="submitExercise"
                      :disabled="!selectedFile || hasPassedExercise || isSubmitting"
                    >
                      <span
                        v-if="isSubmitting"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {{ isSubmitting ? 'Đang nộp...' : 'Nộp bài' }}
                    </button>
                  </div>
                  <div v-if="selectedFile" class="selected-file mt-2">
                    <span>File đã chọn: {{ selectedFile.name }}</span>
                    <button class="btn btn-link text-danger p-0 ms-2" @click="clearFileInput">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Submission Result -->
              <div v-if="submissionResult" class="submission-result card p-3 mb-4">
                <h4 class="mb-3">Kết quả đánh giá</h4>
                <div class="result-content" v-html="submissionResult"></div>
                <div class="submission-status mt-3">
                  <div :class="['badge', hasPassedExercise ? 'bg-success' : 'bg-danger']">
                    {{ hasPassedExercise ? 'ĐẠT' : 'CHƯA ĐẠT' }}
                  </div>
                </div>
              </div>

              <!-- Submission History -->
              <div v-if="showSubmissionHistory" class="submission-result card p-3">
                <h4 class="mb-3">Lịch sử nộp bài</h4>
                <div v-if="submissionHistory.length > 0" class="history-list">
                  <div
                    v-for="(item, index) in submissionHistory"
                    :key="index"
                    class="history-item card mb-3"
                  >
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <span>Lần nộp {{ submissionHistory.length - index }}</span>
                      <span>Thời gian: {{ formatDate(item.createdDate) }}</span>
                      <div
                        :class="[
                          'badge',
                          item.review && item.review.includes('PASS') ? 'bg-success' : 'bg-danger',
                        ]"
                      >
                        {{ item.review && item.review.includes('PASS') ? 'ĐẠT' : 'CHƯA ĐẠT' }}
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="result-content" v-html="item.review"></div>
                    </div>
                    <hr v-if="index !== submissionHistory.length - 1" />
                  </div>
                </div>
                <div v-else class="text-center py-3">
                  <p>Chưa có lần nộp bài nào.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Comment Panel -->
    <CommentPanel
      :is-open="isCommentPanelOpen"
      :lesson-id="currentLessonId"
      @close="toggleCommentPanel"
    />

    <!-- Overlay khi mở panel bình luận -->
    <div v-if="isCommentPanelOpen" class="comment-overlay" @click="toggleCommentPanel"></div>
  </div>
</template>

<style scoped>
.lesson-details-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container,
.row,
.sidebar-container,
.content-container {
  height: 100%;
}

.sidebar-container {
  overflow-y: auto;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  position: relative;
  transition: all 0.3s ease;
}

.content-container {
  overflow-y: auto;
  background-color: #fff;
  position: relative;
  transition: all 0.3s ease;
}

.lesson-header {
  position: sticky;
  top: 0;
  background-color: #0084ff;
  z-index: 10;
  padding: 5px;
  border-bottom: 1px solid #ddd;
  border-radius: 0.5rem;
}

.back-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.lesson-title {
  font-size: 2rem;
  word-wrap: break-word !important;
  white-space: normal !important;
}

.lesson-content {
  padding: 20px;
  overflow-y: auto;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.lesson-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.course-sidebar {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 90px;
  height: 100%;
  transition: all 0.3s ease;
}

.sidebar-toggle {
  position: absolute;
  top: 20px;
  right: 5px;
  z-index: 100;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle:hover {
  background-color: #f8f9fa;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h4 {
  margin-bottom: 8px;
  font-weight: 600;
}

.sidebar-header p {
  margin-bottom: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.sidebar-chapters {
  overflow-y: auto;
  max-height: 600px;
}

.sidebar-chapter {
  border-bottom: 1px solid #eee;
}

.sidebar-chapter:last-child {
  border-bottom: none;
}

.sidebar-chapter-header {
  padding: 15px 20px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.3s ease;
}

.sidebar-chapter-header:hover {
  background-color: #f8f9fa;
}

.sidebar-chapter-title {
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

.sidebar-chapter-info {
  color: #6c757d;
  font-size: 0.8rem;
}

.sidebar-chapter-content {
  background-color: #f8f9fa;
}

.sidebar-lessons {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-lesson {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 12px 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: all 0.15s ease;
  position: relative;
}

.sidebar-lesson:last-child {
  border-bottom: none;
}

.sidebar-lesson:hover {
  background-color: rgba(63, 106, 216, 0.05);
}

.sidebar-lesson.active {
  background-color: rgba(63, 106, 216, 0.1);
  color: #3f6ad8;
}

.sidebar-lesson.locked {
  cursor: not-allowed;
  color: #adb5bd;
}

.sidebar-lesson .lesson-icon {
  margin-right: 10px;
}

.sidebar-lesson .lesson-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
}

.sidebar-lesson .lesson-type,
.sidebar-lesson .lesson-lock,
.sidebar-lesson .lesson-duration {
  font-size: 0.8rem;
  color: #6c757d;
  margin-right: 5px;
}

.sidebar-loading,
.sidebar-empty {
  padding: 15px;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.sidebar-loading .spinner-border {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

@media (max-width: 992px) {
  .course-sidebar {
    margin-top: 30px;
    position: static;
  }

  .sidebar-chapters {
    max-height: none;
  }
}

.comment-btn {
  background-color: #fff;
  color: #0084ff;
  border: 1px solid #0084ff;
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: auto;
}

.comment-btn:hover {
  background-color: #0084ff;
  color: #fff;
}

/* Overlay khi mở panel bình luận */
.comment-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Điều chỉnh header để chứa nút Hỏi Đáp */
.lesson-header {
  display: flex;
  justify-content: space-between;
}

.submission-result {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
}
</style>
