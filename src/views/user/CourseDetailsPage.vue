<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const courseId = route.params.idCourse

const course = ref({})
const chapters = ref([])
const activeLesson = ref(null)
const isEnrolled = ref(false)
const chapterLessons = reactive({})
const loadingChapter = reactive({})
const expandedChapters = reactive({})
const expandedChaptersSidebar = reactive({})

const formatPrice = (price) => {
  if (price === 0 || price === null || price === undefined) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
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

const setActiveLesson = (lessonId) => {
  activeLesson.value = lessonId
  localStorage.setItem(`lastLesson_${courseId}`, lessonId)
}

const handleLessonClick = (lesson) => {
  if (lesson.isPublic || isEnrolled.value) {
    router.push(`/course/${courseId}/lesson/${lesson.id}`)
  }
}

const enrollCourse = async () => {
  if (!authStore.isLoggedIn) {
    router.push(`/login?redirect=/course/${courseId}`)
    return
  }

  try {
    const response = await axios.post(`${rootAPI}/enrollments`, { courseId })
    if (response.data.success) {
      isEnrolled.value = true
      if (chapters.value.length > 0) {
        const firstChapter = chapters.value[0]
        await fetchChapterLessons(firstChapter.id)

        if (chapterLessons[firstChapter.id]?.length > 0) {
          setActiveLesson(chapterLessons[firstChapter.id][0].id)
        }
      }
    }
  } catch (error) {
    console.error('Error enrolling in course:', error)
  }
}

const fetchCourseDetails = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${courseId}`)
    course.value = response.data.data

    await fetchChapters()
  } catch (err) {
    console.error('Error fetching course details:', err)
  }
}

const fetchChapters = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${courseId}/chapters`)
    chapters.value = response.data.data.items || []

    chapters.value.forEach((chapter) => {
      expandedChapters[chapter.id] = false
      expandedChaptersSidebar[chapter.id] = false
      loadingChapter[chapter.id] = false
    })

    if (chapters.value.length > 0) {
      expandedChapters[chapters.value[0].id] = true
      await fetchChapterLessons(chapters.value[0].id)
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
  }
}

const fetchChapterLessons = async (chapterId) => {
  if (loadingChapter[chapterId] || chapterLessons[chapterId]) return

  try {
    loadingChapter[chapterId] = true

    const response = await axios.get(`${rootAPI}/chapters/${chapterId}/lessons`, {
      params: { page: 1, pageSize: 100 },
    })

    chapterLessons[chapterId] = response.data.data.items || []

    const lastLessonId = localStorage.getItem(`lastLesson_${courseId}`)
    if (lastLessonId && chapterLessons[chapterId].some((l) => l.id.toString() === lastLessonId)) {
      activeLesson.value = parseInt(lastLessonId)
    } else if (!activeLesson.value && chapterLessons[chapterId].length > 0) {
      activeLesson.value = chapterLessons[chapterId][0].id
    }
  } catch (error) {
    console.error(`Error fetching lessons for chapter ${chapterId}:`, error)
  } finally {
    loadingChapter[chapterId] = false
  }
}

onMounted(fetchCourseDetails)
</script>

