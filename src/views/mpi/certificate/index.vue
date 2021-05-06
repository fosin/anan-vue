<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-waves v-permission="'1'" round type="primary" class="filter-item" style="margin-left: 5px;" icon="el-icon-circle-plus" size="mini" @click="getList">
          {{ $t('table.refresh') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round size="mini" class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-circle-plus" @click="handleAdd">
          {{ $t('table.add') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round size="mini" type="success" class="filter-item" style="margin-left: 5px;" icon="el-icon-edit" @click="handleEdit()">
          {{ $t('table.edit') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round size="mini" type="danger" class="filter-item" style="margin-left: 5px;" icon="el-icon-delete" @click="handleDelete()">
          {{ $t('table.delete') }}
        </el-button>
      </el-button-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column align="center" label="证件类型" sortable prop="certificateType">
        <template slot-scope="scope">
          <span>{{ getDicDetailValue(certificateTypeOptions, scope.row.certificateType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号" sortable prop="certificateNo" />
      <el-table-column align="center" label="修改时间" sortable prop="updateTime" />
      <el-table-column align="center" label="修改单位" sortable prop="modifyUnit" />
      <el-table-column align="center" label="修改人" sortable prop="modifier" />
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="450px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="证件类型" prop="certificateType">
          <el-select v-model="form.certificateType" class="filter-item" placeholder="请选择地址类型">
            <el-option v-for="item in certificateTypeOptions" :key="item.name" :label="item.value" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="certificateNo">
          <el-input v-model="form.certificateNo" placeholder="证件号" />
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
import { getCertificate, postCertificate, putCertificate, deleteCertificate, listCertificateByEmpId } from './certificate'

export default {
  name: 'MpiCertificate',

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
      listLoading: false,
      certificateTypeOptions: [],
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          sortRules: [{ sortName: 'updateTime',
            sortOrder: 'DESC' }]
        }

      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      rules: {
        certificateType: [
          {
            required: true,
            message: '请选择证件类型',
            trigger: 'blur'
          }
        ],
        certificateNo: [
          {
            required: true,
            message: '请输入证件号码',
            trigger: 'blur'
          }
        ]
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
    this.loadDictionaryById(137).then(res => {
      this.certificateTypeOptions = res.details
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
        listCertificateByEmpId(this.mpiId, this.pageModule).then(response => {
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
      if (!this.form || !this.form['certificateId']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getCertificate(this.form['certificateId']).then(response => {
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
      if (!this.form || !this.form['certificateId']) {
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
        deleteCertificate(this.form['certificateId']).then(response => {
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
          postCertificate(this.form).then(() => {
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
          putCertificate(this.form).then(() => {
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
