<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <router-link
        :to="`/teacher/courses`"
        class="btn btn-light mb-3 d-inline-flex align-items-center"
      >
        <i class="fas fa-arrow-left mr-1"></i>
        Quay lại danh sách khoá học
      </router-link>
      <div class="row">
        <div class="col-sm-12">
          <div class="iq-card">
            <div class="row align-items-center">
              <div class="col-lg-5 mb-3 col-md-12 text-center">
                <img
                  class="img-fluid rounded"
                  :src="dataCourse.course.thumbnailUrl"
                  alt="Course Thumbnail"
                  style="max-width: 70%; height: auto"
                />
              </div>
              <div class="col-lg-7 col-md-12">
                <div style="color: #000; font-size: 1rem">
                  <p>
                    <b class="fw-bold">Tên khoá học: </b>
                    {{ dataCourse.course.name }}
                  </p>
                  <p>
                    <b class="fw-bold">Mô tả khoá học:</b>
                    {{ dataCourse.course.description }}
                  </p>
                  <p>
                    <b class="fw-bold">Giá: </b>
                    {{ formatPrice(dataCourse.course.price) }} VND
                  </p>
                  <p>
                    <b class="fw-bold">Trạng thái: </b>
                    {{ dataCourse.course.isPublic ? 'Công khai' : 'Không công khai' }}
                  </p>
                  <p>
                    <b class="fw-bold">Công nghệ: </b>
                    <span v-if="dataCourse.course?.techStacks?.length > 0">
                      {{ dataCourse.course.techStacks.map((stack) => stack.name).join(', ') }}
                    </span>
                    <span v-else>N/A</span>
                  </p>
                  <p>
                    <b class="fw-bold">Danh mục: </b>
                    <span v-if="dataCourse.course?.category?.name">
                      {{ dataCourse.course.category.name }}
                    </span>
                    <span v-else>N/A</span>
                  </p>
                  <p>
                    <b class="fw-bold">Thời hạn: </b>
                    {{ dataCourse.course.duration }} tháng
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="iq-card">
                <div class="iq-card-header d-flex justify-content-between align-items-center">
                  <div class="iq-header-title">
                    <h4 class="card-title">Danh sách chương</h4>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="mr-3">
                      <form class="position-relative" @submit.prevent="handleSearch">
                        <div class="form-group mb-0">
                          <input
                            type="search"
                            class="form-control"
                            id="exampleInputSearch"
                            placeholder="Tìm kiếm chương"
                            aria-controls="chapter-list-table"
                            v-model="searchName"
                            @input="handleClear"
                          />
                        </div>
                      </form>
                    </div>
                    <router-link
                      :to="`/teacher/courses/${props.idCourse}/chapters/add`"
                      class="btn btn-sm iq-bg-success mr-2"
                    >
                      <i class="ri-add-fill"></i>
                      <span class="pl-1">Thêm chương</span>
                    </router-link>
                    <router-link
                      :to="`/teacher/courses/${props.idCourse}/chapters/sort`"
                      class="btn btn-sm iq-bg-primary"
                    >
                      <i class="ri-list-check"></i>
                      <span class="pl-1">Sắp xếp</span>
                    </router-link>
                  </div>
                </div>
                <div class="iq-card-body">
                  <div v-if="isLoading" class="text-center my-5">
                    <LoadingComponent v-if="isLoading" text="Đang tải dữ liệu..." />
                  </div>
                  <div v-else class="table-responsive">
                    <div v-if="data.chapter.length === 0" class="text-center py-5">
                      <i class="ri-file-list-3-line text-muted" style="font-size: 3rem"></i>
                      <p class="mt-2">Chưa có chương nào trong khoá học này</p>
                      <router-link
                        :to="`/teacher/courses/${idCourse}/chapters/add`"
                        class="btn btn-primary mt-2"
                      >
                        <i class="ri-add-fill"></i>
                        <span class="pl-1">Thêm chương mới</span>
                      </router-link>
                    </div>
                    <div v-else>
                      <Table
                        :header="header"
                        :data="data.chapter"
                        :keys="keys"
                        :actions="actions"
                        :totalRows="totalRows"
                        type="chapter"
                        :currentPage="currentPage"
                        :perPage="perPage"
                        @delete-item="deleteChapter"
                        @pageChange="handlePageChange"
                      ></Table>
                      <b-modal
                        v-model="isModalVisible"
                        title="Xác nhận xóa"
                        ok-title="Xóa"
                        cancel-title="Đóng"
                        ok-variant="danger"
                        @ok="handleDelete"
                      >
                        <p>Bạn có chắc chắn muốn xóa chương không?</p>
                      </b-modal>
                    </div>
                  </div>
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
import Table from '@/components/Table.vue'
import axios from '@/plugins/axios'
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import LoadingComponent from '@/components/LoadingComponent.vue'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const searchName = ref('')

const props = defineProps({
  idCourse: {
    type: String,
    required: true,
  },
})

const data = reactive({
  chapter: [],
})

const isModalVisible = ref(false)
const itemToDelete = ref()

const dataCourse = reactive({
  course: {},
})

const header = ['STT', 'Tên chương', 'Hành động']
const keys = ['name']

const actions = {
  view: (item) => `/teacher/courses/${props.idCourse}/chapters/${item.id}/lessons`,
  edit: (item) => `/teacher/courses/${props.idCourse}/chapters/${item.id}/edit`,
  delete: (item) => `/courses/${item.id}`,
}

const currentPage = ref(1)
const perPage = ref(10)
const totalRows = ref(0)

const fetchChapter = async () => {
  isLoading.value = true
  try {
    let response = null

    if (searchName.value) {
      response = await axios.get(`${rootAPI}/chapters/search`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
          name: searchName.value,
          idCourse: props.idCourse,
        },
      })
    } else {
      response = await axios.get(`${rootAPI}/courses/${props.idCourse}/chapters`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
        },
      })
    }

    data.chapter = response.data.data.items
    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (value) => {
  if (!value) return 'N/A'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const deleteChapter = (chapter) => {
  isModalVisible.value = true
  itemToDelete.value = chapter
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/chapters/${itemToDelete.value.id}`)
    await fetchChapter()
    isModalVisible.value = false
    toast.success('Xóa chương thành công')
    setTimeout(() => {
      router.replace({ path: route.path, query: { idCourse: idCourse } })
    }, 1000)
  } catch (error) {
    console.log(error)
    toast.error('Có lỗi xảy ra')
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchChapter()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchChapter()
}

const handleClear = () => {
  if (searchName.value === '') {
    fetchChapter()
  }
}

const fetchCourse = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${rootAPI}/courses/${props.idCourse}`)
    dataCourse.course = response.data.data
  } catch (error) {
    console.error('Error fetching course:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchChapter()
  await fetchCourse()
})
</script>
  
  <style scoped>
.text-decoration-none {
  text-decoration: none;
}

i {
  font-size: 1rem;
}

img {
  border-radius: 10px;
  max-width: 80%;
  height: auto;
}

.header-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-table h5 {
  margin-left: 30px;
  margin-bottom: 0;
}

.form-control {
  height: 34px; /* Chiều cao phù hợp với nút */
  border-radius: 5px; /* Bo góc nhẹ */
}

/* Khoảng cách giữa ô tìm kiếm và nút thêm mới */
.mr-3 {
  margin-right: 1rem !important;
}
</style>
  