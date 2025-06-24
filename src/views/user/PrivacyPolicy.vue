<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <div class="iq-header-title">
              <h4 class="card-title">Chính Sách Bảo Mật</h4>
            </div>
          </div>
          <div class="iq-card-body">
            <div class="privacy-content">
              <p class="mb-0">Cập nhật lần cuối: {{ lastUpdated }}</p>

              <h5 class="mt-4">1. Giới thiệu</h5>
              <p>
                Chào mừng bạn đến với {{ siteName }}! Chúng tôi cam kết bảo vệ thông tin cá nhân và
                sự riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử
                dụng, tiết lộ và bảo vệ thông tin của bạn khi bạn sử dụng nền tảng của chúng tôi.
              </p>

              <h5 class="mt-4">2. Thông tin chúng tôi thu thập</h5>
              <p>
                <strong>Thông tin cá nhân:</strong> Khi bạn đăng ký tài khoản, chúng tôi có thể thu
                thập các thông tin sau:
              </p>
              <ul>
                <li>Họ tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Thông tin thanh toán</li>
                <li>Thông tin hồ sơ (như ảnh đại diện, tiểu sử)</li>
              </ul>

              <p>
                <strong>Thông tin sử dụng:</strong> Chúng tôi thu thập thông tin về cách bạn tương
                tác với nền tảng của chúng tôi, bao gồm:
              </p>
              <ul>
                <li>Khóa học bạn truy cập và hoàn thành</li>
                <li>Thời gian bạn dành cho mỗi bài học</li>
                <li>Điểm số trong các bài kiểm tra</li>
                <li>Tương tác với giảng viên và học viên khác</li>
              </ul>

              <p>
                <strong>Thông tin kỹ thuật:</strong> Chúng tôi tự động thu thập một số thông tin kỹ
                thuật, bao gồm:
              </p>
              <ul>
                <li>Địa chỉ IP</li>
                <li>Loại thiết bị và trình duyệt</li>
                <li>Thông tin cookie và công nghệ theo dõi khác</li>
              </ul>

              <h5 class="mt-4">3. Cách chúng tôi sử dụng thông tin</h5>
              <p>Chúng tôi sử dụng thông tin của bạn để:</p>
              <ul>
                <li>Cung cấp, duy trì và cải thiện nền tảng học tập của chúng tôi</li>
                <li>Xử lý thanh toán và giao dịch</li>
                <li>Gửi thông báo về khóa học, hoạt động tài khoản và các cập nhật</li>
                <li>Cá nhân hóa trải nghiệm học tập của bạn</li>
                <li>Phân tích việc sử dụng để cải thiện nền tảng</li>
                <li>Ngăn chặn gian lận và bảo vệ an ninh của nền tảng</li>
                <li>Tuân thủ các nghĩa vụ pháp lý</li>
              </ul>

              <h5 class="mt-4">4. Chia sẻ thông tin</h5>
              <p>Chúng tôi có thể chia sẻ thông tin của bạn với:</p>
              <ul>
                <li>
                  <strong>Giảng viên:</strong> Khi bạn đăng ký khóa học, giảng viên có thể truy cập
                  tên, thông tin liên hệ và tiến độ học tập của bạn.
                </li>
                <li>
                  <strong>Nhà cung cấp dịch vụ:</strong> Chúng tôi làm việc với bên thứ ba cung cấp
                  dịch vụ như thanh toán, phân tích và hỗ trợ khách hàng.
                </li>
                <li>
                  <strong>Đối tác kinh doanh:</strong> Khi cần thiết để cung cấp dịch vụ bạn yêu
                  cầu.
                </li>
                <li>
                  <strong>Cơ quan pháp luật:</strong> Khi cần thiết để tuân thủ pháp luật, quy trình
                  pháp lý, hoặc yêu cầu từ cơ quan chính phủ.
                </li>
              </ul>

              <p>Chúng tôi sẽ không bán thông tin cá nhân của bạn cho bên thứ ba.</p>

              <h5 class="mt-4">5. Bảo mật dữ liệu</h5>
              <p>
                Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn khỏi
                truy cập, sử dụng hoặc tiết lộ trái phép. Các biện pháp này bao gồm:
              </p>
              <ul>
                <li>Mã hóa dữ liệu nhạy cảm</li>
                <li>Bảo vệ bằng mật khẩu</li>
                <li>Giới hạn truy cập vào thông tin cá nhân</li>
                <li>Sao lưu dữ liệu thường xuyên</li>
              </ul>

              <p>
                Tuy nhiên, không có phương thức truyền tải qua internet hoặc lưu trữ điện tử nào là
                100% an toàn. Do đó, chúng tôi không thể đảm bảo bảo mật tuyệt đối.
              </p>

              <h5 class="mt-4">6. Cookie và công nghệ tương tự</h5>
              <p>
                Chúng tôi sử dụng cookie và công nghệ tương tự để thu thập thông tin về hoạt động
                duyệt web của bạn và ghi nhớ tùy chọn của bạn. Bạn có thể cài đặt trình duyệt để từ
                chối tất cả hoặc một số cookie, hoặc để cảnh báo khi cookie được gửi. Tuy nhiên, nếu
                bạn không chấp nhận cookie, một số tính năng của nền tảng có thể không hoạt động
                đúng.
              </p>

              <h5 class="mt-4">7. Quyền của bạn</h5>
              <p>Tùy thuộc vào luật pháp địa phương, bạn có thể có các quyền sau:</p>
              <ul>
                <li>Truy cập thông tin cá nhân của bạn</li>
                <li>Chỉnh sửa thông tin không chính xác</li>
                <li>Xóa thông tin của bạn</li>
                <li>Hạn chế hoặc phản đối việc xử lý thông tin</li>
                <li>Di chuyển dữ liệu của bạn</li>
                <li>Rút lại sự đồng ý</li>
              </ul>

              <p>
                Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi theo thông tin bên dưới.
              </p>

              <h5 class="mt-4">8. Thông tin của trẻ em</h5>
              <p>
                Nền tảng của chúng tôi không dành cho người dưới 16 tuổi. Chúng tôi không cố ý thu
                thập thông tin từ trẻ em dưới 16 tuổi. Nếu bạn là phụ huynh hoặc người giám hộ và
                tin rằng con bạn đã cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ để
                chúng tôi có thể thực hiện các bước thích hợp.
              </p>

              <h5 class="mt-4">9. Thay đổi chính sách</h5>
              <p>
                Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Nếu có thay đổi
                quan trọng, chúng tôi sẽ thông báo cho bạn thông qua email hoặc thông báo trên nền
                tảng. Chúng tôi khuyến khích bạn xem xét chính sách này định kỳ để biết thông tin
                mới nhất về cách chúng tôi bảo vệ thông tin của bạn.
              </p>

              <h5 class="mt-4">10. Liên hệ</h5>
              <p>
                Nếu bạn có câu hỏi hoặc quan ngại về Chính sách Bảo mật này hoặc việc xử lý dữ liệu
                của chúng tôi, vui lòng liên hệ:
              </p>
              <address>
                <strong>{{ companyName }}</strong
                ><br />
                Email: {{ contactEmail }}<br />
                Địa chỉ: {{ companyAddress }}<br />
                Điện thoại: {{ companyPhone }}
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'

// Thiết lập các thông tin của website
const lastUpdated = ref('01/08/2023')
const siteName = ref('Học Lập Trình Trực Tuyến')
const companyName = ref('Công ty TNHH Dev Academy')
const contactEmail = ref('mail@phhtruc.id.vn')
const companyAddress = ref('An Khê, Thanh Khê, Đà Nẵng, Việt Nam')
const companyPhone = ref('0900 123 456')

onMounted(() => {
  document.title = 'Chính sách bảo mật'
})
</script>
  
  <style scoped>
.privacy-content {
  font-size: 1rem;
  line-height: 1.6;
}

h5 {
  color: #333;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

ul {
  margin-bottom: 1.5rem;
}

ul li {
  margin-bottom: 0.5rem;
}

address {
  margin-top: 1rem;
  line-height: 1.6;
}
</style>