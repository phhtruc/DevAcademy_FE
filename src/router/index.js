import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/authentication/Login.vue'
import Register from '@/views/authentication/Register.vue'
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
import UserManager from '@/views/admin/UserManager.vue'
import UserForm from '@/views/admin/UserForm.vue'
import PromptManager from '@/views/teacher/course/PromptManager.vue'
import ResetPassword from '@/views/authentication/ResetPassword.vue'
import UserDetails from '@/views/admin/UserDetails.vue'
import HomePage from '@/views/user/HomePage.vue'
import CoursePage from '@/views/user/CoursePage.vue'
import CourseDetailsPage from '@/views/user/CourseDetailsPage.vue'
import AboutUs from '@/views/user/AboutUs.vue'
import LessonDetailsPage from '@/views/user/LessonDetailsPage.vue'
import CheckoutPage from '@/views/user/payment/CheckoutPage.vue'
import PaymentResultPage from '@/views/user/payment/PaymentResultPage.vue'
import MyCourse from '@/views/user/MyCourse.vue'
import LoginCallback from '@/views/authentication/LoginCallback.vue'
import UserProfilePage from '@/views/user/UserProfilePage.vue'
import ForgotPasswordPage from '@/views/user/ForgotPasswordPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Authentication routes
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hideNavbar: true, title: 'Đăng nhập' }
    },
    {
      path: '/login/oauth2/code/google',
      name: 'login-oauth2-google',
      component: LoginCallback,
      meta: { hideNavbar: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { hideNavbar: true , title: 'Đăng ký'}
    },
    {
      path: '/auth/create-password/token=:token',
      name: 'ResetPassword',
      component: ResetPassword,
      meta: {
        layout: 'auth',
        requiresAuth: false,
        hideNavbar: true,
        title: 'Cập nhật mật khẩu'
      }
    },

    // Admin routes
    {
      path: '/admin/users/add',
      name: 'admin-user-add',
      component: UserForm,
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Thêm tài khoản' }
    },
    {
      path: '/admin/users/:idUser/edit',
      name: 'admin-user-edit',
      component: UserForm,
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Cập nhật tài khoản' },
      props: true
    },
    {
      path: '/admin/users/:idUser',
      name: 'admin-user-details',
      component: UserDetails,
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Thông tin chi tiết' },
      props: true
    },
    {
      path: '/admin/users',
      name: 'admin-user',
      component: UserManager,
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Quản lý tài khoản - Dev Academy' }
    },

    // Teacher routes
    // Teacher courses
    {
      path: '/teacher/courses',
      name: 'teacher-courses',
      component: Course,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Quản lý khoá học - Dev Academy' }
    },
    {
      path: '/teacher/courses/add',
      name: 'course-add',
      component: CourseForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Thêm khoá học - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/edit',
      name: 'course-edit',
      component: CourseForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Cập nhật khoá học - Dev Academy' },
      props: true
    },
    // Teacher chapters
    {
      path: '/teacher/courses/:idCourse/chapters',
      name: 'teacher-course-chapters',
      component: Chapter,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Quản lý chương - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/add',
      name: 'teacher-course-chapters-add',
      component: ChapterForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Thêm chương - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/edit',
      name: 'teacher-course-chapters-edit',
      component: ChapterForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Sửa chương - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/sort',
      name: 'teacher-course-chapters-sort',
      component: SortChapter,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Sắp xếp chương - Dev Academy' },
      props: true
    },
    // Teacher lessons
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons',
      name: 'teacher-course-chapters-lesson',
      component: Lesson,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Quản lý bài học - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons/add',
      name: 'teacher-course-chapters-lesson-add',
      component: LessonForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Thêm bài học - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons/:idLesson/edit',
      name: 'teacher-course-chapters-lesson-edit',
      component: LessonForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Sửa bài học - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/courses/:idCourse/chapters/:idChapter/lessons/sort',
      name: 'teacher-course-chapters-lesson-sort',
      component: SortLesson,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Sắp xếp bài học - Dev Academy' },
      props: true
    },
    // Teacher categories
    {
      path: '/teacher/categories',
      name: 'teacher-categories',
      component: Category,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Quản lý danh mục - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/categories/add',
      name: 'teacher-categories-add',
      component: CategoryForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Thêm danh mục - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/categories/:idCategory/edit',
      name: 'teacher-categories-edit',
      component: CategoryForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Cập nhật danh mục - Dev Academy' },
      props: true
    },

    // Teacher tech stacks
    {
      path: '/teacher/tech-stacks',
      name: 'teacher-tech-stacks',
      component: TechStack,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Quản lý công nghệ - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/tech-stacks/add',
      name: 'teacher-tech-stacks-add',
      component: TechStackForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Thêm công nghệ - Dev Academy' },
      props: true
    },
    {
      path: '/teacher/tech-stacks/:idTechStack/edit',
      name: 'teacher-tech-stacks-edit',
      component: TechStackForm,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Cập nhật công nghệ - Dev Academy' },
      props: true
    },

    // Teacher prompts
    {
      path: '/teacher/courses/:idCourse/prompts',
      name: 'teacher-course-prompts',
      component: PromptManager,
      meta: { requiresAuth: true, roles: ['TEACHER'], title: 'Quản lý prompt - Dev Academy' },
      props: true
    },

    // User routes
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
      meta: {hideNavbar: true}
    },
    {
      path: '/khoa-hoc',
      name: 'khoa-hoc',
      component: CoursePage,
      meta: {hideNavbar: true}
    },
    {
      path: '/khoa-hoc/:idCourse',
      name: 'chi-tiet-khoa-hoc',
      component: CourseDetailsPage,
      meta: {hideNavbar: true, title: 'Chi tiết khoá học - Dev Academy'},
      props: true
    },
    {
      path: '/ve-chung-toi',
      name: 've-chung-toi',
      component: AboutUs,
      meta: {hideNavbar: true, title: 'Về chúng tôi - Dev Academy'}
    },
    {
      path: '/khoa-hoc/:idCourse/noi-dung/:idLesson',
      name: 'chi-tiet-bai-hoc',
      component: LessonDetailsPage,
      meta: {hideNavbar: true }
    },
    {
      path: '/dang-ky-khoa-hoc/:courseId',
      name: 'dang-ky-khoa-hoc',
      component: CheckoutPage,
      meta: {hideNavbar: true, title: 'Đăng ký khoá học - Dev Academy'},
      props: true
    },
    {
      path: '/thanh-toan',
      name: 'thanh-toan',
      component: PaymentResultPage,
      meta: {hideNavbar: true, title: 'Kết quả thanh toán - Dev Academy'},
      props: true
    },
    {
      path: '/khoa-hoc-cua-toi',
      name: 'khoa-hoc-cua-toi',
      component: MyCourse,
      meta: {hideNavbar: true, title: 'Khoá học của tôi - Dev Academy'},
      props: true
    },
    {
      path: '/ho-so-ca-nhan',
      name: 'ho-so-ca-nhan',
      component: UserProfilePage,
      meta: {hideNavbar: true, title: 'Hồ sơ cá nhân - Dev Academy'},
      props: true
    },
    {
      path: '/quen-mat-khau',
      name: 'quen-mat-khau',
      component: ForgotPasswordPage,
      meta: { hideNavbar: true , title: 'Quên mật khẩu - Dev Academy' }
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const role = localStorage.getItem('roles')

  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login')
    }

    if (to.meta.roles && !to.meta.roles.includes(role.replace(/\[|\]/g, ''))) {
      return next('/login')
    }
  }

  document.title = to.meta.title || 'Dev Academy - Học lập trình cùng chuyên gia'
  next()

  next()
})


export default router
