<template>
  <div id="content-page" class="content-page">
    <div class="container-fluid">
      <button class="btn btn-light mb-3" @click="goBack">← Trở về</button>
      <div class="iq-card">
        <div class="iq-card-header d-flex justify-content-between">
          <div class="iq-header-title">
            <h4 class="card-title">{{ isUpdate ? 'Cập nhật khoá học' : 'Thêm mới khoá học' }}</h4>
          </div>
        </div>
        <div class="iq-card-body">
          <form @submit.prevent="addCourse">
            <div class="form-group">
              <label for="title">Tên khoá học</label>
              <input
                id="title"
                v-model="course.name"
                placeholder="Nhập tên khoá học"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />
              <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
            </div>
            <div class="form-group">
              <label for="description">Mô tả</label>
              <textarea
                id="description"
                v-model="course.description"
                placeholder="Nhập mô tả"
                class="form-control"
                rows="3"
                :class="{ 'is-invalid': errors.description }"
              ></textarea>
              <div class="invalid-feedback" v-if="errors.description">{{ errors.description }}</div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="price">Giá (VNĐ)</label>
                  <input
                    type="text"
                    id="price"
                    :value="formattedPrice"
                    placeholder="Nhập giá"
                    class="form-control"
                    :class="{ 'is-invalid': errors.price }"
                    @input="
                      (e) => {
                        formatPrice(e.target.value)
                      }
                    "
                  />
                  <div class="invalid-feedback" v-if="errors.price">{{ errors.price }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="furniture">Danh mục khoá học</label>
                  <select id="furniture" v-model="course.idCategory" class="form-control">
                    <option value="">Chọn danh mục</option>
                    <option v-for="(type, index) in categoris" :key="index" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="bedrooms">Thời hạn (Tháng)</label>
                  <input
                    type="text"
                    id="bedrooms"
                    v-model="course.duration"
                    placeholder="Nhập thời hạn"
                    class="form-control"
                    :class="{ 'is-invalid': errors.duration }"
                  />
                  <div class="invalid-feedback" v-if="errors.duration">{{ errors.duration }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="techStack">Công nghệ sử dụng</label>
                  <div :class="['multiselect-wrapper', { 'is-invalid': errors.techStack }]">
                    <Multiselect
                      v-model="course.techStack"
                      :options="techStack.data"
                      label="name"
                      track-by="id"
                      :multiple="true"
                      :taggable="true"
                      @tag="addTag"
                      @remove="removeTag"
                      placeholder="Chọn công nghệ"
                    />
                  </div>
                  <div class="invalid-feedback" v-if="errors.techStack">{{ errors.techStack }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="d-block">Trạng thái</label>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="active"
                      name="status"
                      value="true"
                      v-model="course.isPublic"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="active">Công khai</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="inactive"
                      name="status"
                      value="false"
                      v-model="course.isPublic"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="inactive">Ẩn</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload ảnh -->
            <label for="image">Hình ảnh</label>
            <file-pond
              name="file"
              label-idle="Kéo thả hoặc chọn ảnh"
              allow-multiple="true"
              accepted-file-types="image/*"
              :files="filePondFiles"
              @updatefiles="handleUpload"
              aria-required="true"
            />
            <div class="text-danger" v-if="errors.file">{{ errors.file }}</div>

            <div class="text-right">
              <button class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Lưu</span>
              </button>
              <button type="button" class="btn iq-bg-danger ml-2" @click="cancel">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
    
  <script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios  from '@/plugins/axios'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'vue3-toastify/dist/index.css'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { toast } from 'vue3-toastify'

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const router = useRouter()
const categoris = ref([])
const isLoading = ref(false)
const formattedPrice = ref('')
const isUpdate = ref(false)
const filePondFiles = ref([])

const props = defineProps({
  idCourse: {
    type: String,
    required: true,
  },
})

const course = ref({
  name: '',
  description: '',
  price: '',
  isPublic: true,
  duration: '',
  idCategory: '',
  techStack: [],
  file: [],
})
const errors = ref({
  name: '',
  description: '',
  price: '',
  duration: '',
  idCategory: '',
  techStack: '',
  file: '',
})

const techStack = reactive({
  data: [],
})

const formatPriceForDisplay = (value) => {
  if (value == null) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const formatPrice = (value) => {
  const rawValue = value.replace(/\./g, '')
  if (!/^\d*$/.test(rawValue)) return

  formattedPrice.value = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  course.value.price = rawValue
}

const validateForm = () => {
  let isValid = true

  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = ''
  })

  if (!course.value.name.trim()) {
    errors.value.name = 'Tên khoá học không được để trống'
    isValid = false
  }

  if (!course.value.description.trim()) {
    errors.value.description = 'Mô tả không được để trống'
    isValid = false
  }

  if (!course.value.price) {
    errors.value.price = 'Giá là bắt buộc'
    isValid = false
  } else if (!/^\d+$/.test(course.value.price)) {
    errors.value.price = 'Giá chỉ được nhập số'
    isValid = false
  }

  if (!course.value.duration) {
    errors.value.duration = 'Thời hạn không được để trống'
    isValid = false
  } else if (!/^\d+$/.test(course.value.duration)) {
    errors.value.duration = 'Thời hạn chỉ được nhập số'
    isValid = false
  }

  if (course.value.file.length === 0) {
    errors.value.file = 'Vui lòng tải lên ít nhất một ảnh'
    isValid = false
  }

  if (course.value.techStack.length === 0) {
    errors.value.techStack = 'Vui lòng chọn ít nhất một công nghệ'
    isValid = false
  }

  return isValid
}

// Xử lý upload ảnh bằng FilePond
const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)
const handleUpload = (file) => {
  course.value.file = file.map((fileItem) => fileItem.file) || []
}

const addCourse = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()

    formData.append('name', course.value.name)
    formData.append('description', course.value.description)
    formData.append('price', course.value.price)
    formData.append('isPublic', course.value.isPublic)
    formData.append('duration', course.value.duration)

    if (course.value.idCategory) {
      formData.append('idCategory', course.value.idCategory)
    }

    course.value.techStack.forEach((item, index) => {
      formData.append(`techStack[${index}]`, item.id)
    })

    course.value.file.forEach((file) => {
      formData.append('file', file)
    })

    if (isUpdate.value) {
      await axios.put(`${rootAPI}/courses/${props.idCourse}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Cập nhật thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    } else {
      const response = await axios.post(`${rootAPI}/courses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Thêm thành công', {
        position: 'top-right',
        autoClose: 1000,
      })
    }
    setTimeout(() => {
      router.push('/teacher/courses')
    }, 1100)
  } catch (error) {
    toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu'), {
      position: 'top-right',
      autoClose: 3000,
    })
    console.error('Error creating course:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchCourse = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/courses/${id}`)
    course.value = response.data.data
    course.value.idCategory = response.data.data.category.id || ''
    course.value.techStack = response.data.data.techStacks.map((tech) => ({
      id: tech.id,
      name: tech.name,
    }))
    filePondFiles.value = [
      {
        source: response.data.data.thumbnailUrl,
        options: { type: 'remote' },
      },
    ]
    formattedPrice.value = formatPriceForDisplay(course.value.price)
  } catch (error) {
    console.error('Error fetching course:', error)
  }
}

const cancel = () => {
  router.push('/teacher/courses')
}

const goBack = () => {
  router.go(-1)
}

const addTag = (newTag) => {
  course.techStack.push({ name: newTag })
}

const removeTag = (tagToRemove) => {
  course.techStack = course.techStack.filter((tag) => tag.name !== tagToRemove.name)
}

const fetchCategory = async () => {
  try {
    const response = await axios.get(`${rootAPI}/categories`)
    categoris.value = response.data.data.items
  } catch (error) {
    console.error('Error fetching', error)
  }
}

const fetchTechStack = async () => {
  const response = await axios.get(`${rootAPI}/tech-stacks`)
  techStack.data = response.data.data.items
}

onMounted(async () => {
  await fetchCategory()
  await fetchTechStack()
  if (props.idCourse) {
    isUpdate.value = true
    await fetchCourse(props.idCourse)
  }
})
</script>
    