<!-- Giả sử đây là Footer.vue hoàn chỉnh -->
<template>
  <footer class="footer-section">
    <div class="container">
      <div class="footer-content">
        <div class="row">
          <!-- Column 1: Logo & About -->
          <div class="col-md-4 mb-4">
            <div class="footer-logo mb-3">
              <img src="@/assets/images/logo-name.jpg" alt="Logo" height="40" />
            </div>
            <p class="footer-about">
              Nền tảng học tập trực tuyến chất lượng cao với đa dạng khóa học từ các giảng viên hàng
              đầu.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link"><i class="ri-facebook-fill"></i></a>
              <a href="#" class="social-link"><i class="ri-twitter-fill"></i></a>
              <a href="#" class="social-link"><i class="ri-linkedin-fill"></i></a>
              <a href="#" class="social-link"><i class="ri-youtube-fill"></i></a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="col-md-2 mb-4">
            <h5 class="footer-heading">Liên kết nhanh</h5>
            <ul class="footer-links">
              <li><router-link to="/khoa-hoc">Khóa học</router-link></li>
              <li><router-link to="/giang-vien">Giảng viên</router-link></li>
              <li><router-link to="/blog">Blog</router-link></li>
              <li><router-link to="/lien-he">Liên hệ</router-link></li>
            </ul>
          </div>

          <!-- Column 3: Categories -->
          <div class="col-md-2 mb-4">
            <h5 class="footer-heading">Danh mục</h5>
            <ul class="footer-links">
              <li><router-link to="/khoa-hoc?category=frontend">Frontend</router-link></li>
              <li><router-link to="/khoa-hoc?category=backend">Backend</router-link></li>
              <li><router-link to="/khoa-hoc?category=mobile">Mobile</router-link></li>
              <li><router-link to="/khoa-hoc?category=devops">DevOps</router-link></li>
            </ul>
          </div>

          <!-- Column 4: Legal -->
          <div class="col-md-2 mb-4">
            <h5 class="footer-heading">Thông tin pháp lý</h5>
            <ul class="footer-links">
              <li><router-link to="/chinh-sach-bao-mat">Chính sách bảo mật</router-link></li>
              <li><router-link to="/dieu-khoan-su-dung">Điều khoản sử dụng</router-link></li>
            </ul>
          </div>

          <!-- Column 5: Contact -->
          <div class="col-md-2 mb-4">
            <h5 class="footer-heading">Liên hệ</h5>
            <ul class="footer-contact">
              <li><i class="ri-mail-line"></i> mail@phhtruc.id.vn</li>
              <li><i class="ri-phone-line"></i> 0900 123 456</li>
              <li><i class="ri-map-pin-line"></i> An Khê, Thanh Thê, Đà Nẵng, Việt Nam</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <div class="row">
          <div class="col-md-12 text-center">
            <p class="mb-0">© {{ currentYear }} Học Tập Trực Tuyến. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'

// Get current year for copyright
const currentYear = new Date().getFullYear()
</script>
  
  <style scoped>
.footer-section {
  background-color: #f8f9fa;
  padding: 60px 0 20px;
  border-top: 1px solid #eaeaea;
}

.footer-content {
  margin-bottom: 30px;
}

.footer-heading {
  font-weight: 600;
  margin-bottom: 20px;
  color: #343a40;
  font-size: 1.1rem;
}

.footer-about {
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.footer-social {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #3f6ad8;
  color: white;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: #2b4fbf;
  transform: translateY(-3px);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3f6ad8;
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contact li {
  color: #6c757d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.footer-contact li i {
  margin-right: 10px;
  color: #3f6ad8;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.footer-bottom p {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>