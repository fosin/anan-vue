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
        <el-button v-waves round class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-waves
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-view"
          @click="handleQuery">{{ $t('table.view') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'98'"
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleRevert">{{ $t('table.revert') }}
        </el-button>
      </el-button-group>
    </div>
    <ListPatientinfo ref="listPatientinfo" :status="1" :data="form" @rowClick="rowClick"/>
    <FormPatientinfo ref="formPatientinfo" :mpi-id="form.mpiId"/>
  </div>
</template>
<script>
import FormPatientinfo from './component/form'
import ListPatientinfo from './component/list'
export default {
  name: 'MpiManagerRevert',
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
    handleSearch() {
      this.$refs.listPatientinfo.handleSearch()
    },
    handleQuery() {
      this.$refs.formPatientinfo.handleQuery()
    },
    handleRevert() {
      this.$refs.formPatientinfo.handleStatus(0)
    },
    rowClick(form) {
      this.form = form
    }
  }
}
</script>

<style scoped>
</style>
