<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <div class="iq-header-title">
              <h4 class="card-title">Điều Khoản Sử Dụng</h4>
            </div>
          </div>
          <div class="iq-card-body">
            <div class="terms-content">
              <p class="mb-0">Cập nhật lần cuối: {{ lastUpdated }}</p>

              <h5 class="mt-4">1. Giới thiệu</h5>
              <p>
                Chào mừng đến với {{ siteName }}! Truy cập và sử dụng nền tảng của chúng tôi có
                nghĩa là bạn đồng ý và tuân thủ các Điều khoản sử dụng này. Vui lòng đọc kỹ trước
                khi sử dụng dịch vụ của chúng tôi.
              </p>

              <h5 class="mt-4">2. Định nghĩa</h5>
              <ul>
                <li>
                  <strong>"Nền tảng"</strong> đề cập đến website và các ứng dụng của {{ siteName }}.
                </li>
                <li>
                  <strong>"Dịch vụ"</strong> đề cập đến các khóa học, tài liệu, và các tính năng
                  khác được cung cấp thông qua Nền tảng.
                </li>
                <li>
                  <strong>"Người dùng"</strong> đề cập đến bất kỳ cá nhân nào truy cập hoặc sử dụng
                  Nền tảng.
                </li>
                <li>
                  <strong>"Nội dung"</strong> đề cập đến tất cả tài liệu, thông tin, văn bản, hình
                  ảnh, video, âm thanh và dữ liệu khác xuất hiện trên Nền tảng.
                </li>
              </ul>

              <h5 class="mt-4">3. Đăng ký tài khoản</h5>
              <p>
                Để truy cập một số tính năng của Nền tảng, bạn cần đăng ký tài khoản. Khi đăng ký,
                bạn đồng ý:
              </p>
              <ul>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật.</li>
                <li>Giữ bí mật thông tin tài khoản và mật khẩu.</li>
                <li>Chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn.</li>
                <li>Thông báo ngay cho chúng tôi về bất kỳ vi phạm bảo mật nào.</li>
              </ul>
              <p>
                Chúng tôi có quyền khóa hoặc xóa tài khoản nếu phát hiện vi phạm các điều khoản này.
              </p>

              <h5 class="mt-4">4. Quyền và giới hạn người dùng</h5>
              <p>
                <strong>Quyền sử dụng:</strong> Chúng tôi cấp cho bạn quyền hạn chế, không độc quyền
                để:
              </p>
              <ul>
                <li>Truy cập và sử dụng Nền tảng cho mục đích học tập cá nhân.</li>
                <li>Tải xuống tài liệu được cấp phép cho việc sử dụng cá nhân.</li>
              </ul>

              <p><strong>Giới hạn:</strong> Bạn không được:</p>
              <ul>
                <li>Sao chép, phân phối lại, hoặc chia sẻ nội dung mà không có sự cho phép.</li>
                <li>Sử dụng Nền tảng cho mục đích thương mại mà không có giấy phép phù hợp.</li>
                <li>Cố gắng phá vỡ hoặc can thiệp vào hoạt động của Nền tảng.</li>
                <li>Tải lên hoặc truyền bất kỳ phần mềm độc hại nào.</li>
                <li>Thu thập thông tin hoặc dữ liệu về người dùng khác mà không được phép.</li>
              </ul>

              <h5 class="mt-4">5. Mua khóa học và thanh toán</h5>
              <p>Khi bạn mua khóa học hoặc dịch vụ trên Nền tảng của chúng tôi:</p>
              <ul>
                <li>Bạn đồng ý cung cấp thông tin thanh toán chính xác và đầy đủ.</li>
                <li>
                  Bạn hiểu rằng chúng tôi sử dụng các nhà cung cấp dịch vụ thanh toán bên thứ ba để
                  xử lý giao dịch.
                </li>
                <li>Tất cả giá đều được hiển thị bằng VND và đã bao gồm thuế (nếu có).</li>
                <li>
                  Một khi đã mua và truy cập nội dung khóa học, bạn không có quyền hoàn tiền trừ khi
                  được quy định trong chính sách hoàn tiền của chúng tôi.
                </li>
              </ul>

              <h5 class="mt-4">6. Chính sách hoàn tiền</h5>
              <p>Chúng tôi cung cấp chính sách hoàn tiền trong vòng 7 ngày nếu:</p>
              <ul>
                <li>Bạn chưa hoàn thành quá 25% khóa học.</li>
                <li>Có vấn đề nghiêm trọng về chất lượng khóa học không được giải quyết.</li>
                <li>Bạn không hài lòng với nội dung so với mô tả.</li>
              </ul>
              <p>
                Để yêu cầu hoàn tiền, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.
              </p>

              <h5 class="mt-4">7. Quyền sở hữu trí tuệ</h5>
              <p>
                Tất cả nội dung trên Nền tảng, bao gồm nhưng không giới hạn ở văn bản, hình ảnh,
                video, âm thanh, và mã máy tính, đều thuộc sở hữu của chúng tôi hoặc các đối tác cấp
                phép của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ. Bạn không được sao chép,
                phân phối, sửa đổi, trình diễn công khai, hoặc tạo các tác phẩm phái sinh từ nội
                dung này mà không có sự cho phép rõ ràng bằng văn bản.
              </p>

              <h5 class="mt-4">8. Nội dung do người dùng đóng góp</h5>
              <p>
                Khi bạn đăng tải, gửi, hoặc chia sẻ nội dung trên Nền tảng của chúng tôi, bạn vẫn
                giữ quyền sở hữu trí tuệ đối với nội dung đó, nhưng bạn cấp cho chúng tôi một giấy
                phép không độc quyền, có thể chuyển nhượng, không thu phí bản quyền, trên toàn thế
                giới để sử dụng, sao chép, sửa đổi, phân phối, và hiển thị nội dung đó liên quan đến
                việc cung cấp và quảng bá dịch vụ.
              </p>

              <p>
                Bạn đảm bảo rằng bạn có tất cả các quyền cần thiết để cấp giấy phép này và nội dung
                bạn đóng góp không vi phạm quyền của bên thứ ba.
              </p>

              <h5 class="mt-4">9. Hành vi bị cấm</h5>
              <p>Bạn không được sử dụng Nền tảng để:</p>
              <ul>
                <li>
                  Đăng nội dung trái pháp luật, xúc phạm, đe dọa, lạm dụng, quấy rối, phỉ báng, hoặc
                  vi phạm quyền riêng tư của người khác.
                </li>
                <li>
                  Giả mạo danh tính hoặc xuyên tạc mối quan hệ của bạn với bất kỳ cá nhân hoặc tổ
                  chức nào.
                </li>
                <li>Quảng cáo hoặc quảng bá sản phẩm và dịch vụ không được phép.</li>
                <li>
                  Thu thập hoặc lưu trữ thông tin cá nhân về người dùng khác mà không có sự đồng ý
                  của họ.
                </li>
                <li>Can thiệp hoặc làm gián đoạn hoạt động của Nền tảng hoặc máy chủ.</li>
              </ul>

              <h5 class="mt-4">10. Tính khả dụng và thay đổi dịch vụ</h5>
              <p>
                Chúng tôi nỗ lực đảm bảo Nền tảng luôn sẵn sàng, nhưng không đảm bảo rằng Nền tảng
                sẽ luôn sẵn sàng, không bị gián đoạn hoặc không có lỗi. Chúng tôi có thể thay đổi,
                đình chỉ hoặc ngừng cung cấp bất kỳ phần nào của Dịch vụ mà không cần thông báo
                trước.
              </p>

              <h5 class="mt-4">11. Miễn trừ trách nhiệm</h5>
              <p>
                Nền tảng và tất cả nội dung, chức năng được cung cấp "nguyên trạng", "như sẵn có" mà
                không có bảo đảm dưới bất kỳ hình thức nào. Chúng tôi không đảm bảo rằng Nền tảng sẽ
                không bị gián đoạn, an toàn, không có lỗi, hoặc không có virus hay thành phần có hại
                khác.
              </p>

              <h5 class="mt-4">12. Giới hạn trách nhiệm</h5>
              <p>
                Trong phạm vi tối đa được pháp luật cho phép, chúng tôi sẽ không chịu trách nhiệm
                pháp lý đối với bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, hậu quả, đặc biệt
                hoặc trừng phạt nào phát sinh từ hoặc liên quan đến việc sử dụng hoặc không thể sử
                dụng Nền tảng, bất kể nguyên nhân hoặc lý thuyết trách nhiệm.
              </p>

              <h5 class="mt-4">13. Bồi thường</h5>
              <p>
                Bạn đồng ý bảo vệ, bồi thường và giữ cho chúng tôi và các đối tác, nhân viên, đại lý
                của chúng tôi không bị tổn hại từ bất kỳ khiếu nại, tổn thất, chi phí, thiệt hại và
                chi phí nào (bao gồm cả phí luật sư hợp lý) phát sinh từ việc bạn vi phạm các Điều
                khoản này hoặc sử dụng Nền tảng.
              </p>

              <h5 class="mt-4">14. Luật áp dụng</h5>
              <p>
                Các Điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp Việt Nam, không
                áp dụng các nguyên tắc xung đột pháp luật. Mọi tranh chấp phát sinh từ hoặc liên
                quan đến các Điều khoản này sẽ được đệ trình để giải quyết duy nhất bởi các tòa án
                có thẩm quyền ở Việt Nam.
              </p>

              <h5 class="mt-4">15. Thay đổi điều khoản</h5>
              <p>
                Chúng tôi có thể cập nhật các Điều khoản này theo thời gian mà không cần thông báo
                trước. Việc bạn tiếp tục sử dụng Nền tảng sau khi những thay đổi được đăng tải đồng
                nghĩa với việc bạn chấp nhận các điều khoản mới.
              </p>

              <h5 class="mt-4">16. Liên hệ</h5>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng này, vui lòng liên hệ với chúng
                tôi tại:
              </p>
              <address>
                <strong>{{ companyName }}</strong
                ><br />
                Email: {{ contactEmail }}<br />
                Địa chỉ: {{ companyAddress }}<br />
                Điện thoại: {{ companyPhone }}
              </address>

              <p class="mt-4">
                Bằng cách sử dụng Nền tảng của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng
                ý với các Điều khoản sử dụng này.
              </p>
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
  document.title = 'Điều khoản sử dụng'
})
</script>
  
  <style scoped>
.terms-content {
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