<template>
  <div class="checkout-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="mb-0">Thông tin thanh toán</h5>
            </div>
            <div class="card-body">
              <div class="course-info mb-4">
                <div class="d-flex align-items-center">
                  <div class="course-image me-3">
                    <img
                      :src="course.thumbnailUrl || '/images/default-course.jpg'"
                      alt="Course thumbnail"
                      class="img-fluid rounded"
                      width="120"
                    />
                  </div>
                  <div class="course-details">
                    <h5 class="course-title">{{ course.name }}</h5>
                    <div class="d-flex align-items-center">
                      <div class="course-duration ms-3">
                        <i class="far fa-clock text-muted"></i>
                        <span>Thời hạn {{ course.duration || '10 giờ' }} tháng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h6 class="mb-3">Chọn phương thức thanh toán</h6>
              <div class="payment-methods">
                <div class="form-check payment-method mb-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="vnpay"
                    name="paymentMethod"
                    value="vnpay"
                    v-model="paymentMethod"
                  />
                  <label class="form-check-label" for="vnpay">
                    <img
                      src="@/assets/images/vnpay.png"
                      alt="VNPay"
                      height="30"
                    />
                    <span class="ms-2">Thanh toán qua VNPay (ATM/VISA/QR Code)</span>
                  </label>
                </div>

                <div class="form-check payment-method mb-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="bank-transfer"
                    name="paymentMethod"
                    value="bank"
                    v-model="paymentMethod"
                    disabled
                  />
                  <label class="form-check-label" for="bank-transfer">
                    <i class="fas fa-university"></i>
                    <span class="ms-2">Chuyển khoản ngân hàng (Coming soon)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Thông tin đơn hàng</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Giá khóa học</span>
                <span>{{ formatCurrency(course.price) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2" v-if="course.discount > 0">
                <span>Giảm giá</span>
                <span>-{{ formatCurrency(course.discount) }}</span>
              </div>
              <hr />
              <div class="d-flex justify-content-between mb-3">
                <strong>Tổng thanh toán</strong>
                <strong class="text-primary">{{ formatCurrency(course.price) }}</strong>
              </div>

              <button
                class="btn btn-primary btn-lg w-100"
                @click="proceedToPayment"
                :class="{ 'btn-loading': isProcessing }"
              >
                <span v-if="isProcessing">
                  <i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...
                </span>
                <span v-else> Tiến hành thanh toán </span>
              </button>

              <div class="payment-security mt-3 text-center">
                <small class="text-muted">
                  <i class="fas fa-lock me-1"></i>
                  Giao dịch được bảo mật bởi VNPay
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true,
  }
})

const course = ref({
  id: props.courseId,
  name: props.courseName,
  price: props.coursePrice,
})

const paymentMethod = ref('vnpay')
const isProcessing = ref(false)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const proceedToPayment = async () => {

  isProcessing.value = true

  try {
    const response = await axios.post(`${rootAPI}/payments/create-payment-url`, {
      courseId: props.courseId,
      amount: course.value.price,
      language: 'vn',
    })

    const payment = response.data.data;

    if (payment.paymentUrl) {
      localStorage.setItem('pendingPayment', JSON.stringify({
        courseId: props.courseId,
        courseName: course.value.name || 'Khóa học',
        amount: payment.amount,
        txnRef: payment.txnRef || '',
        timestamp: new Date().toISOString()
      }));

      window.location.href = payment.paymentUrl;
    } else {
      throw new Error('Không nhận được URL thanh toán từ server');
    }
  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại sau.');
    isProcessing.value = false;
  }
}

const fetchCourse = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${props.courseId}`)
    course.value = { ...course.value, ...response.data.data }
  } catch (error) {
    console.error('Error fetching course:', error)
  }
}

onMounted(async () => {
  await fetchCourse()
})
</script>
  
  <style scoped>
.checkout-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.payment-method {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  position: relative;
}

.payment-method input {
  position: absolute;
  top: 20px;
  left: 15px;
}

.payment-method label {
  display: block;
  padding-left: 25px;
  cursor: pointer;
  width: 100%;
}

.payment-method:hover {
  background-color: #f8f9fa;
}

.btn-loading {
  opacity: 0.8;
  cursor: not-allowed;
}

/* Modal styles */
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>