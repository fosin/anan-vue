<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户名:{{userInfo.username}}</div>
    <div class="dashboard-text">所有角色:<span v-for='role in roles' :key='role.id'>{{role.name}} </span></div>
    <div class="dashboard-text">当前角色:{{current_role}}</div>
    <div class="dashboard-text">机构:{{current_organiz.name}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'userInfo',
      'roles',
      'current_organiz',
      'current_role'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
