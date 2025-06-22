<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <!-- Thống kê tổng quan -->
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body d-flex align-items-center p-4">
              <div
                class="bg-primary rounded-circle d-flex justify-content-center align-items-center mr-2"
                style="width: 50px; height: 50px"
              >
                <i class="ri-user-line text-white fs-5"></i>
              </div>
              <div>
                <h2 class="mb-0 fw-bold">{{ stats.totalStudents || 0 }}</h2>
                <p class="text-muted mb-0">Tổng học viên</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body d-flex align-items-center p-4">
              <div
                class="bg-success rounded-circle d-flex justify-content-center align-items-center mr-2"
                style="width: 50px; height: 50px"
              >
                <i class="ri-user-star-line text-white fs-5"></i>
              </div>
              <div>
                <h5 class="mb-1 fw-bold">{{ stats.activeStudents || 0 }}</h5>
                <p class="mb-0 text-muted">Học viên đang học</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bộ lọc và danh sách học viên -->
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">Danh sách học viên</h4>
          </div>
        </div>

        <div class="iq-card-body">
          <!-- Bộ lọc -->
          <div class="row mb-4">
            <div class="col-md-4">
              <div class="form-group">
                <label for="searchInput">Tìm kiếm học viên</label>
                <form @submit.prevent="handleSearch">
                  <div class="input-group">
                    <input
                      type="text"
                      id="searchInput"
                      class="form-control"
                      placeholder="Tìm theo tên, email..."
                      v-model="searchName"
                    />
                    <div class="input-group-append">
                      <button type="submit" class="btn btn-primary">
                        <i class="ri-search-line"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="courseFilter">Lọc theo khóa học</label>
                <select
                  id="courseFilter"
                  class="form-control"
                  v-model="filters.courseId"
                  @change="applyFilters"
                >
                  <option value="">Tất cả khóa học</option>
                  <option v-for="course in courses" :key="course.id" :value="course.id">
                    {{ course.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="d-block" style="visibility: hidden">Đặt lại</label>
                <button class="btn btn-secondary w-100" @click="resetFilters">
                  <i class="ri-refresh-line mr-1"></i> Đặt lại
                </button>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu...</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="students.length === 0" class="text-center py-5">
            <i class="ri-user-search-line text-muted" style="font-size: 3rem"></i>
            <p class="mt-2">Không tìm thấy học viên nào</p>
            <button class="btn btn-primary mt-2" @click="resetFilters">Xóa bộ lọc</button>
          </div>

          <!-- Student list -->
          <div v-else class="student-list">
            <div
              v-for="student in paginatedStudents"
              :key="student.id"
              class="iq-card student-card mb-3"
            >
              <div class="iq-card-body p-3">
                <div class="card p-3 shadow-sm mb-3 rounded-3">
                  <div class="d-flex align-items-center justify-content-between flex-wrap">
                    <div class="d-flex align-items-center gap-3">
                      <img
                        :src="student.avatar || 'https://www.gravatar.com/avatar/?d=mp'"
                        class="rounded-circle mr-2"
                        style="width: 60px; height: 60px; object-fit: cover"
                        alt="Student Avatar"
                      />
                      <div>
                        <h5 class="mb-1 fw-semibold">{{ student.name }}</h5>
                        <p class="mb-0 text-muted">{{ student.email }}</p>
                      </div>
                    </div>

                    <div class="text-end text-md-center mt-3 mt-md-0">
                      <h6 class="text-muted mb-1">Lần học gần nhất</h6>
                      <div>
                        {{ formatDateWithTime(student.lastActivityDate) }}
                      </div>
                    </div>

                    <div class="d-flex gap-2 align-items-center mt-3 mt-md-0">
                      <button
                        class="btn btn-outline-primary btn-sm"
                        @click="toggleStudentDetails(student.id)"
                      >
                        <i
                          :class="
                            expandedStudent === student.id
                              ? 'ri-arrow-up-s-line'
                              : 'ri-arrow-down-s-line'
                          "
                        ></i>
                        {{ expandedStudent === student.id ? 'Ẩn chi tiết' : 'Xem chi tiết' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Expanded details section -->
                <div
                  v-if="expandedStudent === student.id"
                  class="student-details mt-4 pt-3 border-top"
                >
                  <h6 class="details-title mb-3">Các khóa học đang học</h6>

                  <div v-if="isLoadingDetails" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <p class="mt-2">Đang tải chi tiết...</p>
                  </div>
                  <div
                    v-else-if="!studentDetails[student.id]?.courses?.length"
                    class="text-center py-4"
                  >
                    <p class="text-muted">Không thể tải dữ liệu khóa học</p>
                  </div>

                  <div v-else class="course-progress-list">
                    <div
                      v-for="course in studentDetails[student.id].courses"
                      :key="course.id"
                      class="course-item mb-4"
                    >
                      <div class="d-flex align-items-center mb-3">
                        <img
                          :src="course.thumbnailUrl || '/placeholder-course.jpg'"
                          class="course-thumbnail mr-3"
                          alt="Course Thumbnail"
                        />
                        <div>
                          <h6 class="mb-1">{{ course.name }}</h6>
                          <span
                            >Lần học gần nhất:
                            {{ formatDateWithTime(course.lastAccessedDate) }}</span
                          >
                        </div>
                      </div>

                      <div class="progress-section">
                        <div class="progress mb-2" style="height: 8px">
                          <div
                            class="progress-bar"
                            :class="getProgressBarClass(course.progress)"
                            :style="{ width: course.progress + '%' }"
                          ></div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <span class="progress-text">{{ course.progress }}% hoàn thành</span>
                          <span class="progress-text"
                            >{{ course.completedLessons }}/{{ course.totalLessons }} bài học</span
                          >
                        </div>
                      </div>

                      <div class="lesson-stats mt-3">
                        <div class="row">
                          <div class="col-md-4">
                            <div class="lesson-type-stat">
                              <span class="lesson-type text-primary">
                                <i class="ri-video-line"></i> Bài giảng
                              </span>
                              <span class="lesson-count">
                                {{ course.completedLectures }}/{{ course.totalLectures }}
                              </span>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="lesson-type-stat">
                              <span class="lesson-type text-success">
                                <i class="ri-book-open-line"></i> Bài đọc
                              </span>
                              <span class="lesson-count">
                                {{ course.completedReadings }}/{{ course.totalReadings }}
                              </span>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="lesson-type-stat">
                              <span class="lesson-type text-warning">
                                <i class="ri-task-line"></i> Bài tập
                              </span>
                              <span class="lesson-count">
                                {{ course.completedExercises }}/{{ course.totalExercises }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="course-actions mt-3">
                        <button
                          class="btn btn-sm iq-bg-info"
                          @click="sendCourseReminder(student, course)"
                        >
                          <i class="ri-notification-line"></i> Nhắc nhở
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                    <i class="ri-arrow-left-s-line"></i>
                  </a>
                </li>

                <li
                  v-for="page in displayedPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page, disabled: page === '...' }"
                >
                  <a
                    v-if="page !== '...'"
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(page)"
                  >
                    {{ page }}
                  </a>
                  <span v-else class="page-link">{{ page }}</span>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                    <i class="ri-arrow-right-s-line"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Liên hệ học viên</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="contactSubject">Tiêu đề</label>
              <input
                type="text"
                class="form-control"
                id="contactSubject"
                v-model="contactForm.subject"
              />
            </div>
            <div class="form-group">
              <label for="contactMessage">Nội dung</label>
              <textarea
                class="form-control"
                id="contactMessage"
                rows="5"
                v-model="contactForm.message"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="sendMessage">Gửi</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Reminder Modal -->
    <div class="modal fade" id="reminderModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gửi nhắc nhở</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="reminderSubject">Tiêu đề</label>
              <input
                type="text"
                class="form-control"
                id="reminderSubject"
                v-model="reminderForm.subject"
              />
            </div>
            <div class="form-group">
              <label for="reminderMessage">Nội dung</label>
              <textarea
                class="form-control"
                id="reminderMessage"
                rows="5"
                v-model="reminderForm.message"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="sendReminder">
              Gửi nhắc nhở
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const students = ref([])
const courses = ref([])
const isLoading = ref(true)
const isLoadingDetails = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchName = ref('')
const contactForm = ref({
  subject: '',
  message: '',
  studentId: null,
})
const reminderForm = ref({
  subject: '',
  message: '',
  studentId: null,
  courseId: null,
})
const stats = ref({
  totalStudents: 0,
  activeStudents: 0,
})
const filters = ref({
  search: '',
  courseId: '',
  progressStatus: '',
})
const expandedStudent = ref(null)
const studentDetails = reactive({})
const currentStudent = ref(null)
const currentCourse = ref(null)

const fetchData = async () => {
  isLoading.value = true

  try {
    const coursesResponse = await axios.get(`${rootAPI}/courses`)
    courses.value = coursesResponse.data.data.items

    let studentsResponse = null

    if (filters.value.search || filters.value.courseId) {
      studentsResponse = await axios.get(`${rootAPI}/teacher/search`, {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          courseId: filters.value.courseId || undefined,
          name: filters.value.search || undefined,
        },
      })
    } else {
      studentsResponse = await axios.get(`${rootAPI}/teacher/students`, {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
        },
      })
    }

    students.value = studentsResponse.data.data.items || []
    pageSize.value = studentsResponse.data.data.pageSize || 10

    const totalItems = studentsResponse.data.data.totalItems || students.value.length
    totalPages.value = Math.ceil(totalItems / pageSize.value)

    const statsResponse = await axios.get(`${rootAPI}/teacher/students/stats`)
    stats.value = statsResponse.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error('Có lỗi khi tải dữ liệu học viên')
  } finally {
    isLoading.value = false
  }
}

const fetchStudentDetails = async (studentId) => {
  if (studentDetails[studentId]) {
    return 
  }

  isLoadingDetails.value = true

  try {
    const response = await axios.get(`${rootAPI}/teacher/students/${studentId}/courses`)

    let coursesData = response.data.data

    if (!Array.isArray(coursesData)) {
      coursesData = [] 
    }

    studentDetails[studentId] = {
      courses: coursesData,
    }

    console.log(`Student ${studentId} courses loaded:`, coursesData)
  } catch (error) {
    console.error('Error fetching student details:', error)
    toast.error('Không thể tải chi tiết học viên')

    studentDetails[studentId] = { courses: [] }
  } finally {
    isLoadingDetails.value = false
  }
}

const toggleStudentDetails = async (studentId) => {
  if (expandedStudent.value === studentId) {
    expandedStudent.value = null
  } else {
    expandedStudent.value = studentId
    await fetchStudentDetails(studentId)
  }
}

const handleSearch = () => {
  filters.value.search = searchName.value
  currentPage.value = 1
  fetchData()
}

const applyFilters = () => {
  currentPage.value = 1
  fetchData()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    courseId: '',
    progressStatus: '',
  }
  searchName.value = ''
  applyFilters()
}

// Pagination
const totalPages = ref(1)

const paginatedStudents = computed(() => {
  return students.value
})

const displayedPages = computed(() => {
  const pages = []
  const totalPagesCount = totalPages.value

  if (totalPagesCount <= 5) {
    for (let i = 1; i <= totalPagesCount; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage.value <= 3) {
      pages.push(2, 3, 4, '...', totalPagesCount)
    } else if (currentPage.value >= totalPagesCount - 2) {
      pages.push(
        '...',
        totalPagesCount - 3,
        totalPagesCount - 2,
        totalPagesCount - 1,
        totalPagesCount
      )
    } else {
      pages.push(
        '...',
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        '...',
        totalPagesCount
      )
    }
  }

  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const formatDateWithTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getProgressBarClass = (progress) => {
  if (progress < 25) return 'bg-danger'
  if (progress < 50) return 'bg-warning'
  if (progress < 75) return 'bg-info'
  return 'bg-success'
}

const sendMessage = async () => {
  if (!currentStudent.value) return

  try {
    await axios.post(`${rootAPI}/teacher/students/${contactForm.value.studentId}/contact`, {
      subject: contactForm.value.subject,
      message: contactForm.value.message,
    })

    toast.success('Tin nhắn đã được gửi thành công!', {
      position: 'top-right',
      autoClose: 1000,
    })

    $('#contactModal').modal('hide')
  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Không thể gửi tin nhắn. Vui lòng thử lại sau.')
  }
}

// Send course reminder
const sendCourseReminder = (student, course) => {
  currentStudent.value = student
  currentCourse.value = course

  reminderForm.value.subject = `Nhắc nhở: Tiếp tục khóa học "${course.name}"`
  reminderForm.value.message = `Chào ${student.name},\n\nChúng tôi nhận thấy bạn đã đăng ký khóa học "${course.name}" nhưng có vẻ bạn đã không tham gia học một thời gian. Hãy quay lại và tiếp tục hành trình học tập của mình.\n\nTrân trọng,\nGiảng viên`
  reminderForm.value.studentId = student.id
  reminderForm.value.courseId = course.id

  $('#reminderModal').modal('show')
}

const sendReminder = async () => {
  if (!currentStudent.value || !currentCourse.value) return

  try {
    await axios.post(
      `${rootAPI}/teacher/students/${reminderForm.value.studentId}/courses/${reminderForm.value.courseId}/reminder`,
      {
        subject: reminderForm.value.subject,
        message: reminderForm.value.message,
      }
    )

    toast.success('Đã gửi nhắc nhở thành công!', {
      position: 'top-right',
      autoClose: 1000,
    })

    $('#reminderModal').modal('hide')
  } catch (error) {
    console.error('Error sending reminder:', error)
    toast.error('Không thể gửi nhắc nhở. Vui lòng thử lại sau.')
  }
}

onMounted(async () => {
  await fetchData()
})
</script>
  
  <style scoped>
.iq-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  background-color: #fff;
  border: none;
}

.iq-card-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.iq-card-body {
  padding: 20px;
}

.card-title {
  margin-bottom: 0;
}

/* Avatar styling */
.avatar-60 {
  width: 60px;
  height: 60px;
}

/* Student card styling */
.student-card {
  transition: all 0.2s ease;
}

.student-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.student-info {
  min-height: 80px;
}

.student-name {
  font-size: 1.1rem;
}

/* Progress bar styling */
.progress {
  height: 8px;
  border-radius: 4px;
  background-color: #e9ecef;
}

.progress-text {
  color: #6c757d;
  font-size: 0.8rem;
}

/* Course item styling */
.course-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #fcfcfc;
}

.course-thumbnail {
  width: 70px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.lesson-type-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  margin-bottom: 8px;
}

.lesson-type {
  font-weight: 500;
}

/* Student details section */
.student-details {
  animation: fadeIn 0.3s ease;
}

.details-title {
  color: #495057;
  font-weight: 600;
}

/* Custom button classes */
.iq-bg-primary {
  background-color: rgba(63, 106, 216, 0.1);
  color: #3f6ad8;
  border: none;
}

.iq-bg-info {
  background-color: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
  border: none;
}

.iq-bg-success {
  background-color: rgba(60, 193, 125, 0.1);
  color: #3cc17d;
  border: none;
}

/* Button hover effects */
.iq-bg-primary:hover {
  background-color: #3f6ad8;
  color: #fff;
}

.iq-bg-info:hover {
  background-color: #17a2b8;
  color: #fff;
}

.iq-bg-success:hover {
  background-color: #3cc17d;
  color: #fff;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pagination styling */
.pagination {
  margin-bottom: 0;
}
</style>