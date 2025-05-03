<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <router-link
            :to="`/teacher/courses/${props.idCourse}/chapters`"
            class="text-decoration-none btn btn-light mb-3"
          >
            <div class="d-flex align-items-center gap-2">
              <i class="fa-solid fa-arrow-left text-dark"></i>
              <p class="mb-0 text-dark">Danh sách chương</p>
            </div>
          </router-link>
          <div class="iq-card">
            <div class="iq-card-header d-flex justify-content-between">
              <div class="iq-header-title">
                <h4 class="card-title">Sắp xếp danh sách chương</h4>
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
                  :data="data.chapter"
                  :keys="keys"
                  :actions="actions"
                  :isDraggable="true"
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

const rootAPI = import.meta.env.VITE_APP_ROOT_API

const props = defineProps({
  idCourse: {
    type: String,
    required: true,
  },
})

const data = reactive({
  chapter: [],
  updatedOrder: [],
})

const actions = reactive({
  view: () => '#',
  edit: () => '#',
  delete: () => '#',
})

const currentPage = ref(1)
const perPage = ref(50)

const header = ['STT', 'Tên chương', 'Trạng thái']
const keys = ['name']

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
    await axios.patch(`${rootAPI}/chapters/update-order`, data.updatedOrder)
    toast.success('Cập nhật thứ tự thành công', {
      position: 'top-right',
      autoClose: 1000,
    })
    data.updatedOrder = []
    setTimeout(() => {
      router.push(`/teacher/courses/${props.idCourse}/chapters`)
    }, 1100)
  } catch (error) {
    toast.error('Lỗi cập nhật thứ tự chương', {
      position: 'top-right',
      autoClose: 3000,
    })
    console.error('Lỗi cập nhật thứ tự chương:', error)
  }
}

const fetchChapter = async () => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${props.idCourse}/chapters`, {
      params: {
        page: currentPage.value,
        pageSize: perPage.value,
      },
    })
    data.chapter = response.data.data.items
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await fetchChapter()
})
</script>

<style scoped></style>