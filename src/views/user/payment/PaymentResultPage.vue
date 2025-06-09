<template>
  <div class="payment-result">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-body text-center p-5">
              <div v-if="isProcessing" class="py-5">
                <LoadingComponent text="Đang xác thực giao dịch..." />
                <p class="text-muted">Vui lòng đợi trong giây lát</p>
              </div>

              <!-- thanh toan thanh cong -->
              <div v-else-if="paymentStatus === 'success'" class="">
                <div class="success-checkmark">
                  <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                  </div>
                </div>
                <h3 class="text-success mt-4">Thanh toán thành công!</h3>
                <p class="mb-4">
                  Cảm ơn bạn đã mua khóa học <strong>{{ orderDetails.courseName }}</strong>
                </p>

                <div class="payment-details p-3 bg-light rounded mb-4">
                  <div class="row mb-2">
                    <div class="col-6 text-start">Mã giao dịch:</div>
                    <div class="col-6 text-end">{{ paymentDetails.transactionId || 'N/A' }}</div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-6 text-start">Số tiền:</div>
                    <div class="col-6 text-end">{{ formatCurrency(orderDetails.amount) }}</div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-6 text-start">Phương thức:</div>
                    <div class="col-6 text-end">VNPay</div>
                  </div>
                  <div class="row">
                    <div class="col-6 text-start">Thời gian:</div>
                    <div class="col-6 text-end">{{ formatDate(paymentDetails.paymentDate) }}</div>
                  </div>
                </div>

                <p class="mt-4">Bạn đã có thể truy cập khóa học ngay bây giờ.</p>

                <div class="d-grid gap-2">
                  <router-link
                    :to="`/khoa-hoc/${orderDetails.courseId}`"
                    class="btn btn-primary mr-2"
                  >
                    Học ngay
                  </router-link>
                  <router-link to="/khoa-hoc-cua-toi" class="btn btn-outline-secondary">
                    Khóa học của tôi
                  </router-link>
                </div>
              </div>

              <!-- thanh toan that bai -->
              <div v-else-if="paymentStatus === 'failed'" class="py-4">
                <div class="error-circle">
                  <i class="fas fa-times"></i>
                </div>
                <h3 class="text-danger mt-4">Thanh toán không thành công</h3>
                <p class="mb-4">Rất tiếc, giao dịch của bạn không thể hoàn tất.</p>

                <div class="payment-details p-3 bg-light rounded mb-4">
                  <div class="row mb-2">
                    <div class="col-6 text-start">Lỗi:</div>
                    <div class="col-6 text-end">
                      {{ paymentDetails.errorMessage || 'Giao dịch bị từ chối' }}
                    </div>
                  </div>
                  <div class="row mb-2" v-if="paymentDetails.errorCode">
                    <div class="col-6 text-start">Mã lỗi:</div>
                    <div class="col-6 text-end">{{ paymentDetails.errorCode }}</div>
                  </div>
                </div>

                <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>

                <div class="d-grid gap-2">
                  <router-link
                    :to="`/dang-ky-khoa-hoc/${orderDetails.courseId}`"
                    class="btn btn-primary mr-2"
                  >
                    Thử lại
                  </router-link>
                  <router-link
                    :to="`/khoa-hoc/${orderDetails.courseId}`"
                    class="btn btn-outline-secondary"
                  >
                    Quay lại khóa học
                  </router-link>
                </div>
              </div>

              <!-- loading -->
              <div v-else-if="paymentStatus === 'pending'" class="py-4">
                <div class="pending-circle">
                  <i class="fas fa-clock"></i>
                </div>
                <h3 class="text-warning mt-4">Giao dịch đang xử lý</h3>
                <p class="mb-4">Giao dịch của bạn đang được xử lý. Vui lòng đợi trong giây lát.</p>

                <div class="d-grid gap-2 mt-4">
                  <button @click="checkPaymentStatus" class="btn btn-primary">
                    <i class="fas fa-sync-alt me-2"></i>Kiểm tra trạng thái
                  </button>
                  <router-link
                    :to="`/courses/${orderDetails.courseId}`"
                    class="btn btn-outline-secondary"
                  >
                    Quay lại khóa học
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import LoadingComponent from '@/components/LoadingComponent.vue'

const route = useRoute()
const router = useRouter()
const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API

const isProcessing = ref(true)
const paymentStatus = ref('')
const errorMessage = ref('')
const courseId = ref('')
const paymentDetails = reactive({})
const orderDetails = reactive({
  courseId: '',
  courseName: '',
  amount: 0,
  timestamp: '',
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const verifyPaymentViaApi = async () => {
  try {
    const response = await axios.get(`${rootAPI}/payments/payment-return`, {
      params: {
        ...route.query,
        courseId: orderDetails.courseId,
        courseName: orderDetails.courseName,
      },
    })

    if (response.data) {
      const result = response.data.data
      paymentStatus.value = result.success ? 'success' : 'failed'

      if (result.success) {
        courseId.value = orderDetails.courseId

        Object.assign(paymentDetails, {
          transactionId: result.transactionId || route.query.vnp_TxnRef,
          amount: result.amount || parseInt(route.query.vnp_Amount || 0) / 100,
          paymentDate: result.paymentDate || new Date().toISOString(),
          bankCode: result.bankCode || route.query.vnp_BankCode,
        })
      } else {
        errorMessage.value = result.errorMessage || 'Giao dịch không thành công'
      }
    } else {
      paymentStatus.value = 'failed'
      errorMessage.value = 'Không nhận được phản hồi từ server'
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    paymentStatus.value = 'failed'
    errorMessage.value = 'Có lỗi xảy ra khi xác thực giao dịch'
  } finally {
    isProcessing.value = false
  }
}

const checkPaymentStatus = async () => {
  isProcessing.value = true
  await verifyPaymentViaApi()
}

onMounted(async () => {
  const pendingPaymentStr = localStorage.getItem('pendingPayment')
  if (pendingPaymentStr) {
    try {
      const pendingPayment = JSON.parse(pendingPaymentStr)
      orderDetails.courseId = pendingPayment.courseId
      orderDetails.courseName = pendingPayment.courseName
      orderDetails.amount = pendingPayment.amount
      orderDetails.timestamp = pendingPayment.timestamp
    } catch (e) {
      console.error('Error parsing pending payment:', e)
    }
  }

  // Nếu có query params từ VNPay, xác thực giao dịch
  if (Object.keys(route.query).length > 0 && route.query.vnp_ResponseCode) {
    await verifyPaymentViaApi()

    // Nếu thanh toán thành công, xóa thông tin thanh toán tạm thời
    if (paymentStatus.value === 'success') {
      localStorage.removeItem('pendingPayment')
    }
  } else {
    if (orderDetails.courseId) {
      paymentStatus.value = 'pending'
    } else {
      router.push('/')
    }
    isProcessing.value = false
  }
})
</script>
  
  <style scoped>
.payment-result {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 40px;
}

/* Success checkmark animation */
.success-checkmark {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #4caf50;
}

.check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}

.check-icon::before,
.check-icon::after {
  content: '';
  height: 100px;
  position: absolute;
  background: #f8f9fa;
  transform: rotate(-45deg);
}

.icon-line {
  height: 5px;
  background-color: #4caf50;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

/* Error circle */
.error-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-circle .fas {
  font-size: 40px;
  color: #dc3545;
}

/* Pending circle */
.pending-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #ffc107;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-circle .fas {
  font-size: 32px;
  color: #ffc107;
}

.payment-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
}
</style>