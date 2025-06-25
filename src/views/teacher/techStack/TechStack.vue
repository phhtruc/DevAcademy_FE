<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from '@/plugins/axios'
import Table from '@/components/Table.vue'
import { toast } from 'vue3-toastify'
import LoadingComponent from '@/components/LoadingComponent.vue'

const rootAPI = import.meta.env.VITE_APP_ROOT_API || window.runtime_config.VITE_APP_ROOT_API
const currentPage = ref(1)
const perPage = ref(8)
const totalRows = ref(0)
const isModalVisible = ref(false)
const itemToDelete = ref()
const isLoading = ref(true)

const data = reactive({
  techStacks: [],
})

const header = ['STT', 'Tên Công Nghệ', 'Hành động']
const keys = ['name']

const actions = {
  view: (item) => `/teacher/tech-stacks/${item.id}/edit`,
  edit: (item) => `/teacher/tech-stacks/${item.id}/edit`,
  delete: (item) => `/tech-stacks/${item.id}`,
}

const fetchTechStacks = async () => {
  try {
    const response = await axios.get(`${rootAPI}/tech-stacks`, {
      params: {
        page: currentPage.value,
        pageSize: perPage.value,
      },
    })
    data.techStacks = response.data.data.items
    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error('Error fetching tech stacks', error)
    toast.error('Có lỗi khi tải danh sách Tech Stack')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchTechStacks()
}

const deleteTechStack = (techStack) => {
  isModalVisible.value = true
  itemToDelete.value = techStack
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/tech-stacks/${itemToDelete.value.id}`)
    await fetchTechStacks()
    isModalVisible.value = false
    toast.success('Xóa thành công', {
      position: 'top-right',
      autoClose: 1000,
    })
  } catch (error) {
    console.error('Error deleting tech stack', error)
    toast.error('Có lỗi xảy ra khi xóa Tech Stack')
  }
}

onMounted(async () => {
  await fetchTechStacks()
})
</script>

<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">Danh sách Công nghệ</h4>
          </div>
          <div>
            <router-link to="/teacher/tech-stacks/add" class="btn btn-sm iq-bg-success">
              <i class="ri-add-fill"></i>
              <span class="pl-1">Thêm Công nghệ</span>
            </router-link>
          </div>
        </div>

        <div class="iq-card-body">
          <LoadingComponent v-if="isLoading" text="Đang tải dữ liệu..." />

          <div v-else class="table-responsive">
            <div v-if="data.techStacks.length === 0" class="text-center py-5">
              <i class="ri-file-list-3-line text-muted" style="font-size: 3rem"></i>
              <p class="mt-2">Chưa có Công nghệ nào</p>
              <router-link to="/teacher/tech-stacks/add" class="btn btn-primary mt-2">
                <i class="ri-add-fill"></i>
                <span class="pl-1">Thêm Công nghệ mới</span>
              </router-link>
            </div>
            <div v-else>
              <Table
                :header="header"
                :data="data.techStacks"
                :keys="keys"
                :actions="actions"
                :totalRows="totalRows"
                :perPage="perPage"
                @deleteItem="deleteTechStack"
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
                <p>Bạn có chắc chắn muốn xóa Tech Stack này?</p>
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
.ri-list-check {
  font-size: 0.9rem;
}
</style>