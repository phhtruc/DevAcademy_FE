<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const featuredCourses = ref([])
const categories = ref([])
const isActive = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const categoryIconMap = {
  frontend: 'ri-layout-line',
  backend: 'ri-server-line',
  fullstack: 'ri-code-box-line',
  mobile: 'ri-smartphone-line',
  devops: 'ri-cloud-line',
  database: 'ri-database-2-line',
  datascience: 'ri-bar-chart-box-line',
  ai: 'ri-brain-line',
  blockchain: 'ri-link-m',
  vue: 'ri-vuejs-line',
  react: 'ri-reactjs-line',
  angular: 'ri-angularjs-line',
  java: 'ri-code-s-slash-line',
  python: 'ri-code-s-slash-line',
  default: 'ri-code-line',
}

const getCategoryIcon = (categoryName) => {
  const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '')
  return categoryIconMap[normalizedName] || categoryIconMap.default
}

const getCategoryClass = (category) => {
  const categoryMap = {
    Frontend: 'badge-primary',
    Backend: 'badge-success',
    fullstack: 'badge-danger',
    mobile: 'badge-warning',
    devops: 'badge-info',
  }
  return categoryMap[category] || 'badge-secondary'
}

const fetchCourses = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/user`, {
      params: {
        page: 1,
        pageSize: 3,
      },
    })
    featuredCourses.value = response.data.data.items
  } catch (error) {
    console.error('Error fetching courses', error)
  }
}

const fetchCategory = async () => {
  try {
    const response = await axios.get(`${rootAPI}/categories`, {
      params: {
        page: 1,
        pageSize: 30,
      },
    })
    const categoriesData = response.data.data.items.map((cat) => ({
      ...cat,
      icon: getCategoryIcon(cat.name),
      courseCount: Math.floor(Math.random() * 10) + 1,
    }))
    categories.value = categoriesData.slice(0, 8)
  } catch (error) {
    console.error('Error fetching', error)
  }
}

onMounted(() => {
  fetchCourses()
  fetchCategory()
  if (localStorage.getItem('roles') === '[USER]') {
    isActive.value = true
  }
})
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="hero-title">
              Học lập trình <span class="text-primary">dễ dàng</span> và
              <span class="text-primary">hiệu quả</span>
            </h1>
            <p class="hero-subtitle">
              Khám phá các khóa học chất lượng cao từ các giảng viên hàng đầu giúp bạn tiến bộ nhanh
              chóng
            </p>
            <div class="hero-buttons">
              <router-link v-if="!isActive" to="/register" class="btn btn-primary btn-lg mr-3"
                >Đăng ký ngay</router-link
              >
              <router-link to="/khoa-hoc" class="btn btn-outline-primary btn-lg"
                >Xem khóa học</router-link
              >
            </div>
          </div>
          <div class="col-lg-6">
            <img
              src="@/assets/images/logo-name-removebg-preview.png"
              alt="Hero illustration"
              class="img-fluid hero-image"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="featured-courses-section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Khóa học nổi bật</h2>
          <p class="section-subtitle">
            Những khóa học được yêu thích nhất trên nền tảng của chúng tôi
          </p>
        </div>

        <div class="row">
          <div v-for="course in featuredCourses" :key="course.id" class="col-md-4 mb-4">
            <div class="iq-card course-card d-flex flex-column h-100">
              <div class="course-image">
                <img :src="course.thumbnailUrl" :alt="course.name" class="img-fluid" />
              </div>
              <div class="iq-card-body d-flex flex-column flex-grow-1">
                <div class="d-flex align-items-center mb-2">
                  <span class="badge" :class="getCategoryClass(course.category?.name || 'other')">
                    {{ course.category?.name || 'Chưa phân loại' }}
                  </span>
                  <div class="ms-auto">
                    <span class="tech-stacks">
                      <span v-for="tech in course.techStacks" :key="tech.id" class="tech-badge">
                        {{ tech.name }}
                      </span>
                    </span>
                  </div>
                </div>
                <h5 class="course-title">{{ course.name }}</h5>
                <p class="course-description flex-grow-1">{{ course.description }}</p>

                <div class="mt-auto">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="course-meta">
                      <span><i class="fas fa-book"></i> {{ course.lessonCount || 0 }} bài học</span>
                      <span
                        ><i class="fas fa-clock"></i>Thời hạn
                        {{ course.duration || 'N/A' }} tháng</span
                      >
                    </div>
                    <div class="course-price">{{ formatPrice(course.price) }}</div>
                  </div>
                  <div class="mt-3">
                    <router-link
                      :to="`/khoa-hoc/${course.id}`"
                      class="btn btn-outline-primary btn-sm w-100"
                    >
                      Xem chi tiết
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <router-link to="/khoa-hoc" class="btn btn-primary">Xem tất cả khóa học</router-link>
        </div>
      </div>
    </section>

    <section class="categories-section bg-light">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Danh mục khóa học</h2>
          <p class="section-subtitle">Khám phá đa dạng các lĩnh vực công nghệ</p>
        </div>
        <div class="row">
          <div v-for="category in categories" :key="category.id" class="col-md-3 col-6 mb-4">
            <div class="iq-card category-card text-center">
              <div class="iq-card-body">
                <div class="category-icon mb-3">
                  <i :class="category.icon" class="ri-3x"></i>
                </div>
                <h5 class="category-title">{{ category.name }}</h5>
                <p class="category-count">{{ category.courseCount }} khóa học</p>
                <router-link
                  :to="`/courses?category=${category.id}`"
                  class="stretched-link"
                ></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="why-us-section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Tại sao chọn chúng tôi</h2>
          <p class="section-subtitle">Những lý do khiến hàng ngàn học viên tin tưởng</p>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="ri-book-open-line ri-3x text-primary"></i>
              </div>
              <h4 class="feature-title">Nội dung chất lượng</h4>
              <p class="feature-desc">
                Các khóa học được thiết kế bởi các chuyên gia hàng đầu trong ngành với nội dung cập
                nhật liên tục.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="ri-user-star-line ri-3x text-primary"></i>
              </div>
              <h4 class="feature-title">Giảng viên giàu kinh nghiệm</h4>
              <p class="feature-desc">
                Đội ngũ giảng viên có nhiều năm kinh nghiệm trong giảng dạy và làm việc thực tế.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="ri-customer-service-2-line ri-3x text-primary"></i>
              </div>
              <h4 class="feature-title">Hỗ trợ 24/7</h4>
              <p class="feature-desc">
                Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn trong quá trình học tập.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="iq-card cta-card bg-primary text-white">
          <div class="iq-card-body">
            <div class="row align-items-center">
              <div class="col-lg-8">
                <h2 class="cta-title">Bắt đầu hành trình học tập của bạn ngay hôm nay</h2>
                <p class="cta-text">
                  Đăng ký tài khoản để trải nghiệm các khóa học chất lượng cao và nâng cao kỹ năng
                  lập trình của bạn.
                </p>
              </div>
              <div class="col-lg-4 text-lg-right mt-3 mt-lg-0">
                <router-link v-if="!isActive" to="/register" class="btn btn-light btn-lg"
                  >Đăng ký miễn phí</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Section Styles */
.hero-section {
  padding: 80px 0;
  background: linear-gradient(to right, #ffffff, #f5f9ff);
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.hero-buttons {
  margin-bottom: 2rem;
}

.hero-image {
  max-width: 100%;
  animation: float 6s ease-in-out infinite;
}

/* Section Styles */
.section-header {
  margin-bottom: 50px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
}

/* Course Card Styles */
.featured-courses-section {
  padding: 70px 0;
}

.course-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.course-image {
  height: 180px; /* Chiều cao cố định cho container */
  overflow: hidden; /* Ẩn phần vượt quá */
}

.course-image img {
  width: 100%;
  height: 100%; /* Chiều cao 100% của container cha */
  object-fit: cover; /* Đảm bảo ảnh khớp và cắt đều */
}

.iq-card-body {
  padding: 20px;
}

.course-title {
  font-weight: 600;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  min-height: 44px;
}

.course-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.badge {
  padding: 0.5rem 0.8rem;
  font-weight: 500;
}

.badge-primary {
  background-color: #3f6ad8;
  color: white;
}
.badge-success {
  background-color: #3ac47d;
  color: white;
}
.badge-danger {
  background-color: #d92550;
  color: white;
}
.badge-warning {
  background-color: #f7b924;
  color: white;
}
.badge-info {
  background-color: #16aaff;
  color: white;
}
.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.tech-stacks {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tech-badge {
  background-color: #e9ecef;
  color: #495057;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.course-meta {
  color: #6c757d;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
}

.course-meta i {
  margin-right: 5px;
}

.course-price {
  font-weight: 700;
  color: #3f6ad8;
}

.ms-auto {
  margin-left: auto !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.h-100 {
  height: 100% !important;
}

.flex-grow-1 {
  flex-grow: 1 !important;
}

.mt-auto {
  margin-top: auto !important;
}

.pt-3 {
  padding-top: 1rem !important;
}

/* Category Card Styles */
.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.category-icon {
  color: #3f6ad8;
}

.category-title {
  font-weight: 600;
}

.category-count {
  color: #6c757d;
  font-size: 0.9rem;
}

/* Feature Item Styles */
.feature-item {
  padding: 20px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  color: #3f6ad8;
}

.feature-title {
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-desc {
  color: #6c757d;
}

/* Testimonial Card Styles */
.testimonial-card {
  height: 100%;
  border-radius: 10px;
}

.testimonial-text {
  font-style: italic;
  line-height: 1.7;
}

/* CTA Section Styles */
.cta-section {
  padding: 60px 0;
}

.cta-card {
  border-radius: 15px;
  border: none;
}

.cta-title {
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  max-width: 80%;
}

.tech-stacks {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tech-badge {
  background-color: #e9ecef;
  color: #495057;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.course-meta {
  color: #6c757d;
  font-size: 0.85rem;
}

.course-meta i {
  margin-right: 5px;
}

.course-price {
  font-weight: 700;
  color: #3f6ad8;
}

.ml-auto {
  margin-left: auto !important;
}

/* Animation */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .cta-text {
    max-width: 100%;
  }
}
</style>