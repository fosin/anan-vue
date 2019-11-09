<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="pageModule.searchText" style="width: 200px;" class="filter-item" placeholder="支持XXX查找" @keyup.enter.native="handleSearch" />
      <el-button v-waves round class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves v-permission="'1'" round class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-circle-plus" @click="handleAdd">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves v-permission="'1'" round type="success" class="filter-item" style="margin-left: 5px;" icon="el-icon-edit" @click="handleEdit()">
        {{ $t('table.edit') }}
      </el-button>
      <el-button v-waves v-permission="'1'" round type="danger" class="filter-item" style="margin-left: 5px;" icon="el-icon-delete" @click="handleDelete()">
        {{ $t('table.delete') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'mpiId', order: 'ascending'}"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column align="center" label="病人唯一标识" sortable prop="mpiId" />
      <el-table-column align="center" label="照片信息" sortable prop="photo" />
      <el-table-column
        align="center"
        label="0-不需要上传
            1-需要上传"
        sortable
        prop="uploadsign"
      />
      <el-table-column
        align="center"
        label="0-不需要下传
            1-需要下传"
        sortable
        prop="sendsign"
      />
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="病人唯一标识" prop="mpiId">
          <el-input v-model="form.mpiId" placeholder="病人唯一标识" />
        </el-form-item>
        <el-form-item label="照片信息" prop="photo">
          <el-input v-model="form.photo" placeholder="照片信息" />
        </el-form-item>
        <el-form-item
          label="0-不需要上传
            1-需要上传"
          prop="uploadsign"
        >
          <el-input
            v-model="form.uploadsign"
            placeholder="0-不需要上传
            1-需要上传"
          />
        </el-form-item>
        <el-form-item
          label="0-不需要下传
            1-需要下传"
          prop="sendsign"
        >
          <el-input
            v-model="form.sendsign"
            placeholder="0-不需要下传
            1-需要下传"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button v-if="dialogStatus==='create'" round type="primary" icon="el-icon-circle-check" autofocus @click="create('form')">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else round type="primary" icon="el-icon-circle-check" autofocus @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPicture, postPicture, putPicture, deletePicture, listPicturePage } from './picture'

export default {
  name: 'MpiPicture',

  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        searchText: '',
        sortName: '',
        sortOrder: ''
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
    this.asyncOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数', (data) => {
      this.pageModule.pageSize = parseInt(data)
    })
    this.asyncOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项', (data) => {
      const temp = data.split(',')
      this.pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
  },
  methods: {
    getList() {
      if (this.mpiId) {
        this.listLoading = true
        listPicturePage(this.pageModule).then(response => {
          this.list = response.data.rows
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
      if (!this.form || !this.form['mpiId']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getPicture(this.form['mpiId']).then(response => {
        this.form = response.data
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
      if (!this.form || !this.form['mpiId']) {
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
        deletePicture(this.form['mpiId']).then(response => {
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
          postPicture(this.form).then(() => {
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
          putPicture(this.form).then(() => {
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
      }
    },
    sortChange(column) {
      this.pageModule.sortOrder = (column.order && column.order === 'descending') ? 'DESC' : 'ASC'
      this.pageModule.sortName = column.prop
      if (this.pageModule.sortName) {
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
