import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Authentication/Login.vue'
import Register from '@/views/Authentication/Register.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import UserPage from '@/views/user/UserPage.vue'
import CourseForm from '@/views/teacher/course/CourseForm.vue'
import Course from '../views/teacher/course/Course.vue'
import Chapter from '@/views/teacher/chapter/Chapter.vue'
import ChapterForm from '@/views/teacher/chapter/ChapterForm.vue'
import SortChapter from '@/views/teacher/chapter/SortChapter.vue'
import Lesson from '@/views/teacher/lesson/Lesson.vue'
import LessonForm from '@/views/teacher/lesson/LessonForm.vue'
import SortLesson from '@/views/teacher/lesson/SortLesson.vue'
import Category from '@/views/teacher/category/Category.vue'
import CategoryForm from '@/views/teacher/category/CategoryForm.vue'
import TechStack from '@/views/teacher/techStack/TechStack.vue'
import TechStackForm from '@/views/teacher/techStack/TechStackForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Authentication routes
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
    // Admin routes
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, roles: ['ADMIN'] }
    },
    // Teacher routes
    // Teacher courses
    {
      path: '/teacher/courses',
      name: 'teacher-courses',
      component: Course,
      meta: { requiresAuth: true, roles: ['TEACHER'] }
    },
    {
      path: '/teacher/courses/add',
      name: 'course-add',
      component: CourseForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] }
    },
    {
      path: '/teacher/courses/:idCourse/edit',
      name: 'course-edit',
      component: CourseForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    // Teacher chapters
    {
      path: '/teacher/courses/:idCourse/chapters',
      name: 'teacher-course-chapters',
      component: Chapter,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/add',
      name: 'teacher-course-chapters-add',
      component: ChapterForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/edit',
      name: 'teacher-course-chapters-edit',
      component: ChapterForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/sort',
      name: 'teacher-course-chapters-sort',
      component: SortChapter,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    // Teacher lessons
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons',
      name: 'teacher-course-chapters-lesson',
      component: Lesson,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons/add',
      name: 'teacher-course-chapters-lesson-add',
      component: LessonForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons/:idLesson/edit',
      name: 'teacher-course-chapters-lesson-edit',
      component: LessonForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons/sort',
      name: 'teacher-course-chapters-lesson-sort',
      component: SortLesson,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    // Teacher categories
    {
      path: '/teacher/categories',
      name: 'teacher-categories',
      component: Category,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/categories/add',
      name: 'teacher-categories-add',
      component: CategoryForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/categories/:idCategory/edit',
      name: 'teacher-categories-edit',
      component: CategoryForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    // Teacher tech stacks
    {
      path: '/teacher/tech-stacks',
      name: 'teacher-tech-stacks',
      component: TechStack,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/tech-stacks/add',
      name: 'teacher-tech-stacks-add',
      component: TechStackForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
    },
    {
      path: '/teacher/tech-stacks/:idTechStack/edit',
      name: 'teacher-tech-stacks-edit',
      component: TechStackForm,
      meta: { requiresAuth: true, roles: ['TEACHER'] },
      props: true
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
