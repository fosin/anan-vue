<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-waves v-permission="'1'" round type="primary" class="filter-item" style="margin-left: 5px;" icon="el-icon-circle-plus" size="mini" @click="getList">
          {{ $t('table.refresh') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round type="primary" class="filter-item" style="margin-left: 5px;" icon="el-icon-circle-plus" size="mini" @click="handleAdd">
          {{ $t('table.add') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round type="success" class="filter-item" style="margin-left: 5px;" icon="el-icon-edit" size="mini" @click="handleEdit()">
          {{ $t('table.edit') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round type="danger" class="filter-item" style="margin-left: 5px;" icon="el-icon-delete" size="mini" @click="handleDelete()">
          {{ $t('table.delete') }}
        </el-button>
      </el-button-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'updateTime', order: 'descending'}"
      :disabled="disabled"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      size="mini"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column align="center" label="地址类型" sortable prop="addressType">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(addressTypeOptions, scope.row.addressType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" sortable prop="address" width="150px" />
      <el-table-column align="center" label="邮编" sortable prop="postal" width="80px" />
      <el-table-column align="center" label="修改时间" sortable prop="updateTime" width="140px" />
      <el-table-column align="center" label="修改机构" sortable prop="modifyUnit" />
      <el-table-column align="center" label="修改人" sortable prop="modifier" />
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="pageModule.pageNumber"
        :page-sizes="pageSizes"
        :page-size="pageModule.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="地址类型" prop="addressType">
          <el-select v-model="form.addressType" class="filter-item" placeholder="请选择地址类型">
            <el-option v-for="item in addressTypeOptions" :key="item.name" :label="item.value" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="地址" />
        </el-form-item>
        <el-form-item label="邮编" prop="postal">
          <el-input v-model="form.postal" placeholder="邮编" />
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
import { getAddress, postAddress, putAddress, deleteAddress, listAddressByEmpId } from './address'

export default {
  name: 'MpiAddress',

  props: {
    disabled: {
      type: Boolean,
      default: undefined
    },
    mpiId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      pageModule: {
        pageNumber: 1,
        pageSize: 5,
        searchText: '',
        sortName: '',
        sortOrder: ''
      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      rules: {
        addressType: [
          {
            required: true,
            message: '请选择地址类型',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      addressTypeOptions: []
    }
  },
  mounted() {
    this.asyncLoadDictionaryByCode(134, (data) => {
      this.addressTypeOptions = data
    })
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
        listAddressByEmpId(this.mpiId, this.pageModule).then(response => {
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
      if (!this.form || !this.form['addressId']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getAddress(this.form['addressId']).then(response => {
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
      if (!this.form || !this.form['addressId']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteAddress(this.form['addressId']).then(response => {
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
          postAddress(this.form).then(() => {
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
          putAddress(this.form).then(() => {
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
