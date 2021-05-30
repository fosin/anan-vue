<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="pageModule.params.value"
        :placeholder="$t('anan_dictionary_detail.searchText')"
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
          size="small"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'62'"
          round
          size="small"
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >
          {{ $t('table.add') }}
        </el-button>
      </el-button-group>
    </div>

    <el-table
      ref="dictionaryDetailTable"
      v-loading="listLoading"
      :data="dictionaryDetailList"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column
        :label="$t('anan_dictionary_detail.name.label')"
        align="center"
        sortable
        prop="name"
        width="120px"
      />
      <el-table-column :label="$t('anan_dictionary_detail.value.label')" align="center" sortable prop="value" />
      <el-table-column
        :label="$t('anan_dictionary_detail.scode.label')"
        align="center"
        sortable
        prop="scode"
        width="120px"
      />
      <el-table-column
        :label="$t('anan_dictionary_detail.sort.label')"
        align="center"
        sortable
        prop="sort"
        width="80px"
      />
      <el-table-column
        :label="$t('anan_dictionary_detail.status.label')"
        align="center"
        sortable
        prop="status"
        width="90px"
      >
        <template slot-scope="scope">
          <span>{{ getStatusValue(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
            <el-button
              v-waves
              v-permission="'63'"
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
              v-permission="'64'"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('anan_dictionary.name.label')">
          <el-input v-model="selectedDictionary.name" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('anan_dictionary_detail.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.value.label')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('anan_dictionary_detail.value.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.sort.label')" prop="sort">
          <el-input v-model="form.sort" :placeholder="$t('anan_dictionary_detail.sort.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.scode.label')" prop="scode">
          <el-input v-model="form.scode" :placeholder="$t('anan_dictionary_detail.scode.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.scope.label')" prop="scope">
          <el-input v-model="form.scope" :placeholder="$t('anan_dictionary_detail.scope.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.status.label')" prop="status">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.description.label')" prop="description">
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
  getDictionaryDetail,
  postDictionaryDetail,
  putDictionaryDetail,
  deleteDictionaryDetail,
  listDictionaryDetailPage
} from '../dictionary'

export default {
  name: 'DictionaryDetail',
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
        params: {
          dictionaryId: 0,
          value: '',
          queryRule: {
            relaRules: [
              {
                filedName: 'value',
                relaOperator: 'like'
              },
              {
                filedName: 'dictionaryId',
                relaOperator: 'equal'
              }
            ]
          },
          sortRules: [{
            sortName: 'name',
            sortOrder: 'ASC'
          }]
        }
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
  mounted() {
    this.loadDictionaryById(11).then(res => {
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
    this.loadOrganizParameterValue('DefaultDictionaryDetailNameAndSort', '1', '新增字典明细时是否按当前数据总量自动生成字典key和字典Sort，0=不自动 1=自动，默认为自动').then(res => {
      this.DefaultDictionaryDetailNameAndSort = res
    })
    this.getList()
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
      if (row && row.id) {
        this.selectedDictionary = row
      } else {
        if (!this.selectedDictionary.id) {
          return
        }
      }
      this.pageModule.params.dictionaryId = this.selectedDictionary.id
      this.listLoading = true
      listDictionaryDetailPage(this.pageModule).then(response => {
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
      if (!this.selectedDictionary || !this.selectedDictionary.id) {
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
      if (!this.selectedDictionary || !this.selectedDictionary.id) {
        this.$message({
          message: '操作前请先选择一个字典明细项!'
        })
        return
      }
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getDictionaryDetail(row.id).then(response => {
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
    handleDelete(row) {
      this.$confirm(
        '此操作将永久删除字典明细项( ' + row.value + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteDictionaryDetail(row.id).then(() => {
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
        dictionaryId: this.selectedDictionary.id,
        used: 0
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
