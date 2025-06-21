<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useAuthStore } from '@/stores/auth'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const router = useRouter()
const authStore = useAuthStore()

const myCourses = ref({})
const isLoading = ref(true)
const error = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const formatDuration = (duration) => {
  const totalDays = parseInt(duration)
  if (isNaN(totalDays) || totalDays <= 0) return 'Không giới hạn'

  const months = Math.floor(totalDays / 30)
  const days = totalDays % 30

  let result = ''
  if (months > 0) result += `${months} tháng`
  if (days > 0) result += `${months > 0 ? ' ' : ''}${days} ngày`

  return result || 'Thời hạn học đã hết vui lòng đăng ký lại'
}

const fetchMyCourses = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await axios.get(`${rootAPI}/users/courses`)
    myCourses.value = response.data.data.items || []
  } catch (err) {
    console.error('Failed to fetch my courses:', err)
    error.value = 'Không thể tải danh sách khóa học của bạn. Vui lòng thử lại.'
    myCourses.value = []
  } finally {
    isLoading.value = false
  }
}

const viewCourse = (courseId) => {
  router.push(`/khoa-hoc/${courseId}`)
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login?redirect=/khoa-hoc-cua-toi')
    return
  }

  fetchMyCourses()
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <section class="page-title-section">
      <div class="container">
        <div class="d-flex align-items-center">
          <!-- <button class="btn btn-outline-light me-3" @click="goBack">
            <i class="fas fa-arrow-left"></i> Quay lại
          </button> -->
          <h1 class="page-title mb-0">Khóa học của tôi</h1>
        </div>
      </div>
    </section>

    <section class="courses-section">
      <div class="container">
        <div v-show="isLoading" class="loading-container">
          <LoadingComponent text="Đang tải khóa học của bạn..." />
        </div>

        <div v-if="error" class="alert alert-danger my-4">
          {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchMyCourses">
            Thử lại
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="myCourses.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-graduation-cap fa-3x text-muted"></i>
          </div>
          <h3 class="mt-3">Bạn chưa đăng ký khóa học nào</h3>
          <p class="text-muted">
            Khám phá các khóa học chất lượng cao và bắt đầu hành trình học tập của bạn ngay hôm nay!
          </p>
          <router-link to="/khoa-hoc" class="btn btn-primary mt-3"> Đăng ký ngay </router-link>
        </div>

        <div v-show="!isLoading">
          <div class="row">
            <div v-for="course in myCourses" :key="course.id" class="col-md-4 mb-4">
              <div class="course-card" @click="viewCourse(course.id)">
                <div class="course-image">
                  <img
                    :src="course.thumbnailUrl || '/placeholder-course.jpg'"
                    :alt="course.name"
                    class="img-fluid rounded"
                  />
                </div>
                <div class="course-content">
                  <span class="course-category">{{ course.category?.name || 'Lập trình' }}</span>
                  <h5 class="course-title">{{ course.name }}</h5>
                  <div class="course-details">
                    <div class="course-progress" v-if="course.progressPercent !== undefined">
                      <div class="progress-container">
                        <div class="progress">
                          <div
                            class="progress-bar"
                            role="progressbar"
                            :style="{ width: `${course.progressPercent}%` }"
                            :aria-valuenow="course.progressPercent"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div class="progress-text">
                          <span>{{ course.progressPercent }}% hoàn thành</span>
                        </div>
                      </div>
                    </div>
                    <div class="course-meta">
                      <span><i class="fas fa-book"></i> {{ course.lessonCount || 0 }} bài học</span>
                      <span
                        ><i class="fas fa-clock"></i>Còn lại {{ formatDuration(course.duration) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Page Title Section */
.page-title-section {
  background: linear-gradient(135deg, #3f6ad8 0%, #0a2463 100%);
  padding: 30px 0;
  color: white;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
}

/* Courses Section */
.courses-section {
  padding: 0 0 60px 0;
}

/* Loading Container */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-state-icon {
  margin-bottom: 15px;
  color: #dee2e6;
}

/* Course Card */
.course-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.course-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-content {
  padding: 15px;
}

.course-category {
  display: inline-block;
  color: #6c757d;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.course-title {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.course-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.course-meta {
  display: flex;
  flex-direction: column;
}

.course-meta span {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 2px;
}

.course-meta i {
  margin-right: 5px;
  width: 14px;
  text-align: center;
}

.course-price {
  font-weight: 700;
  color: #3f6ad8;
  font-size: 1.1rem;
}

.free-badge {
  background-color: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Helper classes */
.me-3 {
  margin-right: 1rem !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.d-flex {
  display: flex !important;
}

.align-items-center {
  align-items: center !important;
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  max-width: 1200px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-4 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

/* Buttons */
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-outline-light {
  color: #f8f9fa;
  border-color: #f8f9fa;
}

.btn-outline-light:hover {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}

.btn-primary {
  color: #fff;
  background-color: #3f6ad8;
  border-color: #3f6ad8;
}

.btn-primary:hover {
  color: #fff;
  background-color: #2e59d1;
  border-color: #2653b9;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

/* Alert */
.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.my-4 {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
}

.ms-2 {
  margin-left: 0.5rem !important;
}

.text-muted {
  color: #6c757d !important;
}

@media (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

@media (max-width: 767.98px) {
  .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .course-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-price {
    margin-top: 10px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

/* Progress Bar */
.course-progress {
  padding: 10px 0;
  margin-bottom: 10px;
}

.progress-container {
  display: flex;
  flex-direction: column;
}

.progress {
  height: 8px;
  margin-bottom: 6px;
  border-radius: 4px;
  background-color: #e9ecef;
  overflow: hidden;
}

.progress-bar {
  background-color: #3f6ad8;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
  color: #6c757d;
}
</style>