<template>
  <div class="course-details-page">
    <div class="course-container">
      <section
        class="course-header"
        :style="{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${course.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }"
      >
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <div class="course-header-content">
                <h1 class="course-title">{{ course.name }}</h1>
                <p class="course-description">
                  {{ course.description }}
                </p>
                <div class="course-meta">
                  <span
                    ><i class="fas fa-users"></i> {{ course.enrollmentCount || 0 }} học viên</span
                  >
                  <span
                    ><i class="fas fa-calendar-alt"></i> Cập nhật:
                    {{ formatDate(course.updatedAt) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="course-action-card">
                <div class="course-price">{{ formatPrice(course.price) }}</div>
                <button
                  v-if="!authStore.isLoggedIn"
                  @click="enrollCourse"
                  class="btn btn-primary btn-lg w-100 mb-3"
                >
                  Đăng nhập để đăng ký
                </button>
                <button
                  v-else-if="!isEnrolled"
                  @click="enrollCourse"
                  class="btn btn-primary btn-lg w-100 mb-3"
                >
                  Đăng ký khóa học
                </button>
                <router-link
                  v-else
                  :to="`/course/${courseId}/learn`"
                  class="btn btn-success btn-lg w-100 mb-3"
                >
                  Tiếp tục học
                </router-link>

                <ul class="course-features">
                  <li><i class="fas fa-book"></i> {{ chapters.length }} chương</li>
                  <li><i class="fas fa-file-alt"></i> {{ course.lessonCount }} bài học</li>
                  <li><i class="fas fa-clock"></i> {{ course.duration || 'N/A' }} tháng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="course-content-section">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="course-sidebar">
                <div class="sidebar-header">
                  <h4>Nội dung khóa học</h4>
                  <p>{{ chapters.length }} chương • {{ course.lessonCount }} bài học</p>
                </div>

                <div class="sidebar-chapters">
                  <div
                    v-for="chapter in chapters"
                    :key="`sidebar-${chapter.id}`"
                    class="sidebar-chapter"
                  >
                    <div class="sidebar-chapter-header" @click="toggleChapterSidebar(chapter.id)">
                      <div class="d-flex align-items-center justify-content-between">
                        <span class="sidebar-chapter-title">{{ chapter.name }}</span>
                        <i
                          class="fas"
                          :class="
                            isChapterExpandedSidebar(chapter.id)
                              ? 'fa-chevron-up'
                              : 'fa-chevron-down'
                          "
                        ></i>
                      </div>
                      <div class="sidebar-chapter-info">
                        <small>{{ chapter.lessonCount || 0 }} bài học</small>
                      </div>
                    </div>

                    <div
                      v-if="isChapterExpandedSidebar(chapter.id)"
                      class="sidebar-chapter-content"
                    >
                      <div v-if="loadingChapter[chapter.id]" class="sidebar-loading">
                        <div class="spinner-border spinner-border-sm" role="status"></div>
                        <span>Đang tải...</span>
                      </div>

                      <ul v-else-if="chapterLessons[chapter.id]?.length" class="sidebar-lessons">
                        <li
                          v-for="lesson in chapterLessons[chapter.id]"
                          :key="`sidebar-lesson-${lesson.id}`"
                          :class="[
                            'sidebar-lesson',
                            activeLesson === lesson.id ? 'active' : '',
                            !isEnrolled && !lesson.isPublic ? 'locked' : '',
                          ]"
                          @click="lesson.isPublic || isEnrolled ? handleLessonClick(lesson) : null"
                        >
                          <div class="d-flex align-items-center">
                            <span class="lesson-icon">
                              <i
                                class="fas"
                                :class="{
                                  'fa-play-circle': lesson.type === 'VIDEO',
                                  'fa-question-circle': lesson.type === 'QUIZ',
                                  'fa-tasks': lesson.type === 'ASSIGNMENT',
                                  'fa-file-alt': !lesson.type || lesson.type === 'TEXT',
                                }"
                              ></i>
                            </span>
                            <span class="lesson-title">{{ lesson.name || lesson.title }}</span>
                          </div>
                          <span v-if="!isEnrolled && !lesson.isPublic" class="lesson-lock">
                            <i class="fas fa-lock"></i>
                          </span>
                          <span v-else class="lesson-duration">{{ lesson.duration }}</span>
                        </li>
                      </ul>

                      <!-- No Lessons -->
                      <div v-else class="sidebar-empty">Không có bài học nào.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* General Layout */
.course-details-page {
  background-color: #f8f9fa;
}

.loading-container,
.error-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.container {
  max-width: 1200px;
}

/* Course Header */
.course-header {
  color: white;
  padding: 60px 0;
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.course-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0;
  color: white;
}

