<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="pageModule.params.name"
        :placeholder="$t('anan_dictionary.searchText')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button-group>
        <el-button
          v-waves
          round
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'59'"
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleAdd()"
        >
          {{ $t('table.add') }}
        </el-button>
      </el-button-group>
    </div>

    <el-table
      ref="dictionaryTable"
      v-loading="listLoading"
      :data="dictionaryList"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column :label="$t('anan_dictionary.id.label')" align="center" sortable prop="id" width="70px" />
      <el-table-column :label="$t('anan_dictionary.name.label')" align="center" sortable prop="name" width="120px" />
      <el-table-column :label="$t('anan_dictionary.type.label')" align="center" sortable prop="type" width="150px">
        <template slot-scope="scope">
          <span>{{ getTypeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('anan_dictionary.scope.label')" align="center" sortable prop="scope" width="120px" />
      <el-table-column
        :label="$t('table.updateBy.label')"
        align="center"
        sortable
        prop="updateBy"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ getDicValue(organizTopUsers,"id",scope.row.updateBy,"username") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updateTime.label')" width="160px" align="center" sortable prop="updateTime" />
      <el-table-column :label="$t('table.actions')" align="center" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
            <el-button
              v-waves
              v-permission="'60'"
              round
              size="mini"
              type="success"
              class="filter-item"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('table.delete')" placement="top">
            <el-button
              v-waves
              v-permission="'61'"
              round
              size="mini"
              type="danger"
              class="filter-item"
              style="margin-left: 5px;"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="pageModule.pageNumber"
        :page-sizes="pageSizes"
        :page-size="pageModule.pageSize"
        :total="total"
        small
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('anan_dictionary.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('anan_dictionary.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary.scope.label')" prop="scope">
          <el-input v-model="form.scope" :placeholder="$t('anan_dictionary.scope.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary.type.label')" prop="type">
          <el-select v-model="form.type" :placeholder="$t('anan_dictionary.type.placeholder')" class="filter-item">
            <el-option
              v-for="item in typeOptions"
              :key="item.name"
              :label="item.value"
              :value="item.name"
              :disabled="item.status === 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary.description.label')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          v-if="dialogStatus==='create'"
          round
          type="primary"
          icon="el-icon-circle-check"
          autofocus
          @click="create('form')"
        >
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
import {
  getDictionary,
  postDictionary,
  putDictionary,
  deleteDictionary,
  listDictionaryPage
} from '../dictionary'
import { listUserByTopId } from '@/views/platform/user/user'

export default {
  name: 'DictionaryHeader',
  filters: {},
  data() {
    return {
      dictionaryList: null,
      total: null,
      listLoading: false,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          name: '',
          queryRule: {
            logiOperator: 'or',
            relaRules: [
              {
                fieldName: 'name',
                relaOperator: 'like'
              }]
          },
          sortRules: [{
            sortName: 'id',
            sortOrder: 'ASC'
          }]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
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
      organizTopUsers: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  mounted() {
    this.loadDictionaryById(1).then(res => {
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
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data
    }).catch(reason => {
      this.$notify({
        title: '获取所有用户失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    this.getList()
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
    handleEdit(row) {
      getDictionary(row.id).then(response => {
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
    handleDelete(row) {
      this.$confirm(
        '此操作将永久删除字典名( ' + row.name + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteDictionary(row.id).then(() => {
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
        id: undefined,
        name: undefined,
        type: undefined,
        scope: undefined
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
      if (!this.form || this.form.id !== row.id) {
        this.form = row
        this.$emit('dic-row-click', row, event, column)
      }
    }
  }
}
</script>
