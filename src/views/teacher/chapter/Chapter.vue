<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
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
                    <span class="fw-bold">Tên khoá học:</span>
                    {{ dataCourse.course.name }}
                  </p>
                  <p>
                    <span class="fw-bold">Mô tả khoá học:</span>
                    {{ dataCourse.course.description }}
                  </p>
                  <p>
                    <span class="fw-bold">Giá: </span>
                    {{ formatPrice(dataCourse.course.price) }}
                  </p>
                  <p>
                    <span class="fw-bold">Trạng thái: </span>
                    {{ dataCourse.course.isPublic ? 'Công khai' : 'Không công khai' }}
                  </p>
                  <p>
                    <span class="fw-bold">Công nghệ: </span>
                    <span v-if="dataCourse.course?.techStacks?.length > 0">
                      {{ dataCourse.course.techStacks.map((stack) => stack.name).join(', ') }}
                    </span>
                    <span v-else>N/A</span>
                  </p>
                  <p>
                    <span class="fw-bold">Danh mục: </span>
                    <span v-if="dataCourse.course?.category?.name">
                      {{ dataCourse.course.category.name }}
                    </span>
                    <span v-else>N/A</span>
                  </p>
                  <p>
                    <span class="fw-bold">Thời hạn: </span>
                    {{ dataCourse.course.duration }} tháng
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="iq-card">
                <div class="iq-card-header d-flex justify-content-between">
                  <div class="iq-header-title">
                    <h4 class="card-title">Danh sách chương</h4>
                  </div>
                  <div>
                    <router-link
                      :to="`/teacher/courses/${props.idCourse}/chapters/add`"
                      type="button"
                      class="btn btn-primary mr-3"
                      >Thêm chương</router-link
                    >
                    <router-link
                      :to="`/teacher/courses/${props.idCourse}/chapters/sort`"
                      class="btn btn-primary"
                      >Sắp xếp chương</router-link
                    >
                  </div>
                </div>
                <div class="iq-card-body">
                  <div class="table-responsive">
                    <Table
                      :header="header"
                      :data="data.chapter"
                      :keys="keys"
                      :actions="actions"
                      :totalRows="totalRows"
                      type="chapter"
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
</template>
  
  <script setup>
import Table from '@/components/Table.vue'
import axios from 'axios'
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const route = useRoute()
const router = useRouter()

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

const header = ['STT', 'Tên chương', 'Trạng thái', 'Hành động']
const keys = ['name', 'isPublic']

const actions = {
  view: (item) => `/teacher/courses/${props.idCourse}/chapters/${item.id}/lesssons`,
  edit: (item) => `/teacher/courses/${props.idCourse}/chapters/${item.id}`,
  delete: (item) => `/courses/${item.id}`,
}

const currentPage = ref(1)
const perPage = ref(10)
const totalRows = ref(0)

const fetchChapter = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${props.idCourse}/chapters`, {
      params: {
        page: currentPage.value,
        pageSize: perPage.value,
      },
    })
    data.chapter = response.data.data.items

    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error(error)
  }
}

const formatPrice = (value) => {
  if (!value) return 'N/A'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Hàm xử lý xóa khóa học
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

const fetchCourse = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${props.idCourse}`)
    dataCourse.course = response.data.data
    console.log('Course data loaded:', dataCourse.course)
  } catch (error) {
    console.error('Error fetching course:', error)
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
</style>
  