<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      show-timeout="200"
      background-color="#0078d7"
      text-color="#ffffff"
      active-text-color="#ffffff"
    >
      <sidebar-item v-for="route in ananRouters" :key="route.name" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'ananRouters',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style>
  .el-submenu__icon-arrow.el-icon-arrow-down {
    color: #ffffff;
  }
</style>
