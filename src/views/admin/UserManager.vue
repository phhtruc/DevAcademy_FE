<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from '@/plugins/axios'
import Table from '@/components/Table.vue'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const currentPage = ref(1)
const perPage = ref(7)
const totalRows = ref(0)
const isModalVisible = ref(false)
const itemToDelete = ref()
const searchName = ref('')
const searchStatus = ref('')

const data = reactive({
  users: [],
})

const header = ['STT', 'Họ và tên', 'Email', 'Vai trò', 'Trạng thái', 'Hành động']
const keys = ['fullName', 'email', 'roles', 'status']

const actions = {
  view: (item) => `/admin/users/${item.id}`,
  edit: (item) => `/admin/users/${item.id}/edit`,
  delete: (item) => `/users/${item.id}`,
}

const fetchUsers = async () => {
  try {
    let response = null

    if (searchName.value || searchStatus.value) {
      response = await axios.get(`${rootAPI}/users/search`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
          name: searchName.value || undefined,
          status: searchStatus.value || undefined,
        },
      })
    } else {
      response = await axios.get(`${rootAPI}/users`, {
        params: {
          page: currentPage.value,
          pageSize: perPage.value,
        },
      })
    }

    data.users = response.data.data.items
    perPage.value = response.data.data.pageSize
    totalRows.value =
      response.data.data.totalPage > 0 ? response.data.data.totalPage * perPage.value : 1
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

const openModal = (user) => {
  itemToDelete.value = user
  isModalVisible.value = true
}

const handleDelete = async () => {
  try {
    const response = await axios.patch(`${rootAPI}/users/${itemToDelete.value.id}/status`)
    const updatedStatus = response.data.data.status
    itemToDelete.value.status = updatedStatus
    await fetchUsers()
    isModalVisible.value = false

    if (updatedStatus === 'INACTIVE') {
      toast.success('Khoá người dùng thành công')
    } else {
      toast.success('Mở khoá người dùng thành công')
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error('Có lỗi xảy ra')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleClear = () => {
  if (searchName.value === '') {
    fetchUsers()
  }
}

onMounted(async () => {
  await fetchUsers()
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
                <h4 class="card-title">Quản lý người dùng</h4>
              </div>
              <div class="d-flex align-items-center">
                <div class="mr-3">
                  <form class="position-relative" @submit.prevent="handleSearch">
                    <div class="form-group mb-0">
                      <input
                        type="search"
                        class="form-control"
                        id="exampleInputSearch"
                        placeholder="Tìm kiếm người dùng"
                        aria-controls="user-list-table"
                        v-model="searchName"
                        @input="handleClear"
                      />
                    </div>
                  </form>
                </div>
                <div class="mr-3">
                  <select class="form-control select-status" v-model="searchStatus" @change="handleSearch">
                    <option value="">Lọc trạng thái</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">In Active</option>
                  </select>
                </div>
                <router-link
                  :to="'/admin/users/add'"
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
                  :data="data.users"
                  :keys="keys"
                  :actions="actions"
                  :totalRows="totalRows"
                  :perPage="perPage"
                  @pageChange="handlePageChange"
                  :isUserPage="true"
                  @toggleStatus="openModal"
                ></Table>
                <b-modal
                  v-model="isModalVisible"
                  :title="
                    itemToDelete?.status === 'INACTIVE' ? 'Xác nhận mở khoá' : 'Xác nhận khoá'
                  "
                  :ok-title="itemToDelete?.status === 'INACTIVE' ? 'Mở khoá' : 'Khoá'"
                  cancel-title="Đóng"
                  :ok-variant="itemToDelete?.status === 'INACTIVE' ? 'success' : 'danger'"
                  @ok="handleDelete"
                >
                  <p>
                    Bạn có chắc chắn muốn
                    {{ itemToDelete?.status === 'INACTIVE' ? 'mở khoá' : 'khoá' }} người dùng này
                    không?
                  </p>
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
  height: 38px;
  border-radius: 5px;
  width: 20rem;
}

.btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}

.select-status {
  width: 100%;
  cursor: pointer;
  padding: 0 10px;
}
</style>