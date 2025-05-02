<template>
  <div class="iq-sidebar">
    <div class="iq-sidebar-logo d-flex justify-content-between">
      <router-link :to="'/teacher/courses'">
        <img src="@/assets/images/logo-name.jpg" class="img-fluid w-150" alt="" />
      </router-link>
      <div class="iq-menu-bt align-self-center">
        <div class="wrapper-menu">
          <div class="line-menu half start"></div>
          <div class="line-menu"></div>
          <div class="line-menu half end"></div>
        </div>
      </div>
    </div>
    <div id="sidebar-scrollbar">
      <nav class="iq-sidebar-menu">
        <ul id="iq-sidebar-toggle" class="iq-menu">
          <li :class="{ active: $route.path.startsWith('/teacher/courses') }">
            <router-link
              :to="'/teacher/courses'"
              class="iq-waves-effect collapsed"
              data-toggle="collapse"
              aria-expanded="false"
              ><i class="ri-home-4-line"></i><span>Quản Lý Khoá Học</span></router-link
            >
          </li>
          <li :class="{ active: $route.path.startsWith('/teacher/categories') }">
            <router-link
              :to="'/teacher/categories'"
              class="iq-waves-effect collapsed"
              data-toggle="collapse"
              aria-expanded="false"
              ><i class="ri-list-check"></i><span>Quản Lý Danh Mục</span></router-link
            >
          </li>
          <li :class="{ active: $route.path.startsWith('/teacher/tech-stacks') }">
            <router-link
              :to="'/teacher/tech-stacks'"
              class="iq-waves-effect collapsed"
              data-toggle="collapse"
              aria-expanded="false"
              ><i class="ri-stack-line"></i><span>Quản Lý Công Nghệ</span></router-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>