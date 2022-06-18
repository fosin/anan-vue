<template>
  <div class="app-container calendar-list-container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      style="width: 100%"
      @handle-add="handleAdd()"
      @handle-row-click="handleRowClick"
    >
      <template slot="filter-content" />
      <template slot="data-columns">
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
        <el-table-column :label="$t('table.actions')" align="center" width="80px" fixed="right">
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
          </template>
        </el-table-column>
      </template>
    </data-table>

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
import DataTable from '@/components/DataTable'

import { getDictionary, postDictionary, putDictionary } from '@/utils/dic'
import { listUserByTopId } from '@/views/platform/user/user'

export default {
  name: 'DictionaryHeader',
  components: {
    DataTable
  },
  filters: {},
  data() {
    return {
      dictionaryList: null,
      listQuery: {
        listUrl: 'gateway/platform/v1/dictionary/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          colSpan: 12,
          input: null,
          cols: ['name', 'description'],
          placeholder: this.$t('anan_dictionary_detail.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            name: null,
            description: null,
            queryRule: {
              logiOperator: 'or',
              relaRules: [
                {
                  fieldName: 'name',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'description',
                  relaOperator: 'like'
                }
              ]
            },
            sortRules: [{
              sortName: 'id',
              sortOrder: 'ASC'
            }]
          }
        }
      },
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete'),
            url: 'gateway/platform/v1/dictionary/ids',
            method: 'delete',
            permissionId: '61',
            confirm: true
          },
          {
            value: 'disable',
            label: this.$t('table.disable'),
            url: 'gateway/platform/v1/dictionary/field/status/1',
            method: 'post',
            permissionId: '60',
            confirm: false
          },
          {
            value: 'enable',
            label: this.$t('table.enable'),
            url: 'gateway/platform/v1/dictionary/field/status/0',
            method: 'post',
            permissionId: '60',
            confirm: false
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '59'
        },
        tableRowClass: {
          column: 'status',
          data: [
            {
              key: 1,
              value: 'info-row'
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
      this.listQuery.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      this.pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data.data
    }).catch(reason => {
      this.$notify({
        title: '获取所有用户失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    this.$refs.pagingTable.getList()
  },
  methods: {
    getTypeName(type) {
      const typeOption = this.typeOptions.filter(value => {
        return value.name === type
      })
      return typeOption.length > 0 ? typeOption[0].value : type
    },
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getDictionary(row.id).then(response => {
        this.form = response.data.data
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
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postDictionary(this.form).then(() => {
            this.dialogFormVisible = false
            this.$refs.pagingTable.getList()
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
            this.$refs.pagingTable.getList()
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
    handleRowClick(row, event, column) {
      if (!this.form || this.form.id !== row.id) {
        this.form = row
        this.$emit('dic-row-click', row, event, column)
      }
    }
  }
}
</script>
