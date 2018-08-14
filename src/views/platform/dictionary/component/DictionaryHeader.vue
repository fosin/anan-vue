<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="支持名称、类别及标识查找" v-model="pageModule.searchText">
      </el-input>
      <el-button class="filter-item" type="primary" size="small" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>
      <el-button v-permission="'config_dictionary_add'" size="small" class="filter-item" style="margin-left: 5px;"
                 @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}
      </el-button>
      <el-button type="success" v-permission="'config_dictionary_edit'" size="small" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
      </el-button>
      <el-button type="danger" v-permission="'config_dictionary_delete'" size="small" class="filter-item" style="margin-left: 5px;"
                 icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
      </el-button>
    </div>

    <el-table :data="dictionaryList" v-loading="listLoading" element-loading-text="努力加载中" ref="dictionaryTable"
              border fit highlight-current-row style="width: 100%" :default-sort="{prop: 'code'}"
              @sort-change="sortChange" @row-click="rowClick" v-on:row-click="$emit('dic-row-click', $event)">
      <el-table-column label="字典编号" sortable prop="code">
      </el-table-column>
      <el-table-column label="字典名称" sortable prop="name">
      </el-table-column>
      <el-table-column align="center" label="字典类别" sortable prop="type">
        <template slot-scope="scope">
          <span>{{getTypeName(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作用域" sortable prop="scope">
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
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" placeholder="字典名称"></el-input>
        </el-form-item>
        <el-form-item label="作用域" prop="scope">
          <el-input v-model="form.scope" placeholder="作用域"></el-input>
        </el-form-item>
        <el-form-item label="字典类别" prop="type">
          <el-select class="filter-item" v-model="form.type" placeholder="请选择字典类别">
            <el-option v-for="item in typeOptions" :key="item.name" :label="item.value" :value="item.name" :disabled="item.status === 1"></el-option>
          </el-select>
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
    getDictionary,
    postDictionary,
    putDictionary,
    deleteDictionary,
    listDictionaryPage
  } from '@/api/dictionary'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  export default {
    name: 'dictionaryHeader',
    directives: {
      waves
    },
    data() {
      return {
        dictionaryList: null,
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
              message: '字典名称不能为空',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
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
    filters: {
    },
    created() {
      this.asyncLoadDictionaryByCode(1, (data) => {
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
        listDictionaryPage(this.pageModule).then(response => {
          this.dictionaryList = response.data.rows
          this.total = response.data.total
          this.listLoading = false
          if (this.dictionaryList.length > 0) {
            this.$refs.dictionaryTable.setCurrentRow(this.dictionaryList[0])
          }
        }).catch(reason => {
          this.$notify({
            title: '获取字典列表失败',
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
        if (!this.form || !this.form.code || !this.form.name) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        getDictionary(this.form.code).then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        }).catch(reason => {
          this.$notify({
            title: '获取字典失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      },
      handleDelete() {
        if (!this.form || !this.form.code || !this.form.name) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        this.$confirm(
          '此操作将永久删除字典名( ' + this.form.name + ' )的相关数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          deleteDictionary(this.form.code).then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除字典成功!',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '删除字典失败',
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
            postDictionary(this.form).then(() => {
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
                title: '新建字典失败',
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
            putDictionary(this.form).then(() => {
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
                title: '更新字典信息失败',
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
          code: undefined,
          name: undefined,
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
