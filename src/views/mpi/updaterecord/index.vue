<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button v-waves v-permission="'1'" round type="primary" class="filter-item" style="margin-left: 5px;" icon="el-icon-circle-plus" size="mini" @click="getList">
        {{ $t('table.refresh') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      size="mini"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column align="center" label="姓名" sortable prop="name" />
      <el-table-column align="center" label="身份证" sortable prop="idcard" />
      <el-table-column align="center" label="出生日期" sortable prop="birthday">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | dateFormatFilter('yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" sortable prop="sex">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(sexOptions, scope.row.sex) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="就诊卡号" sortable prop="cardno" />
      <el-table-column align="center" label="操作类型" sortable prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type | dateFormatFilter(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间" sortable prop="updateTime" />
      <el-table-column align="center" label="修改人" sortable prop="modifier" />
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date'
import { deleteUpdaterecord, getUpdaterecord, listUpdaterecordByEmpId, postUpdaterecord, putUpdaterecord } from './updaterecord'

export default {
  name: 'MpiUpdaterecord',
  filters: {
    statusFilter(status) {
      switch (status) {
        case 1:
          return '修改'
        case 2:
          return '恢复'
        case 3:
          return '合并'
      }
    },
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  props: {
    mpiId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      statusOptions: [1, 2, 3],
      sexOptions: [],
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          sortRules: [{
            sortName: 'updateTime',
            sortOrder: 'DESC' }
          ]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      rules: {
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  mounted() {
    this.loadDictionaryById(15).then(res => {
      this.sexOptions = res.details
    })
    this.loadOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数').then(res => {
      this.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      this.pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
    this.getList()
  },
  methods: {
    getList() {
      if (this.mpiId) {
        this.listLoading = true
        listUpdaterecordByEmpId(this.mpiId, this.pageModule).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        }).catch(reason => {
          this.$notify({
            title: '获取列表失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }
    },
    handleSearch() {
      this.pageModule.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.pageModule.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageModule.pageNumber = val
      this.getList()
    },
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit() {
      if (!this.form || !this.form['id']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getUpdaterecord(this.form['id']).then(response => {
        this.form = response.data.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleDelete() {
      if (!this.form || !this.form['id']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteUpdaterecord(this.form['id']).then(response => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(reason => {
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postUpdaterecord(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '新建失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      if (formName === 'form') {
        this.$refs['form'].resetFields()
      }
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putUpdaterecord(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '更新信息失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.form = {
        mpiId: this.mpiId
      }
    },
    sortChange(column) {
      const sortRule = {
        sortOrder: (column.order && column.order === 'descending') ? 'DESC' : 'ASC',
        sortName: column.prop
      }
      this.pageModule.params.sortRules = []
      this.pageModule.params.sortRules.push(sortRule)
      if (column.prop) {
        this.getList()
      }
    },
    rowClick(row, event, column) {
      this.form = row
    }
  }
}
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
</style>
