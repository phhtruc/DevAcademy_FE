<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import LoadingComponent from '@/components/LoadingComponent.vue'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const route = useRoute()

const courses = ref([])

const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(12)

const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(true)
const categories = ref([])

const fetchCourses = async () => {
  isLoading.value = true
  try {
    let response = null

    if (searchQuery.value || selectedCategory.value) {
      response = await axios.get(`${rootAPI}/courses/search`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
          name: searchQuery.value || undefined,
          categoryId: selectedCategory.value || undefined,
        },
      })
    } else {
      response = await axios.get(`${rootAPI}/courses/user`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
        },
      })
    }
    courses.value = response.data.data.items
    totalPages.value = response.data.data.totalPage
  } catch (err) {
    console.error('Failed to fetch courses:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchCategory = async () => {
  try {
    const response = await axios.get(`${rootAPI}/categories`)
    categories.value = response.data.data.items
  } catch (error) {
    console.error('Error fetching', error)
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchCourses()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
  fetchCourses()
}

const viewCourse = (courseId) => {
  router.push(`/khoa-hoc/${courseId}`)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const paginationArray = computed(() => {
  const result = []
  const maxVisiblePages = 5

  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      result.push(i)
    }
  } else {
    result.push(1)

    let start = Math.max(2, currentPage.value - 1)
    let end = Math.min(totalPages.value - 1, currentPage.value + 1)

    if (currentPage.value <= 2) {
      end = 4
    } else if (currentPage.value >= totalPages.value - 2) {
      start = totalPages.value - 3
    }

    if (start > 2) {
      result.push('...')
    }

    for (let i = start; i <= end; i++) {
      result.push(i)
    }

    if (end < totalPages.value - 1) {
      result.push('...')
    }

    result.push(totalPages.value)
  }

  return result
})

onMounted(() => {
  fetchCourses()
  fetchCategory()

  if (route.query.categoryId) {
    selectedCategory.value = route.query.categoryId
    applyFilters()
  }
})

watch([selectedCategory], () => {
  applyFilters()
})

watch(
  () => route.query.categoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      selectedCategory.value = newCategoryId
      applyFilters()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <section class="page-title-section">
      <div class="container">
        <h1 class="page-title">Tất cả khóa học</h1>
        <p class="page-description">
          Khám phá các khóa học chất lượng cao từ các giảng viên hàng đầu
        </p>
      </div>
    </section>

    <section class="courses-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-3">
            <div class="filters-sidebar">
              <div class="search-box mb-4">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm khóa học..."
                  v-model="searchQuery"
                  @keyup.enter="applyFilters"
                />
                <button class="btn btn-primary search-btn" @click="applyFilters">
                  <i class="fas fa-search"></i>
                </button>
              </div>

              <div class="filter-group">
                <h5>Danh mục</h5>
                <div class="form-group">
                  <select class="form-control" v-model="selectedCategory">
                    <option value="">Tất cả</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <button class="btn btn-outline-primary btn-block mt-4" @click="resetFilters">
                Xóa bộ lọc
              </button>
            </div>
          </div>

          <!-- Courses Grid -->
          <div class="col-lg-9">
            <!-- Loading State -->
            <div v-if="isLoading" class="loading-container">
              <LoadingComponent text="Đang tải danh sách khóa học..." />
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger my-4">
              {{ error }}
              <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchCourses">
                Thử lại
              </button>
            </div>

            <!-- Empty State -->
            <div v-else-if="courses.length === 0" class="empty-state my-5">
              <div class="empty-state-icon">
                <i class="fas fa-search fa-3x text-muted"></i>
              </div>
              <h3 class="mt-3">Không tìm thấy khóa học nào</h3>
              <p class="text-muted">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
              <button class="btn btn-primary mt-3" @click="resetFilters">
                Xem tất cả khóa học
              </button>
            </div>

            <!-- Courses Grid -->
            <div v-else>
              <div class="row">
                <div v-for="course in courses" :key="course.id" class="col-md-4 mb-4">
                  <div class="course-card" @click="viewCourse(course.id)">
                    <div class="course-image">
                      <img
                        :src="course.thumbnailUrl || '/placeholder-course.jpg'"
                        :alt="course.name"
                        class="img-fluid rounded"
                      />
                      <!-- <div class="course-badge" :class="`level-${course.level || 'beginner'}`">
                        {{
                          levels.find((l) => l.id === (course.level || 'beginner'))?.name ||
                          'Cơ bản'
                        }}
                      </div> -->
                    </div>
                    <div class="course-content">
                      <span class="course-category">{{
                        course.category?.name || 'Lập trình'
                      }}</span>
                      <h5 class="course-title">{{ course.name }}</h5>
                      <div class="course-details">
                        <div class="course-meta">
                          <span
                            ><i class="fas fa-book"></i> {{ course.lessonCount || 0 }} bài học</span
                          >
                          <span
                            ><i class="fas fa-clock"></i> Thời hạn
                            {{ course.duration || '0h' }} tháng</span
                          >
                        </div>
                        <div class="course-price">
                          <span v-if="course.price > 0">{{ formatPrice(course.price) }}</span>
                          <span v-else class="free-badge">Miễn phí</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <nav aria-label="Page navigation" class="courses-pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Previous"
                      @click.prevent="currentPage > 1 && (currentPage--, fetchCourses())"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>

                  <li
                    v-for="page in paginationArray"
                    :key="page"
                    class="page-item"
                    :class="{
                      active: page === currentPage,
                      disabled: page === '...',
                    }"
                  >
                    <a
                      v-if="page !== '...'"
                      class="page-link"
                      href="#"
                      @click.prevent=";(currentPage = page), fetchCourses()"
                    >
                      {{ page }}
                    </a>
                    <span v-else class="page-link">{{ page }}</span>
                  </li>

                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Next"
                      @click.prevent="currentPage < totalPages && (currentPage++, fetchCourses())"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
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
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
}

.page-description {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.9;
}

/* Courses Section */
.courses-section {
  padding: 0 0 60px 0;
}

/* Filters Sidebar */
.filters-sidebar {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 90px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group h5 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.search-box {
  position: relative;
}

.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
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

.course-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.level-beginner {
  background-color: #28a745;
}

.level-intermediate {
  background-color: #fd7e14;
}

.level-advanced {
  background-color: #dc3545;
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

.course-rating {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.stars {
  margin-right: 5px;
}

.rating-count {
  font-size: 0.8rem;
  color: #6c757d;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state-icon {
  margin-bottom: 15px;
  color: #dee2e6;
}

/* Pagination */
.courses-pagination {
  margin-top: 40px;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .filters-sidebar {
    position: static;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .course-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-price {
    margin-top: 10px;
  }
}
</style>