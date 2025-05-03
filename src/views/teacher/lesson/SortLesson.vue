<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <router-link
            :to="`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons`"
            class="text-decoration-none btn btn-light mb-3"
          >
            <div class="d-flex align-items-center gap-2">
              <i class="fa-solid fa-arrow-left text-dark"></i>
              <p class="mb-0 text-dark">Danh sách bài học</p>
            </div>
          </router-link>
          <div class="iq-card">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">Sắp xếp danh sách bài học</h4>
              </div>
              <div>
                <button class="d-flex btn-save btn btn-warning align-self-end" @click="saveOrder">
                  Lưu thay đổi
                </button>
              </div>
            </div>
            <div class="iq-card-body">
              <div class="table-responsive">
                <Table
                  :header="header"
                  :data="data.lessons"
                  :keys="keys"
                  :actions="actions"
                  :isDraggable="true"
                  :viewPublic="false"
                  @updateOrder="handleDragUpdate"
                >
                </Table>
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
import axios  from '@/plugins/axios'
import { reactive, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useRoute, useRouter } from 'vue-router'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const route = useRoute()
const router = useRouter()
const idCourse = route.params.idCourse
const idChapter = route.params.idChapter

const data = reactive({
  lessons: [],
  updatedOrder: [],
})

const actions = reactive({
  view: () => '#',
  edit: () => '#',
  delete: () => '#',
})

const currentPage = ref(1)
const perPage = ref(50)

const header = ['STT', 'Tên bài học', 'Loại bài học']
const keys = ['name', 'type']

function handleDragUpdate(updatedData) {
  data.updatedOrder = updatedData.map((item, index) => ({
    id: item.id,
    order: index + 1,
  }))
}

async function saveOrder() {
  if (!data.updatedOrder.length) {
    toast.info('Không có thay đổi thứ tự nào', {
      position: 'top-right',
      autoClose: 3000,
    })
    return
  }

  try {
    await axios.patch(`${rootAPI}/lessons/update-order`, data.updatedOrder)
    toast.success('Cập nhật thứ tự thành công', {
      position: 'top-right',
      autoClose: 1000,
    })
    data.updatedOrder = []
    setTimeout(() => {
      router.push(`/teacher/courses/${idCourse}/chapters/${idChapter}/lessons`)
    }, 2000)
  } catch (error) {
    toast.error('Lỗi cập nhật thứ tự bài học', {
      position: 'top-right',
      autoClose: 3000,
    })
    console.error('Lỗi cập nhật thứ tự bài học:', error)
  }
}

const formatLessonType = (type) => {
  const types = {
    LECTURES: 'Bài giảng',
    READINGS: 'Bài đọc',
    EXERCISES: 'Bài tập',
    QUIZ: 'Trắc nghiệm',
  }
  return types[type] || type
}

const fetchLessons = async () => {
  try {
    const response = await axios.get(`${rootAPI}/chapters/${idChapter}/lessons`, {
      params: {
        page: currentPage.value,
        pageSize: perPage.value,
      },
    })

    data.lessons = response.data.data.items.map((lesson) => ({
      ...lesson,
      type: formatLessonType(lesson.type),
    }))
  } catch (error) {
    console.error('Error fetching lessons:', error)
    toast.error('Không thể tải danh sách bài học', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

onMounted(async () => {
  await fetchLessons()
})
</script>
  
  <style scoped>
.btn-save {
  font-weight: 500;
}
</style>