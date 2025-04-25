import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_ROOT_API, // backend URL
  withCredentials: false, // vì token không dùng HttpOnly cookie
})

// Gắn accessToken vào mọi request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tự refresh token nếu accessToken hết hạn (401)
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const res = await api.post('/auth/refresh', { refreshToken })
        const newAccessToken = res.data.data.accessToken

        localStorage.setItem('accessToken', newAccessToken)

        // Gắn lại token vào request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (e) {
        // Refresh thất bại => logout
        localStorage.clear()
        router.push('/login')
        return Promise.reject(e)
      }
    }
    return Promise.reject(err)
  }
)

export default api
