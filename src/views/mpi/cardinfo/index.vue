<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-waves v-permission="'1'" round type="primary" class="filter-item" style="margin-left: 5px;" icon="el-icon-circle-plus" size="mini" @click="getList">
          {{ $t('table.refresh') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-circle-plus" size="mini" @click="handleAdd()">
          {{ $t('table.add') }}
        </el-button>
        <el-button v-waves v-permission="'1'" :disabled="disabled" round type="success" class="filter-item" style="margin-left: 5px;" icon="el-icon-edit" size="mini" @click="handleEdit()">
          {{ $t('table.edit') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'1'"
          :disabled="disabled"
          round
          type="warning"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-warning"
          size="mini"
          @click="handleLoss()"
        >
          {{ $t('table.loss') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'1'"
          :disabled="disabled"
          round
          type="danger"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-arrow-right"
          size="mini"
          @click="handleLogout()"
        >
          {{ $t('table.logout') }}
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
      <el-table-column align="center" label="卡类型" sortable prop="cardType">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(cardTypeOptions, scope.row.cardType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号" sortable prop="cardNo" />
      <el-table-column align="center" label="卡状态" sortable prop="status">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(statusOptions, scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效期" sortable prop="validtime" width="140px" />
      <el-table-column align="center" label="修改时间" sortable prop="updateTime" width="140px" />
      <el-table-column align="center" label="修改机构" sortable prop="modifyUnit" />
      <el-table-column align="center" label="修改人" sortable prop="modifier" />
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="450px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="卡类型" prop="cardType">
          <el-select v-model="form.cardType" class="filter-item" placeholder="请选择卡类型">
            <el-option v-for="item in cardTypeOptions" :key="item.name" :label="item.value" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡号" prop="cardNo">
          <el-input v-model="form.cardNo" placeholder="卡号" />
        </el-form-item>
        <el-form-item label="卡内码" prop="cardCode">
          <el-input v-model="form.cardCode" placeholder="卡内码" />
        </el-form-item>
        <el-form-item label="有效期" prop="validtime">
          <el-date-picker
            v-model="form.validtime"
            align="right"
            type="date"
            placeholder="请选择有效期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
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
import { deleteCardinfo, getCardinfo, listCardinfoByEmpId, postCardinfo, putCardinfo } from './cardinfo'

export default {
  name: 'MpiCardinfo',

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
      pageModule: {
        pageNumber: 1,
        pageSize: 5,
        params: {
          sortRules: [{
            sortName: 'updateTime',
            sortOrder: 'DESC' }
          ]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
      cardTypeOptions: [],
      statusOptions: [],
      form: {},
      rules: {
        cardType: [
          {
            required: true,
            message: '请选择卡类型',
            trigger: 'blur'
          }
        ],
        cardNo: [
          {
            required: true,
            message: '请输入卡号',
            trigger: 'blur'
          }
        ],
        validtime: [
          {
            required: true,
            message: '请选择有效期',
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
    this.loadDictionaryById(135).then(res => {
      this.cardTypeOptions = res.details
    })
    this.loadDictionaryById(136).then(res => {
      this.statusOptions = res.details
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
        listCardinfoByEmpId(this.mpiId, this.pageModule).then(response => {
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
    handleLoss() {
      this.$message({
        message: '该操作还未实现!'
      })
    },
    handleLogout() {
      this.$message({
        message: '该操作还未实现!'
      })
    },
    handleEdit() {
      if (!this.form || !this.form['cardId']) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getCardinfo(this.form['cardId']).then(response => {
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
      if (!this.form || !this.form['cardId']) {
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
        deleteCardinfo(this.form['cardId']).then(response => {
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
          postCardinfo(this.form).then(() => {
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
          putCardinfo(this.form).then(() => {
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
        mpiId: this.mpiId,
        status: 0
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
