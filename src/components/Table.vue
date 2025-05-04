<template>
  <table id="datatable" class="table table-striped table-bordered">
    <thead>
      <tr>
        <th
          v-for="(header, index) in props.header"
          :key="index"
          :class="{
            'd-none':
              (widthScreen < 1000 && header === 'Giá tiền') ||
              (widthScreen < 1000 && header === 'Trạng thái'),
            'table-stt': header === 'STT',
            'table-price': header === 'Giá tiền',
            'table-status': header === 'Loại bài học' || header === 'Trạng thái',
            'table-action': header === 'Hành động',
          }"
        >
          <span v-if="header === 'Giá tiền'" @click="emit('sortPrice')">
            {{ header }}
            <i
              class="ml-2 fas"
              :class="{
                'fa-sort': !sortOrder,
                'fa-sort-up': sortOrder === 'asc',
                'fa-sort-down': sortOrder === 'desc',
              }"
            ></i>
          </span>
          <span v-else>
            {{ header }}
          </span>
        </th>
      </tr>
    </thead>
    <draggable
      tag="tbody"
      v-if="isDraggable"
      :list="props.data"
      :disabled="!enabled"
      ghost-class="ghost"
      :move="checkMove"
      @start="dragging = true"
      @end="
        (evt) => {
          dragging = false
          emit('updateOrder', props.data)
        }
      "
    >
      <template #item="{ element, index }">
        <tr :key="element.id" class="w-100 drag-item">
          <th scope="row" class="text-center">
            {{ (currentPage - 1) * props.perPage + index + 1 }}
          </th>
          <td
            v-for="(key, keyIndex) in props.keys"
            :key="keyIndex"
            :class="key === 'type' ? 'text-center align-middle' : ''"
          >
            <span
              v-if="key === 'type'"
              class="badge badge-centered ml-2"
              :class="[
                element.type === 'Bài tập'
                  ? 'iq-bg-success'
                  : element.type === 'Bài đọc'
                  ? 'iq-bg-info'
                  : element.type === 'Bài giảng'
                  ? 'iq-bg-warning'
                  : 'iq-bg-secondary',
              ]"
            >
              {{ element.type || 'Không xác định' }}
            </span>
            <span v-else>
              {{ element[key] || 'N/A' }}
            </span>
          </td>
          <td v-if="viewPublic" class="text-center align-middle">
            <span :class="element.isPublic ? 'badge iq-bg-primary' : 'badge iq-bg-warning'">
              {{ element.isPublic ? 'Học thử' : 'Khoá' }}
            </span>
          </td>
        </tr>
      </template>
    </draggable>
    <template v-else>
      <tbody>
        <tr v-for="(item, index) in props.data" :key="item.id">
          <th scope="row" class="text-center">
            {{ (currentPage - 1) * props.perPage + index + 1 }}
          </th>
          <td
            v-for="(key, keyIndex) in props.keys"
            :key="keyIndex"
            :class="{
              'd-none':
                (widthScreen < 1000 && key === 'price') ||
                (widthScreen < 1000 && key === 'isPublic'),
              'table-price': key === 'price',
              'text-center':
                key === 'price' || key === 'isPublic' || key === 'type' || key === 'status',
            }"
          >
            <template v-if="key === 'name'">
              <router-link :to="props.actions.view(item)" class="course-name-link">
                {{ item[key] || 'N/A' }}
              </router-link>
            </template>
            <template v-else-if="key === 'price'">
              {{ formatPrice(item[key]) + ' VND' || 'N/A' }}
            </template>
            <template v-else-if="key === 'isPublic'">
              <span
                :class="[
                  'badge',
                  type === 'course'
                    ? item[key]
                      ? 'iq-bg-primary'
                      : 'iq-bg-warning'
                    : item[key]
                    ? 'iq-bg-primary'
                    : 'iq-bg-warning',
                ]"
              >
                {{ getStatusLabel(type, item[key]) }}
              </span>
            </template>
            <template v-else-if="key === 'type'">
              <span
                :class="[
                  'badge',
                  item[key] === 'Bài tập'
                    ? 'iq-bg-success'
                    : item[key] === 'Bài đọc'
                    ? 'iq-bg-info'
                    : item[key] === 'Bài giảng'
                    ? 'iq-bg-warning'
                    : 'iq-bg-secondary',
                ]"
              >
                {{ item[key] }}
              </span>
            </template>
            <template v-else-if="key === 'status'">
              <span
                :class="[
                  'badge',
                  item[key] === 'ACTIVE'
                    ? 'iq-bg-success'
                    : item[key] === 'INACTIVE'
                    ? 'iq-bg-danger'
                    : 'iq-bg-secondary',
                ]"
              >
                {{ item[key] }}
              </span>
            </template>
            <template v-else-if="key !== 'avatar' && key !== 'roles'">
              {{ item[key] || 'N/A' }}
            </template>
            <template v-if="key === 'avatar'">
              <img
                v-if="item[key]"
                :src="item[key]"
                alt="Avatar"
                class="rounded img-fluid avatar-40"
              />
              <span v-else>N/A</span>
            </template>
            <template v-else-if="key === 'roles'">
              <span v-if="item[key] && item[key].length > 0">
                {{ item[key][0].name }}
              </span>
              <span v-else>N/A</span>
            </template>
          </td>
          <td class="action-button">
            <span>
              <router-link
                v-if="viewDetail"
                :to="props.actions.view(item)"
                class="btn btn-primary mr-2 btn-sm btn-action"
              >
                <i class="fas fa-eye"></i>
              </router-link>
            </span>
            <router-link
              :to="props.actions.edit(item)"
              class="btn btn-warning mr-2 btn-sm btn-action"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <router-link
              v-if="!props.isUserPage"
              to=""
              @click="confirmDelete(item)"
              class="btn btn-danger btn-sm btn-action"
            >
              <i class="fas fa-trash"></i>
            </router-link>
            <button
              v-if="props.isUserPage"
              class="btn btn-sm"
              :class="item.status === 'INACTIVE' ? 'btn-success' : 'btn-danger'"
              @click="emit('toggleStatus', item)"
            >
              <i :class="item.status === 'INACTIVE' ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </template>
  </table>
  <b-pagination
    v-if="props.totalRows > 0"
    class="pagination mt-3 justify-content-center"
    v-model="currentPage"
    :total-rows="props.totalRows"
    :per-page="props.perPage"
    aria-controls="datatable"
    first-number
    last-number
    @change="pageChanged"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import draggable from 'vuedraggable/src/vuedraggable'

