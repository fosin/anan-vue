<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="支持名称、类别及标识查找" v-model="pageModule.searchText">
      </el-input>
      <el-button class="filter-item" type="primary" size="small" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>
      <el-button v-permission="'config_parameter_add'" size="small" class="filter-item" style="margin-left: 5px;"
                 @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}
      </el-button>
      <el-button type="success" v-permission="'config_parameter_edit'" size="small" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
      </el-button>
      <el-button type="danger" v-permission="'config_parameter_delete'" size="small" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
      </el-button>
    </div>

    <el-table :data="parameterList" v-loading="listLoading" element-loading-text="努力加载中" ref="parameterTable"
              border fit highlight-current-row style="width: 100%" :default-sort="{prop: 'key'}"
              @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" label="参数键" sortable prop="key">
      </el-table-column>
      <el-table-column align="center" label="参数值" sortable prop="value">
      </el-table-column>
      <el-table-column align="center" label="默认值" sortable prop="default_value">
      </el-table-column>
      <el-table-column align="center" label="参数类别" sortable prop="type">
        <template slot-scope="scope">
          <span>{{getTypeName(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作用域" sortable prop="scope">
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageModule.pageNumber" :page-sizes="[10,25,50,100]"
                     :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="参数键" prop="key">
          <el-input v-model="form.key" placeholder="参数键"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="form.value" placeholder="参数值"></el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="default_value">
          <el-input v-model="form.default_value" placeholder="默认值"></el-input>
        </el-form-item>
        <el-form-item label="参数类别" prop="type">
          <el-select class="filter-item" v-model="form.type" placeholder="请选择参数类别">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.value"
                       :value="item.key" :disabled="item.status === 1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作用域" prop="scope">
          <el-input v-model="form.scope" placeholder="作用域"></el-input>
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
    deleteParameter,
    listParameterPage
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
          pageSize: 25,
          searchText: '',
          sortName: '',
          sortOrder: ''
        },
        form: {},
        rules: {
          key: [
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
      this.postDictionaryDetailsByCode(10, (data) => {
        this.typeOptions = data
      })
    },
    methods: {
      getTypeName(type) {
        const typeOption = this.typeOptions.filter(value => {
          return value.key === type
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
        if (!this.form || !this.form.key) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        getParameter(this.form.key).then(response => {
          this.form = response.data.data
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
        if (!this.form || !this.form.key) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        this.$confirm(
          '此操作将永久删除参数名( ' + this.form.key + ' )的相关数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          deleteParameter(this.form.key).then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除参数成功!',
              type: 'success',
              duration: 2000
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
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            postParameter(this.form).then(() => {
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
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            putParameter(this.form).then(() => {
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
          key: undefined,
          value: undefined,
          default_value: undefined,
          type: undefined,
          scope: undefined
        }
      },
      sortChange(column) {
        this.pageModule.sortOrder = column.column.order === 'descending' ? 'DESC' : 'ASC'
        this.pageModule.sortName = column.column.property
        this.getList()
      },
      rowClick(row, event, column) {
        this.form = row
      }
    }
  }
</script>
