<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios  from '@/plugins/axios'
import Table from '@/components/Table.vue'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const currentPage = ref(1)
const perPage = ref(8)
const totalRows = ref(0)
const isModalVisible = ref(false)
const itemToDelete = ref()
const isLoading = ref(true)

const data = reactive({
  categories: [],
})

const header = ['STT', 'Tên danh mục', 'Hành động']
const keys = ['name']

const actions = {
  view: (item) => `/teacher/categories/${item.id}/edit`,
  edit: (item) => `/teacher/categories/${item.id}/edit`,
  delete: (item) => `/categories/${item.id}`,
}

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${rootAPI}/categories`, {
      params: {
        page: currentPage.value,
        pageSize: perPage.value,
      },
    })
    data.categories = response.data.data.items
    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error('Error fetching categories', error)
    toast.error('Có lỗi khi tải danh sách danh mục')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchCategories()
}

const deleteCategory = (category) => {
  isModalVisible.value = true
  itemToDelete.value = category
}

const handleDelete = async () => {
  try {
    await axios.delete(`${rootAPI}/categories/${itemToDelete.value.id}`)
    await fetchCategories()
    isModalVisible.value = false
    toast.success('Xóa danh mục thành công', {
      position: 'top-right',
      autoClose: 1000,
    })
  } catch (error) {
    console.error('Error deleting category', error)
    toast.error('Có lỗi xảy ra khi xóa danh mục')
  }
}

onMounted(async () => {
  await fetchCategories()
})
</script>

<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">Danh sách danh mục</h4>
          </div>
          <div>
            <router-link to="/teacher/categories/add" class="btn btn-sm iq-bg-success">
              <i class="ri-add-fill"></i>
              <span class="pl-1">Thêm danh mục</span>
            </router-link>
          </div>
        </div>

        <div class="iq-card-body">
          <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu...</p>
          </div>

          <div v-else class="table-responsive">
            <div v-if="data.categories.length === 0" class="text-center py-5">
              <i class="ri-file-list-3-line text-muted" style="font-size: 3rem"></i>
              <p class="mt-2">Chưa có danh mục nào</p>
              <router-link to="/categories/add" class="btn btn-primary mt-2">
                <i class="ri-add-fill"></i>
                <span class="pl-1">Thêm danh mục mới</span>
              </router-link>
            </div>
            <div v-else>
              <Table
                :header="header"
                :data="data.categories"
                :keys="keys"
                :actions="actions"
                :totalRows="totalRows"
                :perPage="perPage"
                @deleteItem="deleteCategory"
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
                <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
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