const props = defineProps({
  header: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  keys: {
    type: Array,
    required: true,
  },
  actions: {
    type: Object,
    required: true,
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
  totalRows: {
    type: Number,
    required: false,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  viewPublic: {
    type: Boolean,
    default: true,
  },
  viewDetail: {
    type: Boolean,
    default: true,
  },
  isUserPage: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'course',
  },
  sortOrder: {
    type: String,
    default: '',
  },
})

var widthScreen = ref(9999)

window.addEventListener('resize', function () {
  widthScreen.value = window.innerWidth || document.documentElement.clientWidth
})

const currentPage = ref(1)

const emit = defineEmits(['updateOrder', 'deleteItem', 'pageChange', 'sortPrice', 'toggleStatus'])
const enabled = true
const dragging = ref(false)

function checkMove(evt) {
  return true
}

const confirmDelete = (item) => {
  emit('deleteItem', item)
}

watch(currentPage, (newPage) => {
  pageChanged()
})

const pageChanged = () => {
  emit('pageChange', currentPage.value)
}

const formatPrice = (value) => {
  if (value !== null && value !== undefined) {
    return new Intl.NumberFormat('vi-VN').format(value)
  }
  return value
}

const getStatusLabel = (type, value) => {
  if (type === 'course') {
    return value ? 'Công khai' : 'Ẩn'
  } else if (type === 'chapter') {
    return value ? 'Học thử' : 'Khoá'
  }
  return 'N/A'
}
</script>

<style scoped>
.table {
  width: 100%;
  table-layout: auto; /* Cho phép cột name chiếm không gian dư */
  border-collapse: collapse;
  margin-bottom: 1rem; /* Thêm khoảng cách bên dưới bảng */
  background-color: #fff; /* Màu nền bảng */
  border: 1px solid #dee2e6; /* Đường viền bảng */
}

/* Tiêu đề bảng */
.table th,
.table thead th {
  padding: 8px 12px;
  vertical-align: middle;
  text-align: center;
  background-color: #f8f9fa;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

/* Nội dung bảng */
.table td {
  padding: 8px 12px;
  vertical-align: middle;
  border: 1px solid #ddd;
  white-space: nowrap;
}

/* Cột name (có thể mở rộng) */
.table-name {
  width: auto;
  text-align: left;
}

/* Cột STT */
.table-stt {
  width: 5%;
  text-align: center;
  white-space: nowrap;
}

/* Cột Giá tiền */
.table-price {
  width: 10%;
  text-align: right;
  white-space: nowrap;
}

/* Cột Trạng thái */
.table-status {
  width: 10%;
  text-align: center;
  white-space: nowrap;
}

/* Cột Hành động */
.table-action {
  width: 10%;
  text-align: center;
  white-space: nowrap;
}

/* Cột hành động (phiên bản khác - dùng nếu cần linh hoạt hơn chiều rộng) */
.action-column {
  white-space: nowrap;
  width: 1%;
  text-align: center;
}

/* Hàng được hover */
.table tbody tr:hover {
  background-color: #f1f1f1;
}

/* Nút hành động */
.action-button {
  text-align: center;
  white-space: nowrap;
}

.action-button button {
  margin: 0 5px;
}

.btn-action {
  margin-right: 0.25rem;
}

.btn-action:last-child {
  margin-right: 0;
}

/* Liên kết tên khóa học */
.course-name-link {
  text-decoration: none;
  /* color: #007bff; */
}

/* Avatar nhỏ */
.avatar-40 {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

/* Lớp ẩn */
.d-none {
  display: none;
}

/* Drag and drop styles */
.drag-item {
  cursor: grab;
}

.ghost {
  opacity: 0.6;
  background-color: #ccc;
  border: 1px dashed #666;
}

/* Badge căn giữa */
.badge-centered {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  text-align: center !important;
  padding: 5px 8px;
}

/* Đảm bảo bảng hiển thị tốt trên màn hình nhỏ */
@media (max-width: 768px) {
  .table th,
  .table td {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  .table-stt,
  .table-price,
  .table-status,
  .table-action {
    width: auto;
  }
}
</style>
