<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="searchText"
        style="width: 400px;"
        class="filter-item"
        placeholder="支持姓名、卡号、手机号码、身份证号、MPIID查找"
        @keyup.enter.native="handleSearch"
      />
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
          @click="handleQuery"
        >
          {{ $t('table.view') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'99'"
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleMerge"
        >
          {{ $t('table.merge') }}
        </el-button>
      </el-button-group>
    </div>
    <ListPatientinfo ref="listPatientinfo" :status="0" :data="multipleSelection" @rowClick="rowClick" @handleSelectionChange="handleSelectionChange" />
    <FormPatientinfo ref="formPatientinfo" :mpi-id="form.mpiId" />
    <MergePatientinfo ref="mergePatientinfo" :mpi-id="mpiId" :mpi-id11="mpiId11" :mpi-id22="mpiId22" :mpi-id33="mpiId33" :handle-refresh-list="handleRefreshList" />
  </div>
</template>
<script>
import FormPatientinfo from './component/form'
import MergePatientinfo from './component/merge'
import ListPatientinfo from './component/selectlist'

export default {
  name: 'MpiManagerMerge',
  components: {
    MergePatientinfo,
    ListPatientinfo,
    FormPatientinfo
  },

  data() {
    return {
      form: {},
      searchText: '',
      multipleSelection: [],
      mpiId: undefined,
      mpiId11: undefined,
      mpiId22: undefined,
      mpiId33: undefined
    }
  },
  methods: {
    handleRefreshList: function() {
      this.$refs.listPatientinfo.getList()
    },
    handleSearch() {
      this.$refs.listPatientinfo.handleSearch()
    },
    handleQuery() {
      this.$refs.formPatientinfo.handleQuery()
    },
    handleMerge: function() {
      if (this.$refs.listPatientinfo.handleMerge()) {
        this.$refs.mergePatientinfo.handleQuery()
        // this.$refs.mergePatientinfo.refreshList()
      }
    },
    rowClick(form) {
      this.form = form
      this.mpiId = form.mpiId
      // this.$refs.mergePatientinfo.refreshList()
    },
    handleSelectionChange(val) {
      this.mpiId11 = undefined
      this.mpiId22 = undefined
      this.mpiId33 = undefined
      this.multipleSelection = val
      if (this.multipleSelection.length === 1) {
        this.mpiId11 = this.multipleSelection[0].mpiId
      } else if (this.multipleSelection.length === 2) {
        this.mpiId11 = this.multipleSelection[0].mpiId
        this.mpiId22 = this.multipleSelection[1].mpiId
      } else if (this.multipleSelection.length === 3) {
        this.mpiId11 = this.multipleSelection[0].mpiId
        this.mpiId22 = this.multipleSelection[1].mpiId
        this.mpiId33 = this.multipleSelection[2].mpiId
      }
      this.$refs.mergePatientinfo.refreshList()
    }
  }
}
</script>

<style scoped>
</style>
