<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="iq-card">
          <div class="iq-card-body">
            <div class="row align-items-center">
              <div class="col-lg-6 col-md-6">
                <img src="@/assets/images/logo-name-removebg-preview.png" class="img-fluid rounded" alt="About Us">
              </div>
              <div class="col-lg-6 col-md-6">
                <h2 class="mb-3">Về Chúng Tôi</h2>
                <p class="mb-4">
                  Chúng tôi là nền tảng học tập trực tuyến chuyên về lập trình và công nghệ. Sứ mệnh của chúng tôi là 
                  cung cấp kiến thức chất lượng cao, đa dạng và dễ tiếp cận với mọi người.
                </p>
                <p class="mb-4">
                  Với đội ngũ giảng viên giàu kinh nghiệm và nội dung khóa học được cập nhật liên tục, 
                  chúng tôi cam kết mang đến trải nghiệm học tập hiệu quả nhất cho người học.
                </p>
                <h4 class="mt-4 mb-3">Giá Trị Cốt Lõi</h4>
                <ul class="iq-timeline">
                  <li>
                    <div class="timeline-dots"></div>
                    <h6 class="float-left mb-1">Chất lượng</h6>
                    <small class="float-right mt-1">Cam kết chất lượng đào tạo</small>
                    <div class="d-inline-block w-100">
                      <p>Cung cấp nội dung học tập cập nhật và chất lượng cao</p>
                    </div>
                  </li>
                  <li>
                    <div class="timeline-dots"></div>
                    <h6 class="float-left mb-1">Đổi mới</h6>
                    <small class="float-right mt-1">Luôn cập nhật công nghệ mới</small>
                    <div class="d-inline-block w-100">
                      <p>Theo dõi và giới thiệu các công nghệ mới nhất trong ngành</p>
                    </div>
                  </li>
                  <li>
                    <div class="timeline-dots"></div>
                    <h6 class="float-left mb-1">Hỗ trợ</h6>
                    <small class="float-right mt-1">Đồng hành cùng người học</small>
                    <div class="d-inline-block w-100">
                      <p>Hỗ trợ người học trong suốt quá trình học tập và phát triển nghề nghiệp</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  document.title = "Về Chúng Tôi"
})
</script>

<style scoped>
.iq-timeline li {
  margin-bottom: 20px;
}
</style>