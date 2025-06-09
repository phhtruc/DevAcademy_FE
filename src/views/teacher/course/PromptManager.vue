<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const prompts = ref([])
const router = useRouter()
const route = useRoute()

const showModal = ref(false)
const isEditing = ref(false)
const currentPrompt = reactive({
  id: null,
  contentStruct: '',
  isActive: false,
})

const isDeleteModalVisible = ref(false)
const promptToDelete = ref(null)
const idCourse = route.params.idCourse
const errorMessage = ref('')

const fetchPrompts = async () => {
  try {
    const response = await axios.get(`${rootAPI}/prompts`, {
      params: {
        courseId: idCourse,
      },
    })
    prompts.value = response.data.data.items
  } catch (error) {
    console.error('Error fetching prompts:', error)
    toast.error('Không thể tải danh sách prompt. Vui lòng thử lại sau.', {
      position: 'top-right',
      autoClose: 1000,
    })
  }
}

const goBack = () => {
  router.go(-1)
}

const openAddModal = () => {
  isEditing.value = false
  currentPrompt.id = null
  currentPrompt.contentStruct = ''
  currentPrompt.isActive = false
  showModal.value = true
  errorMessage.value = ''
}

const openEditModal = (prompt) => {
  isEditing.value = true
  currentPrompt.id = prompt.id
  currentPrompt.contentStruct = prompt.contentStruct
  currentPrompt.isActive = prompt.isActive
  showModal.value = true
  errorMessage.value = ''
}

const closeModal = () => {
  showModal.value = false
  errorMessage.value = ''
}

const savePrompt = async () => {
  try {
    if (!currentPrompt.contentStruct.trim()) {
      errorMessage.value = 'Vui lòng nhập nội dung prompt!'
      return
    }

    if (isEditing.value) {
      await axios.put(`${rootAPI}/prompts/${currentPrompt.id}`, {
        contentStruct: currentPrompt.contentStruct,
        idCourse: idCourse,
      })
      toast.success('Cập nhật prompt thành công!', {
        position: 'top-right',
        autoClose: 2000,
      })
    } else {
      await axios.post(`${rootAPI}/prompts`, {
        contentStruct: currentPrompt.contentStruct,
        idCourse: idCourse,
      })
      toast.success('Thêm prompt thành công!', {
        position: 'top-right',
        autoClose: 2000,
      })
    }
    closeModal()
    await fetchPrompts()
  } catch (error) {
    console.error('Error saving prompt:', error)
  }
}

const setActive = async (prompt) => {
  try {
    await axios.patch(
      `${rootAPI}/prompts/${prompt.id}`,
      {},
      {
        params: {
          idCourse: idCourse,
        },
      }
    )
    toast.success('Set Active thành công', {
      position: 'top-right',
      autoClose: 2000,
    })
    await fetchPrompts()
  } catch (error) {
    console.error('Error setting active prompt:', error)
    toast.error('Không thể đặt prompt này là active. Vui lòng thử lại sau.', {
      position: 'top-right',
      autoClose: 2000,
    })
  }
}