.course-description {
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.course-meta span {
  margin-right: 20px;
  font-size: 0.9rem;
}

.course-meta i {
  margin-right: 5px;
}

.course-category {
  padding: 6px 12px;
  margin-bottom: 12px;
}

/* Course Action Card */
.course-action-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.course-price {
  font-size: 2rem;
  font-weight: 700;
  color: #3f6ad8;
  text-align: center;
  margin-bottom: 20px;
}

.course-features {
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
  border-top: 1px solid #eee;
  padding-top: 20px;
  color: #3f6ad8;
}

.course-features li {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.course-features li i {
  color: #3f6ad8;
  margin-right: 10px;
  width: 20px;
}

/* Course Content Section */
.course-content-section {
  padding: 40px 0;
}

.content-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Custom Tabs */
.custom-tabs {
  border-bottom: 1px solid #eee;
}

.tab-buttons {
  display: flex;
}

.tab-button {
  padding: 15px 20px;
  background: none;
  border: none;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button.active {
  color: #3f6ad8;
  border-bottom-color: #3f6ad8;
}

.tab-button:hover {
  color: #3f6ad8;
}

.tab-content {
  padding: 30px;
}

.tab-pane {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Course Curriculum */
.course-curriculum h3 {
  margin-bottom: 5px;
  font-weight: 600;
}

.course-outcomes,
.course-requirements {
  list-style: none;
  padding-left: 10px;
}

.course-outcomes li,
.course-requirements li {
  margin-bottom: 12px;
  padding-left: 30px;
  position: relative;
}

.course-outcomes li i,
.course-requirements li i {
  position: absolute;
  left: 0;
  top: 3px;
}

/* Accordion */
.accordion-item {
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.accordion-button {
  padding: 15px 20px;
  background-color: #f8f9fa;
  font-weight: 600;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-button:not(.collapsed) {
  background-color: #e9ecef;
  color: #3f6ad8;
}

.chapter-title {
  font-weight: 600;
}

.chapter-info {
  font-size: 0.9rem;
}

/* Lesson List */
.lesson-list {
  border-radius: 0;
}

.list-group-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:hover {
  background-color: rgba(63, 106, 216, 0.05);
}

.list-group-item.active {
  background-color: rgba(63, 106, 216, 0.1);
  color: #3f6ad8;
  border-color: #eee;
}

.list-group-item.locked {
  cursor: not-allowed;
  color: #adb5bd;
  background-color: #f8f9fa;
}

.lesson-icon {
  width: 24px;
  text-align: center;
}

.lesson-title {
  font-weight: 500;
}

.lesson-meta {
  font-size: 0.9rem;
  color: #6c757d;
}

.lesson-lock i {
  color: #adb5bd;
}

/* Instructor Profile */
.instructor-profile {
  padding: 15px;
}

.instructor-avatar {
  width: 100%;
  max-width: 150px;
  margin-bottom: 20px;
}

.instructor-name {
  font-weight: 700;
  margin-bottom: 5px;
}

.instructor-title {
  margin-bottom: 20px;
}

.instructor-stats {
  margin-top: 20px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  border-right: 1px solid #eee;
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3f6ad8;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

/* Sidebar */
.course-sidebar {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 90px;
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
}

.sidebar-chapter-header:hover {
  background-color: #f8f9fa;
}

.sidebar-chapter-title {
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
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
  padding: 12px 20px 12px 40px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid #eee;
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

.sidebar-lesson .lesson-preview {
  font-size: 0.7rem;
  color: white;
  background-color: #17a2b8;
  border-radius: 10px;
  padding: 2px 6px;
  margin-left: 5px;
}

.sidebar-lesson .lesson-lock,
.sidebar-lesson .lesson-duration {
  font-size: 0.8rem;
  color: #6c757d;
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

/* Responsive Styles */
@media (max-width: 992px) {
  .course-header {
    padding: 40px 0;
  }

  .course-title {
    font-size: 2rem;
  }

  .course-action-card {
    margin-top: 30px;
  }

  .course-sidebar {
    margin-top: 30px;
    position: static;
  }

  .sidebar-chapters {
    max-height: none;
  }

  .tab-content {
    padding: 20px 15px;
  }

  .instructor-profile .stat-item {
    border-right: none;
    margin-bottom: 15px;
  }
}

@media (max-width: 768px) {
  .course-header {
    padding: 30px 0;
  }

  .course-meta span {
    display: block;
    margin-bottom: 8px;
  }

  .tab-button {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>