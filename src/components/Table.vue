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
            'action-column': header === 'STT',
            'table-price': header === 'Giá tiền',
            'action-column': header === 'Hành động',
          }"
        >
          {{ header }}
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
          <td v-for="(key, keyIndex) in props.keys" :key="keyIndex">
            {{ element[key] || 'N/A' }}
          </td>
          <td v-if="viewPublic">
            {{ element.isPublic ? 'Công khai' : 'Riêng tư' }}
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
              'text-center': key === 'price' || key === 'isPublic',
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
            <span v-if="!props.isUserPage">
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
              to=""
              @click="confirmDelete(item)"
              class="btn btn-danger btn-sm btn-action"
            >
              <i class="fas fa-trash"></i>
            </router-link>
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
import draggable from 'vuedraggable'

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
})

var widthScreen = ref(9999)

window.addEventListener('resize', function () {
  widthScreen.value = window.innerWidth || document.documentElement.clientWidth
})

const currentPage = ref(1)

const emit = defineEmits(['updateOrder', 'deleteItem', 'pageChange'])
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
  width: 100%; /* Đảm bảo bảng chiếm toàn bộ chiều rộng của container */
  border-collapse: collapse; /* Gộp đường viền của các ô */
  margin-bottom: 1rem; /* Thêm khoảng cách bên dưới bảng */
}

.table th,
.table td {
  padding: 0.75rem; /* Khoảng cách bên trong ô */
  vertical-align: middle; /* Căn giữa nội dung theo chiều dọc */
  border-top: 1px solid #dee2e6; /* Đường viền phía trên các ô */
  text-align: left; /* Căn trái nội dung văn bản mặc định */
}

.table thead th {
  background-color: #f8f9fa; /* Màu nền cho tiêu đề */
  border-bottom: 2px solid #dee2e6; /* Đường viền đậm hơn ở phía dưới tiêu đề */
  font-weight: bold; /* Chữ in đậm cho tiêu đề */
  text-align: center; /* Căn giữa tiêu đề */
  white-space: nowrap;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2; /* Màu nền khác cho các hàng chẵn để dễ đọc */
}

.text-center {
  text-align: center; /* Căn giữa văn bản */
}

.table-price {
  text-align: right; /* Căn phải giá tiền */
}

.action-button {
  text-align: center; /* Căn giữa các nút hành động */
  white-space: nowrap; /* Ngăn các nút xuống dòng */
}

.action-column {
  white-space: nowrap; /* Đảm bảo nội dung không bị xuống dòng */
  width: 1%; /* Đặt chiều rộng tự động vừa với nội dung */
  text-align: center; /* Căn giữa nội dung */
}

.btn-action {
  margin-right: 0.25rem; /* Khoảng cách giữa các nút hành động */
}

.btn-action:last-child {
  margin-right: 0; /* Loại bỏ khoảng cách ở nút cuối cùng */
}

.course-name-link {
  text-decoration: none; /* Loại bỏ gạch chân mặc định của link */
  /* color: #007bff; Màu xanh dương cho link */
}

/* .course-name-link:hover {
  text-decoration: underline; Thêm gạch chân khi hover
} */

.avatar-40 {
  width: 40px;
  height: 40px;
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
}

.d-none {
  display: none; /* Ẩn các cột khi màn hình nhỏ hơn 1000px (CSS này đã có trong component) */
}

.drag-item {
  cursor: grab; /* Hiển thị con trỏ "grab" khi có thể kéo */
}

.ghost {
  opacity: 0.6;
  background-color: #ccc;
  border: 1px dashed #666;
}
</style>
