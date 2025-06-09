<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from '@/plugins/axios'
import Table from '@/components/Table.vue'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const currentPage = ref(1)
const perPage = ref(7)
const totalRows = ref(0)
const isModalVisible = ref(false)
const itemToDelete = ref()
const searchName = ref('')
const sortOrder = ref('')

const data = reactive({
  courses: [],
})

const header = ['STT', 'Tên khóa học', 'Giá tiền', 'Trạng thái', 'Hành động']
const keys = ['name', 'price', 'isPublic']

const actions = {
  view: (item) => `/teacher/courses/${item.id}/chapters`,
  edit: (item) => `/teacher/courses/${item.id}/edit`,
  delete: (item) => `/courses/${item.id}`,
  managePrompts: (item) => `/teacher/courses/${item.id}/prompts`,
}

const fetchCourses = async () => {
  try {
    let response = null

    if (searchName.value || sortOrder.value) {
      response = await axios.get(`${rootAPI}/courses/search`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
          name: searchName.value || undefined,
          sortPrice: sortOrder.value || undefined,
        },
      })
    } else {
      response = await axios.get(`${rootAPI}/courses`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
        },
      })
    }
    data.courses = response.data.data.items
    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error('Error fetching courses', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchCourses()
}

const deleteCourse = (course) => {
  isModalVisible.value = true
  itemToDelete.value = course
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/courses/${itemToDelete.value.id}`)
    await fetchCourses()
    isModalVisible.value = false
    toast.success('Xóa khóa học thành công')
  } catch (error) {
    console.log(error)
    toast.error('Có lỗi xảy ra')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchCourses()
}

const handleClear = () => {
  if (searchName.value === '') {
    fetchCourses()
  }
}

const handleSort = () => {
  if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else {
    sortOrder.value = 'asc'
  }
  fetchCourses()
}

onMounted(async () => {
  await fetchCourses()
})
</script>

<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="iq-card">
            <div class="iq-card-header d-flex justify-content-between align-items-center">
              <div class="iq-header-title">
                <h4 class="card-title">Danh sách khoá học</h4>
              </div>
              <div class="d-flex align-items-center">
                <div class="mr-3">
                  <form class="position-relative" @submit.prevent="handleSearch">
                    <div class="form-group mb-0">
                      <input
                        type="search"
                        class="form-control"
                        id="exampleInputSearch"
                        placeholder="Tìm kiếm khoá học"
                        aria-controls="user-list-table"
                        v-model="searchName"
                        @input="handleClear"
                      />
                    </div>
                  </form>
                </div>
                <router-link
                  :to="'/teacher/courses/add'"
                  class="btn btn-sm iq-bg-success d-flex align-items-center"
                >
                  <i class="ri-add-fill"></i>
                  <span class="pl-1">Thêm mới</span>
                </router-link>
              </div>
            </div>
            <div class="iq-card-body">
              <div class="table-responsive">
                <Table
                  :header="header"
                  :data="data.courses"
                  :keys="keys"
                  type="course"
                  :actions="actions"
                  :totalRows="totalRows"
                  :perPage="perPage"
                  :currentPage="currentPage"
                  @deleteItem="deleteCourse"
                  @pageChange="handlePageChange"
                  @sortPrice="handleSort"
                  :prompts="true"
                ></Table>
                <b-modal
                  v-model="isModalVisible"
                  title="Xác nhận xóa"
                  ok-title="Xóa"
                  cancel-title="Đóng"
                  ok-variant="danger"
                  @ok="handleDelete"
                >
                  <p>Bạn có chắc chắn xóa khóa học không?</p>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control {
  height: 38px; /* Chiều cao phù hợp với nút */
  border-radius: 5px; /* Bo góc nhẹ */
}

/* Căn chỉnh biểu tượng và văn bản trong nút thêm mới */
.btn-sm.iq-bg-success {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}

/* Khoảng cách giữa ô tìm kiếm và nút thêm mới */
.mr-3 {
  margin-right: 1rem !important;
}
</style>