const confirmDeletePrompt = (prompt) => {
  if (prompt.isActive) {
    toast.error('Không thể xóa prompt đang active!', {
      position: 'top-right',
      autoClose: 3000,
    })
    return
  }

  promptToDelete.value = prompt
  isDeleteModalVisible.value = true
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/prompts/${promptToDelete.value.id}`)
    toast.success('Xóa prompt thành công!', {
      position: 'top-right',
      autoClose: 2000,
    })
    isDeleteModalVisible.value = false
    await fetchPrompts()
  } catch (error) {
    console.error('Error deleting prompt:', error)
    toast.error('Không thể xóa prompt. Vui lòng thử lại sau.', {
      position: 'top-right',
      autoClose: 2000,
    })
  }
}

onMounted(fetchPrompts)
</script>

<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">Cấu hình Prompt</h4>
          </div>
          <div>
            <button @click="openAddModal" class="btn btn-primary">
              <i class="fas fa-plus mr-1"></i> Thêm Prompt
            </button>
          </div>
        </div>
        <div class="iq-card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="text-center" style="width: 10%">ID Prompt</th>
                  <th class="text-center" style="width: 10%">Trạng thái</th>
                  <th class="text-center" style="width: 50%">Nội dung</th>
                  <th class="text-center" style="width: 20%">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prompt in prompts" :key="prompt.id">
                  <td class="text-center align-middle">{{ prompt.id }}</td>
                  <td class="text-center align-middle">
                    <span
                      class="badge"
                      :class="prompt.isActive ? 'badge-success' : 'badge-secondary'"
                    >
                      {{ prompt.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                    </span>
                  </td>
                  <td>
                    <textarea
                      v-model="prompt.contentStruct"
                      rows="5"
                      class="form-control"
                      readonly
                    ></textarea>
                  </td>
                  <td class="text-center align-middle">
                    <div class="btn-group">
                      <button
                        @click="setActive(prompt)"
                        :disabled="prompt.isActive"
                        class="btn btn-success btn-sm"
                        :class="{ 'btn-outline-success': prompt.isActive }"
                      >
                        <i class="fas fa-check-circle mr-1"></i> Active
                      </button>
                      <button @click="openEditModal(prompt)" class="btn btn-primary btn-sm">
                        <i class="fas fa-edit mr-1"></i> Sửa
                      </button>
                      <button
                        @click="confirmDeletePrompt(prompt)"
                        :disabled="prompt.isActive"
                        class="btn btn-danger btn-sm"
                      >
                        <i class="fas fa-trash mr-1"></i> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="prompts.length === 0">
                  <td colspan="4" class="text-center">Không có dữ liệu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Sửa Prompt' : 'Thêm Prompt' }}</h5>
              <button type="button" class="close" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="promptContent">Nội dung Prompt</label>
                <textarea
                  id="promptContent"
                  v-model="currentPrompt.contentStruct"
                  class="form-control"
                  rows="6"
                  placeholder="Nhập nội dung prompt..."
                ></textarea>
                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
              <button type="button" class="btn btn-primary" @click="savePrompt">Lưu</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
    <!-- Modal xoá  -->
    <div v-if="isDeleteModalVisible" class="delete-modal-overlay">
      <div class="modal show d-block" style="display: block !important; z-index: 1050">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Xác nhận xóa</h5>
              <button type="button" class="close" @click="isDeleteModalVisible = false">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p v-if="promptToDelete">
                Bạn có chắc chắn muốn xóa Prompt ID: {{ promptToDelete.id }}?
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="isDeleteModalVisible = false">
                Hủy
              </button>
              <button type="button" class="btn btn-danger" @click="handleDelete">Xóa</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show" style="z-index: 1049"></div>
    </div>
  </div>
</template>
  
<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 10px;
  vertical-align: middle;
  border: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.align-middle {
  vertical-align: middle;
}

textarea.form-control {
  width: 100%;
  resize: none;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.badge {
  padding: 0.5em 0.75em;
  font-size: 85%;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 800px;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 0.3rem;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

.close {
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  cursor: pointer;
  background: transparent;
  border: 0;
}

/* Hiển thị rõ ràng modal */
.d-block {
  display: block !important;
}

/* Thêm style cho error message */
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Chỉnh sửa modal để làm nó ngắn hơn */
.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 800px; /* Giảm chiều rộng tối đa */
}

textarea.form-control {
  width: 100%;
  resize: none;
  font-size: 0.9rem;
}

.modal-body {
  padding: 1rem;
  max-height: 60vh; /* Giới hạn chiều cao tối đa */
  overflow-y: auto; /* Cho phép cuộn nếu nội dung dài */
}

.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050; /* Đảm bảo nó hiển thị trên cùng */
  overflow: auto;
  pointer-events: all; /* Đảm bảo có thể tương tác */
}

/* Đảm bảo backdrop không ngăn chặn tương tác với modal */
.modal-backdrop.show {
  pointer-events: none; /* Cho phép click xuyên qua backdrop */
  opacity: 0.5;
  z-index: 1049;
}

/* Đảm bảo modal có thể nhận sự kiện */
.modal.show {
  display: block !important;
  pointer-events: all;
}

.modal-content {
  position: relative;
  z-index: 1060; /* Cao hơn z-index của overlay và backdrop */
  pointer-events: auto; /* Đảm bảo có thể tương tác */
}

/* Đảm bảo nút trong modal có thể nhận sự kiện click */
.modal-footer .btn {
  position: relative;
  z-index: 1061; /* Cao hơn z-index của modal-content */
}
</style>