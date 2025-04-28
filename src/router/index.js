import { createRouter, createWebHistory } from 'vue-router'
import ManagerCourse from '../views/teacher/course/ManagerCourse.vue'
import Login from '@/views/Authentication/Login.vue'
import Register from '@/views/Authentication/Register.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import UserPage from '@/views/user/UserPage.vue'
import Course from '@/views/teacher/course/Course.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hideNavbar: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { hideNavbar: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, roles: ['ADMIN'] }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: ManagerCourse,
      meta: { requiresAuth: true, roles: ['TEACHER'] }
    },
    {
      path: '/teacher/add-course',
      name: 'course',
      component: Course,
      meta: { requiresAuth: true, roles: ['TEACHER'] }
    },
    {
      path: '/user',
      name: 'user',
      component: UserPage,
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const role = localStorage.getItem('roles')

  // if (to.path === '/' && !token) {
  //   return next('/login')
  // }

  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login')
    }

    if (to.meta.roles && !to.meta.roles.includes(role.replace(/\[|\]/g, ''))) {
      return next('/login')
    }
  }

  next()
})


export default router
