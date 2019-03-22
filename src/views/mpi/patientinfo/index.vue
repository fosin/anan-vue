<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="searchText"
        style="width: 400px;"
        class="filter-item"
        placeholder="支持姓名、卡号、手机号码、身份证号、MPIID查找"
        @keyup.enter.native="handleSearch"/>
      <el-button-group>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" round @click="handleSearch">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-permission="'100'"
          v-waves
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-view"
          round
          @click="handleQuery">{{ $t('table.view') }}
        </el-button>
        <el-button
          v-permission="'95'"
          v-waves
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          round
          @click="handleAdd">{{ $t('table.add') }}
        </el-button>
        <el-button
          v-permission="'96'"
          v-waves
          type="success"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-edit"
          round
          @click="handleEdit()">{{ $t('table.edit') }}
        </el-button>
        <el-button
          v-permission="'97'"
          v-waves
          type="danger"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-arrow-right"
          round
          @click="handleLogout()">{{ $t('table.logout') }}
        </el-button>
      </el-button-group>
    </div>
    <ListPatientinfo ref="listPatientinfo" :status="0" :data="form" @rowClick="rowClick"/>
    <FormPatientinfo ref="formPatientinfo" :mpi-id="form.mpiId" @refreshSelect="refreshSelect"/>
  </div>
</template>
<script>
import FormPatientinfo from './component/form'
import ListPatientinfo from './component/list'

export default {
  name: 'MpiManagerPatientinfo',
  components: {
    FormPatientinfo,
    ListPatientinfo
  },

  data() {
    return {
      form: {},
      searchText: ''
    }
  },
  methods: {
    refreshSelect: function() {},
    handleSearch() {
      this.$refs.listPatientinfo.handleSearch(this.searchText)
    },
    handleQuery() {
      this.$refs.formPatientinfo.handleQuery()
    },
    handleAdd() {
      this.$refs.formPatientinfo.handleAdd()
    },
    handleEdit() {
      this.$refs.formPatientinfo.handleEdit()
    },
    handleLogout() {
      this.$refs.formPatientinfo.handleStatus(1)
    },
    rowClick(form) {
      this.form = form
    }
  }
}
</script>

<style scoped>
</style>
