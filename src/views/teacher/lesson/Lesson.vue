<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from '@/plugins/axios'
import Table from '@/components/Table.vue'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import LoadingComponent from '@/components/LoadingComponent.vue'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const route = useRoute()
const idCourse = route.params.idCourse
const idChapter = route.params.idChapter
const currentPage = ref(1)
const perPage = ref(10)
const totalRows = ref(0)
const isModalVisible = ref(false)
const itemToDelete = ref()
const isLoading = ref(true)
const searchName = ref('')

const data = reactive({
  lessons: [],
})

const header = ['STT', 'Tên bài học', 'Loại bài học', 'Trạng thái', 'Hành động']
const keys = ['name', 'type', 'isPublic']

const formatLessonType = (type) => {
  const types = {
    EXERCISES: 'Bài tập',
    READINGS: 'Bài đọc',
    LECTURES: 'Bài giảng',
  }
  return types[type] || type
}

const actions = {
  view: (item) => `/teacher/courses/${idCourse}/chapters/${idChapter}/lessons/${item.id}/edit`,
  edit: (item) => `/teacher/courses/${idCourse}/chapters/${idChapter}/lessons/${item.id}/edit`,
  delete: (item) => `/lessons/${item.id}`,
}

const fetchLessons = async () => {
  isLoading.value = true
  try {
    let response = null

    if (searchName.value) {
      response = await axios.get(`${rootAPI}/lessons/search`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
          name: searchName.value,
          idChapter: idChapter,
        },
      })
    } else {
      response = await axios.get(`${rootAPI}/chapters/${idChapter}/lessons`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
        },
      })
    }

    data.lessons = response.data.data.items.map((lesson) => ({
      ...lesson,
      type: formatLessonType(lesson.type),
    }))

    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error('Error fetching lessons', error)
    toast.error('Có lỗi khi tải danh sách bài học')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchLessons()
}

const deleteLesson = (lesson) => {
  isModalVisible.value = true
  itemToDelete.value = lesson
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/lessons/${itemToDelete.value.id}`)
    await fetchLessons()
    isModalVisible.value = false
    toast.success('Xóa bài học thành công', {
      position: 'top-right',
      autoClose: 1000,
    })
  } catch (error) {
    console.log(error)
    toast.error('Có lỗi xảy ra khi xóa bài học')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchLessons()
}

const handleClear = () => {
  if (searchName.value === '') {
    fetchLessons()
  }
}

onMounted(async () => {
  await fetchLessons()
})
</script>

<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <router-link
        :to="`/teacher/courses/${idCourse}/chapters`"
        class="btn btn-light mb-3 d-inline-flex align-items-center"
      >
        <i class="fas fa-arrow-left mr-1"></i>
        Quay lại danh sách chương
      </router-link>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between align-items-center">
          <div class="iq-header-title">
            <h4 class="card-title">Danh sách bài học</h4>
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
              :to="`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons/add`"
              class="btn btn-sm iq-bg-success mr-2"
            >
              <i class="ri-add-fill"></i>
              <span class="pl-1">Thêm bài học</span>
            </router-link>
            <router-link
              :to="`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons/sort`"
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
            <div v-if="data.lessons.length === 0" class="text-center py-5">
              <i class="ri-file-list-3-line text-muted" style="font-size: 3rem"></i>
              <p class="mt-2">Chưa có bài học nào trong chương này</p>
              <router-link
                :to="`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons/add`"
                class="btn btn-primary mt-2"
              >
                <i class="ri-add-fill"></i>
                <span class="pl-1">Thêm bài học mới</span>
              </router-link>
            </div>
            <div v-else>
              <Table
                :header="header"
                :data="data.lessons"
                :keys="keys"
                :actions="actions"
                :totalRows="totalRows"
                type="lesson"
                :perPage="perPage"
                :currentPage="currentPage"
                @deleteItem="deleteLesson"
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
                <p>Bạn có chắc chắn muốn xóa bài học này?</p>
                <p class="font-weight-bold mb-0" v-if="itemToDelete">"{{ itemToDelete.name }}"</p>
              </b-modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  margin-bottom: 0;
}

.ri-add-fill,
.ri-list-check,
.fas {
  font-size: 0.9rem;
}

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