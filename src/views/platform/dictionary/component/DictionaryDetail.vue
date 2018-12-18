<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="支持字典明细项代码、字典明细项值查找" v-model="pageModule.searchText">
      </el-input>
      <el-button-group>
        <el-button round v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
          {{$t('table.search')}}
        </el-button>
        <el-button round v-waves v-permission="'62'" size="small" class="filter-item" style="margin-left: 5px;"
                   @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}
        </el-button>
        <el-button round v-waves type="success" v-permission="'63'" size="small" class="filter-item" style="margin-left: 5px;"
                   icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
        </el-button>
        <el-button round v-waves type="danger" v-permission="'64'" size="small" class="filter-item" style="margin-left: 5px;"
                   icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
        </el-button>
      </el-button-group>
    </div>

    <el-table :data="dictionaryDetailList" v-loading="listLoading" element-loading-text="努力加载中"
              ref="dictionaryDetailTable"
              border fit highlight-current-row style="width: 100%"
              @sort-change="sortChange" @row-click="rowClick" :default-sort="{prop: 'name'}">
      <el-table-column label="明细键" sortable prop="name" width="90px">
      </el-table-column>
      <el-table-column align="center" label="明细值" sortable prop="value">
      </el-table-column>
      <el-table-column align="center" label="标准代码" sortable prop="scode" width="120px">
      </el-table-column>
      <el-table-column align="center" label="顺序" sortable prop="sort" width="80px">
      </el-table-column>
      <el-table-column align="center" label="状态" sortable prop="status" width="80px">
        <template slot-scope="scope">
          <span>{{getStatusValue(scope.row.status)}}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" small
                     :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="selectedDictionary.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="字典明细项键" prop="name">
          <el-input v-model="form.name" placeholder="字典明细项键,是一个字段的唯一标识，不能重复"></el-input>
        </el-form-item>
        <el-form-item label="字典明细项值" prop="value">
          <el-input v-model="form.value" placeholder="字典明细项键对应的字典明细项值"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="排列顺序，用于展示数据时的上下顺序，值越小越靠前"></el-input>
        </el-form-item>
        <el-form-item label="标准代码" prop="scode">
          <el-input v-model="form.scode" placeholder="标准代码"></el-input>
        </el-form-item>
        <el-form-item label="作用域" prop="scope">
          <el-input v-model="form.scope" placeholder="作用域"></el-input>
        </el-form-item>
        <el-form-item prop="status">
          <el-switch v-model="form.status"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-text="启用"
                     inactive-text="禁用"
                     active-value=0
                     inactive-value=1>
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button round v-if="dialogStatus==='create'" type="primary" @click="create('form')" icon="el-icon-circle-check"
                   autofocus>{{$t('table.confirm')}}
        </el-button>
        <el-button round v-else type="primary" @click="update('form')" icon="el-icon-circle-check" autofocus>
          {{$t('table.update')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDictionaryDetail,
    postDictionaryDetail,
    putDictionaryDetail,
    deleteDictionaryDetail,
    listDictionaryDetailPage
  } from '../dictionary'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  export default {
    name: 'dictionaryDetail',
    directives: {
      waves
    },
    created() {
      this.asyncLoadDictionaryByCode(11, (data) => {
        this.statusOptions = data
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
      this.asyncOrganizParameterValue('DefaultDictionaryDetailNameAndSort', '1', '新增字典明细时是否按当前数据总量自动生成字典key和字典Sort，0=不自动 1=自动，默认为自动', (data) => {
        this.DefaultDictionaryDetailNameAndSort = data
      })
    },
    data() {
      return {
        selectedDictionary: {},
        dictionaryDetailList: null,
        total: null,
        listLoading: false,
        DefaultDictionaryDetailNameAndSort: 1,
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
          sort: [
            {
              required: true,
              message: '字典明细项顺序不能为空',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '字典明细项键不能为空',
              trigger: 'blur'
            }
          ]
        },
        statusOptions: [],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        }
      }
    },
    methods: {
      getStatusValue(status) {
        if (this.statusOptions && this.statusOptions.length > 0) {
          const statusOption = this.statusOptions.filter(value => {
            return value.name === status
          })
          return statusOption.length > 0 ? statusOption[0].value : status
        }
        return status
      },
      getList(row) {
        if (row && row.code) {
          this.selectedDictionary = row
        } else {
          if (!this.selectedDictionary.code) {
            return
          }
        }
        this.listLoading = true
        listDictionaryDetailPage(this.pageModule, this.selectedDictionary.code).then(response => {
          this.dictionaryDetailList = response.data.rows
          this.total = response.data.total
          this.listLoading = false
        }).catch(reason => {
          this.$notify({
            title: '获取字典明细项列表失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      },
      handleFilter() {
        if (!this.selectedDictionary || !this.selectedDictionary.code) {
          this.$message({
            message: '操作前请先选择一个字典明细项!'
          })
          return
        }
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
        if (!this.selectedDictionary || !this.selectedDictionary.code) {
          this.$message({
            message: '操作前请先选择一个字典明细项!'
          })
          return
        }
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
        getDictionaryDetail(this.form.id).then(response => {
          this.form = response.data
          this.form.status = this.form.status + ''
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        }).catch(reason => {
          this.$notify({
            title: '获取字典明细项失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      },
      handleDelete() {
        if (!this.form || !this.form.id) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        this.$confirm(
          '此操作将永久删除字典明细项( ' + this.form.value + ' )的相关数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          deleteDictionaryDetail(this.form.id).then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除字典明细项成功!',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '删除字典明细项失败',
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
            postDictionaryDetail(this.form).then(() => {
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
                title: '新建字典明细项失败',
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
            putDictionaryDetail(this.form).then(() => {
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
                title: '更新字典明细项信息失败',
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
        const sort = this.total + 1
        this.form = {
          id: undefined,
          name: this.DefaultDictionaryDetailNameAndSort === 1 ? sort : undefined,
          value: undefined,
          scode: undefined,
          scope: undefined,
          sort: this.DefaultDictionaryDetailNameAndSort === 1 ? sort : undefined,
          status: '0',
          code: this.selectedDictionary.code
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
