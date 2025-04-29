<template>
  <div class="d-flex mt-3 justify-content-between align-items-center chapter-header">
    <router-link
      :to="{ path: '/chapters', query: { idCourse: idCourse } }"
      class="text-decoration-none"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="fa-solid fa-arrow-left text-dark"></i>
        <p class="mb-0 text-dark">Danh sách chương</p>
      </div>
    </router-link>
  </div>
  <hr class="border border-grey border-1 opacity-50" />
  <div class="d-flex justify-content-center flex-column align-items-center">
    <div class="d-flex justify-content-between w-100 px-4 align-items-center">
      <h4 class="title-sort m-0">Sắp xếp danh sách chương</h4>
      <button class="d-flex btn-save btn btn-warning align-self-end" @click="saveOrder">
        Lưu thay đổi
      </button>
    </div>
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
</template>
<script setup>
import Table from '@/components/Table.vue'
import axios from 'axios'
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

const currentPage = ref(1)
const perPage = ref(50)

const header = ['STT', 'Tên chương', 'Trạng thái', 'Hành động']
const keys = ['name', 'isPublic']

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
      autoClose: 3000,
    })
    data.updatedOrder = [] // Clear the local updated order after saving
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