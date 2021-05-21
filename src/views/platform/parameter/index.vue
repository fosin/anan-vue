<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="pageModule.params.name"
        :placeholder="$t('anan_parameter.searchText')"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button-group>
        <el-button v-waves round class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'53'"
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >
          {{ $t('table.add') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'54'"
          round
          type="success"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-edit"
          @click="handleEdit()"
        >
          {{ $t('table.edit') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'55'"
          round
          type="danger"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-delete"
          @click="handleDelete()"
        >
          {{ $t('table.delete') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'56'"
          round
          type="warning"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-upload"
          @click="handleApply()"
        >
          {{ $t('table.apply') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'57'"
          round
          type="warning"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-upload"
          @click="handleApplys()"
        >
          {{ $t('table.applys') }}
        </el-button>
      </el-button-group>
    </div>

    <el-table
      ref="parameterTable"
      v-loading="listLoading"
      :data="parameterList"
      :row-class-name="tableRowClassName"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column :label="$t('anan_parameter.name.label')" align="center" sortable prop="name" width="200px" />
      <el-table-column :label="$t('anan_parameter.value.label')" align="center" sortable prop="value" width="120px" />
      <el-table-column :label="$t('anan_parameter.defaultValue.label')" align="center" sortable prop="defaultValue" width="130px" />
      <el-table-column :label="$t('anan_parameter.description.label')" align="center" sortable prop="description" />
      <el-table-column :label="$t('anan_parameter.type.label')" align="center" sortable prop="type" width="120px">
        <template slot-scope="scope">
          <span>{{ getTypeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('anan_parameter.scope.label')" align="center" sortable prop="scope" width="100px">
        <template slot-scope="scope">
          <span>{{ getScopeName(scope.row.type, scope.row.scope) }}</span>
        </template>
      </el-table-column>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('anan_parameter.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('anan_parameter.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.value.label')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('anan_parameter.value.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.defaultValue.label')" prop="defaultValue">
          <el-input v-model="form.defaultValue" :placeholder="$t('anan_parameter.defaultValue.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.description.label')" prop="description">
          <el-input v-model="form.description" :placeholder="$t('anan_parameter.description.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.type.label')" prop="type">
          <el-select v-model="form.type" :placeholder="$t('anan_parameter.type.placeholder')" :disabled="dialogStatus!=='create'" class="filter-item" @change="typeChange">
            <el-option
              v-for="item in typeOptions"
              :key="item.name"
              :label="item.value"
              :value="item.name"
              :disabled="item.status === 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type ===1 || form.type === 2" :label="$t('anan_parameter.scope.label')" prop="scope">
          <el-select v-model="form.scope" :placeholder="$t('anan_parameter.scope.placeholder')" class="filter-item">
            <el-option
              v-for="item in scopeOptions"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            >
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              <span style="float: right">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves round icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          v-if="dialogStatus==='create'"
          v-waves
          round
          type="primary"
          icon="el-icon-circle-check"
          autofocus
          @click="create('form')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else v-waves round type="primary" icon="el-icon-circle-check" autofocus @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getParameter,
  postParameter,
  putParameter,
  listParameterPage,
  applyParameter,
  applysParameter
} from './parameter'
import { listOrganizUser } from '../user/user'
import { listOrganizAllChild } from '../organization/organization'
import { mapGetters } from 'vuex'

export default {
  name: 'ConfigParameter',
  data() {
    return {
      parameterList: null,
      total: null,
      listLoading: false,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          name: '',
          value: '',
          defaultValue: '',
          description: '',
          queryRule: {
            logiOperator: 'or',
            relaRules: [
              {
                filedName: 'description',
                relaOperator: 'like'
              },
              {
                filedName: 'name',
                relaOperator: 'like'
              },
              {
                filedName: 'defaultValue',
                relaOperator: 'like'
              },
              {
                filedName: 'value',
                relaOperator: 'like'
              }
            ]
          },
          sortRules: [
            {
              sortName: 'name',
              sortOrder: 'ASC'
            }
          ]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: '参数键不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '参数类型不能为空',
            trigger: 'blur'
          }
        ]
      },
      typeOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      typeScopeOptions: {},
      scopeOptions: [],
      oraganizOptions: [],
      organizUserOptions: []
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  mounted() {
    this.loadDictionaryById(10).then(res => {
      this.typeOptions = res.details
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
    this.listOrganizUser(this.ananUserInfo.organizId)
    this.listOrganizAllChild(this.ananUserInfo.organizId)
    this.getList()
  },
  methods: {
    typeChange(type) {
      let scopeOptions = this.typeScopeOptions[type]
      if (!scopeOptions) {
        scopeOptions = []
        this.typeScopeOptions[type] = {}
      }
      this.scopeOptions = scopeOptions
    },
    listOrganizUser(organizId) {
      listOrganizUser(organizId).then(response => {
        this.organizUserOptions = response.data
        const scopeOptions = []
        for (let i = 0; i < this.organizUserOptions.length; i++) {
          const user = this.organizUserOptions[i]
          const scope = {
            name: user.id + '',
            code: user.usercode,
            value: user.username
          }
          scopeOptions.push(scope)
        }
        const type = 2
        this.typeScopeOptions[type] = scopeOptions
      }).catch(reason => {
        this.$notify({
          title: '获取所有用户失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    listOrganizAllChild(organizId) {
      listOrganizAllChild(organizId).then(response => {
        this.oraganizOptions = response.data || []
        const scopeOptions = []
        for (let i = 0; i < this.oraganizOptions.length; i++) {
          const organiz = this.oraganizOptions[i]
          const scope = {
            name: organiz.id + '',
            code: organiz.code,
            value: organiz.name
          }
          scopeOptions.push(scope)
        }
        const type = 1
        this.typeScopeOptions[type] = scopeOptions
      }).catch(reason => {
        this.$notify({
          title: '查询后代机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getTypeName(type) {
      const typeOption = this.typeOptions.filter(value => {
        return value.name === type
      })
      return typeOption.length > 0 ? typeOption[0].value : type
    },
    getScopeName(type, scope) {
      const scopeOptions = this.typeScopeOptions[type]
      if (scopeOptions === undefined || scopeOptions === [] || scopeOptions === {}) {
        return scope
      }
      const scopeOption = scopeOptions.filter(value => {
        return value.name === scope
      })
      return scopeOption && scopeOption.length && scopeOption.length > 0 ? scopeOption[0].value : scope
    },
    getList() {
      this.listLoading = true
      this.pageModule.params.value = this.pageModule.params.name
      this.pageModule.params.defaultValue = this.pageModule.params.name
      this.pageModule.params.description = this.pageModule.params.name
      listParameterPage(this.pageModule).then(response => {
        this.parameterList = response.data.rows
        this.total = response.data.total
        this.listLoading = false
        if (this.parameterList.length > 0) {
          this.$refs.parameterTable.setCurrentRow(this.parameterList[0])
        }
      }).catch(reason => {
        this.$notify({
          title: '获取参数列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    updateList(data) {
      if (!data || !data.id) {
        return
      }
      let index = this.parameterList.length + 1
      for (let i = 0; i < this.parameterList.length; i++) {
        const user = this.parameterList[i]
        if (data.id === user.id) {
          index = i
          break
        }
      }
      this.parameterList[index] = data
    },
    deleteList(id) {
      if (!id) {
        return
      }
      for (let i = 0; i < this.parameterList.length; i++) {
        const user = this.parameterList[i]
        if (id === user.id) {
          this.parameterList.splice(i, 1)
          break
        }
      }
    },
    handleFilter() {
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
      if (!this.form || !this.form.id) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getParameter(this.form.id).then(response => {
        this.form = response.data
        this.scopeOptions = this.typeScopeOptions[this.form.type]
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取参数失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleDelete() {
      if (!this.form || !this.form.id || !this.form.name) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除参数名( ' + this.form.name + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.form.status = 2
        putParameter(this.form).then(() => {
          this.dialogFormVisible = false
          this.updateList(this.form)
          this.$notify({
            title: '删除参数成功',
            message: '若要立即生效则需要使用【发布】功能!',
            type: 'success',
            duration: 5000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除参数失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(() => {
      })
    },
    handleApply() {
      if (!this.form || !this.form.id || !this.form.name) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        '此操作将刷新参数名( ' + this.form.name + ' )的缓存数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        applyParameter(this.form.id).then(() => {
          if (this.form.status === 2) {
            this.deleteList(this.form.id)
          } else {
            this.form.status = 0
            this.updateList(this.form)
          }
          this.$notify({
            title: '成功',
            message: '发布参数成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '发布参数失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(() => {
      })
    },
    handleApplys() {
      this.$confirm(
        '此操作将刷新所有更改过参数的缓存数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        applysParameter().then(() => {
          for (let i = 0; i < this.parameterList.length; i++) {
            const paramter = this.parameterList[i]
            if (paramter.status === 2) {
              this.deleteList(paramter.id)
            } else if (paramter.status === 1) {
              paramter.status = 0
              this.updateList(paramter)
            }
          }
          this.$notify({
            title: '成功',
            message: '发布参数成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '发布参数失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(() => {
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postParameter(this.form).then(() => {
            this.dialogFormVisible = false
            // this.updateList(response.data)
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '新建参数失败',
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
        this.$refs[formName].resetFields()
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.status = 1
          putParameter(this.form).then(() => {
            this.dialogFormVisible = false
            this.updateList(this.form)
            // this.getList()
            this.$notify({
              title: '修改成功',
              message: '若要立即生效则需要使用【发布】功能!',
              type: 'success',
              duration: 5000
            })
          }).catch(reason => {
            this.$notify({
              title: '更新参数信息失败',
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
        id: undefined,
        name: undefined,
        value: undefined,
        defaultValue: undefined,
        type: undefined,
        scope: '',
        status: 0
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
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1) {
        return 'warning-row'
      } else if (row.status === 2) {
        return 'danger-row'
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .el-table .warning-row {
    color: #E6A23C;
  }

  .el-table .success-row {
    color: #67C23A;
  }

  .el-table .danger-row {
    color: #F56C6C;
  }

  .el-table .info-row {
    color: #909399;
  }
  .el-select {
    width: 100%;
  }
</style>
