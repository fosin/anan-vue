<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 300px;" class="filter-item"
                placeholder="支持参数键、参数值、说明查找" v-model="pageModule.searchText">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>
      <el-button v-permission="'config_parameter_add'" class="filter-item" style="margin-left: 5px;"
                 @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}
      </el-button>
      <el-button type="success" v-permission="'config_parameter_edit'" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
      </el-button>
      <el-button type="danger" v-permission="'config_parameter_delete'" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
      </el-button>
      <el-button type="warning" v-permission="'config_parameter_apply'" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-upload" @click="handleApply()">{{$t('table.apply')}}
      </el-button>
      <el-button type="warning" v-permission="'config_parameter_applys'" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-upload" @click="handleApplys()">{{$t('table.applys')}}
      </el-button>
    </div>

    <el-table :data="parameterList" v-loading="listLoading" element-loading-text="努力加载中" ref="parameterTable"
              border fit highlight-current-row style="width: 100%" :default-sort="{prop: 'name'}"
              @sort-change="sortChange" @row-click="rowClick" :row-class-name="tableRowClassName">
      <el-table-column align="center" label="参数键" sortable prop="name" width="200px">
      </el-table-column>
      <el-table-column align="center" label="参数值" sortable prop="value" width="120px">
      </el-table-column>
      <el-table-column align="center" label="默认值" sortable prop="defaultValue" width="120px">
      </el-table-column>
      <el-table-column align="center" label="说明" sortable prop="description">
      </el-table-column>
      <el-table-column align="center" label="参数类别" sortable prop="type" width="120px">
        <template slot-scope="scope">
          <span>{{getTypeName(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作用域" sortable prop="scope" width="100px">
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes"
                     :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="参数键" prop="name">
          <el-input v-model="form.name" placeholder="参数键"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="form.value" placeholder="参数值"></el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="form.defaultValue" placeholder="默认值"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" placeholder="说明"></el-input>
        </el-form-item>
        <el-form-item label="参数类别" prop="type">
          <el-select class="filter-item" v-model="form.type" placeholder="请选择参数类别">
            <el-option v-for="item in typeOptions" :key="item.name" :label="item.value"
                       :value="item.name" :disabled="item.status === 1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作用域" prop="scope">
          <el-input v-model="form.scope" placeholder="作用域，为空时表示适用与所有域"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" icon="el-icon-circle-check"
                   autofocus>{{$t('table.confirm')}}
        </el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-circle-check" autofocus>
          {{$t('table.update')}}
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
  } from '@/api/parameter'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  export default {
    name: 'config_parameter',
    directives: {
      waves
    },
    data() {
      return {
        parameterList: null,
        total: null,
        listLoading: false,
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          searchText: '',
          sortName: '',
          sortOrder: ''
        },
        pageSizes: [],
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
        }
      }
    },
    created() {
      this.asyncLoadDictionaryByCode(10, (data) => {
        this.typeOptions = data
      })
      this.asyncOrganizParameterValue('DefaultPageSizes', '10,25,50,100', '表格默认每页记录数可选择项', (data) => {
        this.pageSizes = data.split(',')
      })
    },
    methods: {
      getTypeName(type) {
        const typeOption = this.typeOptions.filter(value => {
          return value.name === type
        })
        return typeOption.length > 0 ? typeOption[0].value : type
      },
      getList() {
        this.listLoading = true
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
          putParameter(this.form).then(response => {
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
        }).catch(reason => {
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
          applyParameter(this.form.id).then(response => {
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
        }).catch(reason => {
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
          applysParameter().then(response => {
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
        }).catch(reason => {
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            postParameter(this.form).then((response) => {
              this.dialogFormVisible = false
              this.updateList(response.data)
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
            putParameter(this.form).then((response) => {
              this.dialogFormVisible = false
              this.updateList(this.form)
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
        this.pageModule.sortOrder = column.column.order === 'descending' ? 'DESC' : 'ASC'
        this.pageModule.sortName = column.column.property
        this.getList()
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

<style>
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
</style>
