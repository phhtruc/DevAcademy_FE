<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()

const rootAPI = import.meta.env.VITE_APP_ROOT_API
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

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const fetchLessonDetails = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/lessons/${id}`)
    lesson.value = response.data.data

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
      params: { page: 1, pageSize: 100 },
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

const goBack = () => {
  router.push(`/khoa-hoc/${idCourse}`)
}

onMounted(async () => {
  await fetchLessonDetails(lessonId)
  await fetchChapters()
})
</script>
<template>
  <div class="lesson-details-page">
    <div class="container">
      <div class="row">
        <!-- Collapsible Sidebar -->
        <div class="sidebar-container" :style="{ width: isSidebarOpen ? '30%' : '4%' }">
          <div class="course-sidebar mr-3">
            <!-- Toggle button inside sidebar -->
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
        <div class="lesson-content" :style="{ width: isSidebarOpen ? '68%' : '95%' }">
          <div class="lesson-header d-flex align-items-center mb-3">
            <button class="back-btn me-3 mr-4 ml-3" @click="goBack">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h3 class="lesson-title-goback mb-0 text-white">{{ lesson.name }}</h3>
          </div>
          <h1 class="lesson-title">{{ lesson.name }}</h1>

          <div class="lesson-content">
            <!-- Type: READINGS -->
            <div v-if="lesson.type === 'READINGS'">
              <div v-html="lesson.content"></div>
              <button class="btn btn-primary mt-3" @click="showReferContent = !showReferContent">
                Tham khảo
              </button>
              <div v-if="showReferContent" class="mt-3" v-html="lesson.contentRefer"></div>
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
            <div v-else-if="lesson.type === 'EXERCISES'">
              <p>Phần bài tập hiện đang được cập nhật.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.lesson-header {
  background-color: #0084ff;
  border-radius: 0.5rem;
  padding: 5px;
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
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  cursor: pointer;
}

.lesson-details-page {
  background-color: #f8f9fa;
  padding: 20px 0;
}

.lesson-title {
  font-size: 2rem;
  word-wrap: break-word !important;
  white-space: normal !important;
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

.sidebar-container, .lesson-content{
  transition: all 0.3s ease;
  position: relative;
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

.sidebar-content {
  transition: all 0.3s ease;
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
  padding: 12px 20px 12px 10px;
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

.sidebar-lesson .lesson-type {
  font-size: 0.8rem;
  color: #6c757d;
  margin-right: 5px;
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

@media (max-width: 992px) {
  .course-sidebar {
    margin-top: 30px;
    position: static;
  }

  .sidebar-chapters {
    max-height: none;
  }
}
</style>